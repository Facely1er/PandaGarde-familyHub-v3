/** Shared crop math for season-1 story cover grid sources. */

/** Portrait poster output — matches ~3:4 source panels without chopping illustration. */
export const OUTPUT_WIDTH = 512;
export const OUTPUT_HEIGHT = 640;
export const MIN_INSET_PX = 4;

/** Episode badge (top) + PANDAGARDE logo band (bottom) only — not illustration. */
export const CHROME_TOP = 0.105;
export const CHROME_BOTTOM = 0.105;

export const OUTER_EDGE = 0.01;
export const INNER_PAD = 0.008;

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
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function getCellExtractRect(width, height, col, row, cols, rows, gutters) {
  const cell = getCellBounds(width, height, col, row, cols, rows, gutters);
  const cellW = cell.width;
  const cellH = cell.height;

  const padL = Math.max(MIN_INSET_PX, Math.floor(cellW * (col === 0 ? OUTER_EDGE : INNER_PAD)));
  const padR = Math.max(
    MIN_INSET_PX,
    Math.floor(cellW * (col === cols - 1 ? OUTER_EDGE : INNER_PAD)),
  );
  const padT = Math.max(MIN_INSET_PX, Math.floor(cellH * CHROME_TOP));
  const padB = Math.max(MIN_INSET_PX, Math.floor(cellH * CHROME_BOTTOM));

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
