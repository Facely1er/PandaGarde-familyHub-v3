#!/usr/bin/env node
/**
 * Silence WKProcessPool deprecation warnings from upstream CapacitorCordova (iOS 15+).
 * Safe to remove when @capacitor/ios drops WKProcessPool usage.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(
  root,
  'node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public'
);
const headerPath = path.join(base, 'CDVWebViewProcessPoolFactory.h');
const implPath = path.join(base, 'CDVWebViewProcessPoolFactory.m');

const HEADER_GUARD = '#pragma clang diagnostic push\n#pragma clang diagnostic ignored "-Wdeprecated-declarations"\n';
const HEADER_END = '\n#pragma clang diagnostic pop\n';

function patchHeader() {
  if (!fs.existsSync(headerPath)) {
    console.log('[patch-wkprocesspool] Header not found — skipping.');
    return;
  }
  let text = fs.readFileSync(headerPath, 'utf8');
  if (text.includes('pragma clang diagnostic ignored "-Wdeprecated-declarations"')) {
    return;
  }
  text = text.replace('#import <WebKit/WebKit.h>\n\n', `#import <WebKit/WebKit.h>\n\n${HEADER_GUARD}`);
  if (!text.endsWith('\n')) {
    text += '\n';
  }
  text += HEADER_END;
  fs.writeFileSync(headerPath, text);
}

function patchImpl() {
  if (!fs.existsSync(implPath)) {
    return;
  }
  let text = fs.readFileSync(implPath, 'utf8');
  if (text.includes('pragma clang diagnostic ignored "-Wdeprecated-declarations"')) {
    return;
  }
  text = text.replace(
    '        _sharedPool = [[WKProcessPool alloc] init];',
    `#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        _sharedPool = [[WKProcessPool alloc] init];
#pragma clang diagnostic pop`
  );
  fs.writeFileSync(implPath, text);
}

patchHeader();
patchImpl();
console.log('[patch-wkprocesspool] CapacitorCordova WKProcessPool pragmas applied.');
