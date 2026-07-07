/** Shared crop math for season-1 story cover grid sources. */

/** Portrait poster output — matches ~3:4 source panels without chopping illustration. */
export const OUTPUT_WIDTH = 512;
export const OUTPUT_HEIGHT = 640;
export const MIN_INSET_PX = 4;

/** Episode badge (top) + title + PANDAGARDE logo band (bottom) — not illustration. */
export const CHROME_TOP = 0.13;
export const CHROME_BOTTOM = 0.16;

export const OUTER_EDGE = 0.02;
/** Shave at shared column borders (each adjacent cell takes half). */
export const INNER_COL_GUTTER = 0.042;
export const INNER_ROW_GUTTER = 0.028;

/** Extra trim for titled poster cells that still show title/chrome after default crop. */
export const EPISODE_CHROME_OVERRIDES = {
  2: { top: 0.24, bottom: 0.22 },
  3: { top: 0.24, bottom: 0.22 },
  4: { top: 0.24, bottom: 0.22 },
  5: { top: 0.24, bottom: 0.22 },
};

/** Text-free illustration grids — only shave gutters, keep full art. */
export const CLEAN_CHROME_TOP = 0.01;
export const CLEAN_CHROME_BOTTOM = 0.01;
export const CLEAN_OUTER_EDGE = 0.01;
export const CLEAN_INNER_COL_GUTTER = 0.014;
export const CLEAN_INNER_ROW_GUTTER = 0.012;

export const LETTERBOX = { r: 17, g: 24, b: 39, alpha: 1 };

/**
 * Find 1px white gutters between grid cells.
 * @returns {{ xGutters: number[], yGutters: number[] }}
 */
export function detectGridGutters(rawData, width, height, cols, rows) {
  const xGutters = [];
  const yGutters = [];

  const sampleWhiteness = (x, y0, y1) => {
    let white = 0;
    let n = 0;
    for (let y = y0; y < y1; y += 2) {
      const i = (y * width + x) * 3;
      const r = rawData[i];
      const g = rawData[i + 1];
      const b = rawData[i + 2];
      if (r > 240 && g > 240 && b > 240) white += 1;
      n += 1;
    }
    return white / n;
  };

  const y0 = Math.floor(height * 0.12);
  const y1 = Math.floor(height * 0.88);

  for (let col = 1; col < cols; col += 1) {
    const approx = Math.round((col * width) / cols);
    let bestX = approx;
    let bestScore = 0;
    for (let x = approx - 24; x <= approx + 24; x += 1) {
      const score = sampleWhiteness(x, y0, y1);
      if (score > bestScore) {
        bestScore = score;
        bestX = x;
      }
    }
    if (bestScore > 0.5) xGutters.push(bestX);
  }

  const x0 = Math.floor(width * 0.05);
  const x1 = Math.floor(width * 0.95);
  for (let row = 1; row < rows; row += 1) {
    const approx = Math.round((row * height) / rows);
    let bestY = approx;
    let bestScore = 0;
    for (let y = approx - 24; y <= approx + 24; y += 1) {
      let white = 0;
      let n = 0;
      for (let x = x0; x < x1; x += 2) {
        const i = (y * width + x) * 3;
        const r = rawData[i];
        const g = rawData[i + 1];
        const b = rawData[i + 2];
        if (r > 240 && g > 240 && b > 240) white += 1;
        n += 1;
      }
      const score = white / n;
      if (score > bestScore) {
        bestScore = score;
        bestY = y;
      }
    }
    if (bestScore > 0.5) yGutters.push(bestY);
  }

  return { xGutters, yGutters };
}

export function getCellBounds(width, height, col, row, cols, rows, gutters) {
  const xStarts = [0];
  if (gutters.xGutters.length === cols - 1) {
    for (const gutter of gutters.xGutters) {
      xStarts.push(gutter + 1);
    }
  } else {
    for (let c = 1; c < cols; c += 1) {
      xStarts.push(Math.round((c * width) / cols));
    }
  }
  xStarts.push(width);

  const yStarts = [0];
  if (gutters.yGutters.length === rows - 1) {
    for (const gutter of gutters.yGutters) {
      yStarts.push(gutter + 1);
    }
  } else {
    for (let r = 1; r < rows; r += 1) {
      yStarts.push(Math.round((r * height) / rows));
    }
  }
  yStarts.push(height);

  const left = xStarts[col];
  const right = col === cols - 1 ? width - 1 : xStarts[col + 1] - 2;
  const top = yStarts[row];
  const bottom = row === rows - 1 ? height - 1 : yStarts[row + 1] - 2;

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

/**
 * Illustration-only rect: gutters + title/logo chrome removed, full art kept.
 * @param {number} [episodeNumber] 1-based index in grid (for per-episode chrome overrides)
 * @param {'titled' | 'clean'} [cropProfile] titled = poster sheets with badges; clean = text-free art
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function getCellExtractRect(
  width,
  height,
  col,
  row,
  cols,
  rows,
  gutters,
  episodeNumber,
  cropProfile = 'titled',
) {
  const cell = getCellBounds(width, height, col, row, cols, rows, gutters);
  const cellW = cell.width;
  const cellH = cell.height;

  const isClean = cropProfile === 'clean';
  const chrome = isClean ? {} : EPISODE_CHROME_OVERRIDES[episodeNumber] ?? {};
  const chromeTop = chrome.top ?? (isClean ? CLEAN_CHROME_TOP : CHROME_TOP);
  const chromeBottom = chrome.bottom ?? (isClean ? CLEAN_CHROME_BOTTOM : CHROME_BOTTOM);
  const outerEdge = isClean ? CLEAN_OUTER_EDGE : OUTER_EDGE;
  const innerColGutter = isClean ? CLEAN_INNER_COL_GUTTER : INNER_COL_GUTTER;
  const innerRowGutter = isClean ? CLEAN_INNER_ROW_GUTTER : INNER_ROW_GUTTER;

  const padL = Math.max(
    MIN_INSET_PX,
    Math.floor(cellW * (col === 0 ? outerEdge : innerColGutter)),
  );
  const padR = Math.max(
    MIN_INSET_PX,
    Math.floor(cellW * (col === cols - 1 ? outerEdge : innerColGutter)),
  );
  const padT = Math.max(
    MIN_INSET_PX,
    Math.floor(cellH * chromeTop + (row > 0 ? cellH * innerRowGutter : 0)),
  );
  const padB = Math.max(
    MIN_INSET_PX,
    Math.floor(cellH * chromeBottom + (row < rows - 1 ? cellH * innerRowGutter : 0)),
  );

  const extractWidth = cellW - padL - padR;
  const extractHeight = cellH - padT - padB;

  if (extractWidth < 32 || extractHeight < 32) {
    throw new Error(
      `Extract rect too small for col=${col} row=${row}: ${extractWidth}×${extractHeight}`,
    );
  }

  return {
    left: cell.left + padL,
    top: cell.top + padT,
    width: extractWidth,
    height: extractHeight,
  };
}
