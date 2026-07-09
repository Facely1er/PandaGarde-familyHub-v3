import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const CDP_PORT = Number(process.env.PG_ANDROID_CDP_PORT ?? 9222);
const BUNDLE_ID = 'com.pandagarde.familyhub';

function runAdb(adbPath, args, { encoding = 'utf8' } = {}) {
  const result = spawnSync(adbPath, args, {
    encoding,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  return {
    status: result.status ?? 1,
    stdout: (result.stdout ?? '').trim(),
    stderr: (result.stderr ?? '').trim(),
  };
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on('error', reject);
    request.setTimeout(5000, () => {
      request.destroy(new Error(`Timed out fetching ${url}`));
    });
  });
}

class CdpSession {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP WebSocket open timeout')), 10_000);
      this.ws.addEventListener('open', () => {
        clearTimeout(timer);
        resolve(undefined);
      });
      this.ws.addEventListener('error', (event) => {
        clearTimeout(timer);
        reject(event.error ?? new Error('CDP WebSocket error'));
      });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id) {
        return;
      }
      const pending = this.pending.get(message.id);
      if (!pending) {
        return;
      }
      this.pending.delete(message.id);
      if (message.error) {
        pending.reject(new Error(message.error.message ?? 'CDP command failed'));
      } else {
        pending.resolve(message.result);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    await this.send('Runtime.enable');
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
    });
    return result?.result?.value;
  }

  async close() {
    if (!this.ws) {
      return;
    }
    this.ws.close();
    this.ws = null;
  }
}

export async function waitForAppPid(adbPath, timeoutMs = 45_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const { stdout } = runAdb(adbPath, ['shell', 'pidof', BUNDLE_ID]);
    const pid = stdout.split(/\s+/).find(Boolean);
    if (pid) {
      return pid;
    }
    await delay(500);
  }
  throw new Error(`Timed out waiting for ${BUNDLE_ID} process`);
}

export function forwardWebViewCdp(adbPath, pid) {
  runAdb(adbPath, ['forward', '--remove', `tcp:${CDP_PORT}`]);
  const socket = `localabstract:webview_devtools_remote_${pid}`;
  const { status, stderr } = runAdb(adbPath, ['forward', `tcp:${CDP_PORT}`, socket]);
  if (status !== 0) {
    throw new Error(`adb forward failed for ${socket}: ${stderr}`);
  }
}

async function getWebViewPage(adbPath) {
  const pid = await waitForAppPid(adbPath);
  forwardWebViewCdp(adbPath, pid);
  await delay(1200);

  const targets = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
  if (!page) {
    throw new Error('No Android WebView page exposed over CDP');
  }
  return page.webSocketDebuggerUrl;
}

function buildContentProbeExpression(contentRoot = '#family-hub-main') {
  const selector = JSON.stringify(contentRoot);
  return `(() => {
    const root = document.querySelector(${selector}) || document.body;
    const text = root.innerText || '';
    const hasSpinner = !!root.querySelector('[class*="animate-spin"]');
    const ready = window.__PG_CAPTURE_READY__ === true;
    return { text, hasSpinner, ready };
  })()`;
}

function isCaptureContentReady(probe, patterns) {
  if (!probe || probe.hasSpinner || probe.ready !== true) {
    return false;
  }
  if (!patterns.length) {
    return true;
  }
  return matchesPatterns(probe.text, patterns);
}

function matchesPatterns(text, patterns) {
  return patterns.some((pattern) => new RegExp(pattern, 'i').test(text));
}

export async function waitForAndroidScreenContent(adbPath, patterns, options = {}) {
  const timeoutMs = options.timeoutMs ?? 90_000;
  const contentRoot = options.contentRoot ?? '#family-hub-main';
  const probeExpression = buildContentProbeExpression(contentRoot);
  const wsUrl = await getWebViewPage(adbPath);
  const session = new CdpSession(wsUrl);
  await session.open();

  try {
    const started = Date.now();
    const patternSource = patterns.map((pattern) => String(pattern));
    while (Date.now() - started < timeoutMs) {
      const probe = await session.evaluate(probeExpression);
      if (isCaptureContentReady(probe, patternSource)) {
        break;
      }
      await delay(500);
    }

    const finalProbe = await session.evaluate(probeExpression);
    if (!isCaptureContentReady(finalProbe, patternSource)) {
      throw new Error(`Timed out waiting for screen text: ${patternSource.join(' | ')}`);
    }

    if (options.scrollLoginCta) {
      await session.evaluate(`
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const target = buttons.find((button) => /let's go!/i.test(button.textContent || ''));
          if (target) {
            target.scrollIntoView({ block: 'center', behavior: 'instant' });
          }
          const page = document.querySelector('.hub-standalone-page');
          if (page) {
            page.scrollTop = 0;
          }
        })()
      `);
      await delay(600);
    } else {
      await session.evaluate(`
        (() => {
          const main = document.getElementById('family-hub-main');
          if (main) {
            main.scrollTop = 0;
          }
          window.scrollTo(0, 0);
        })()
      `);
    }

    await delay(400);
  } finally {
    await session.close();
  }
}

export function removeCdpForward(adbPath) {
  runAdb(adbPath, ['forward', '--remove', `tcp:${CDP_PORT}`]);
}
