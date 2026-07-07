/** Casting sheet crop math (2×6 character grid). */

import {
  CLEAN_INNER_COL_GUTTER,
  CLEAN_INNER_ROW_GUTTER,
  CLEAN_OUTER_EDGE,
  MIN_INSET_PX,
  PANEL_LETTERBOX,
  detectGridGutters,
  getCellBounds,
} from './storyCoverCropUtils.mjs';

export { detectGridGutters, PANEL_LETTERBOX };

export const PORTRAIT_SIZE = 256;
export const CASTING_COLS = 6;
export const CASTING_ROWS = 2;

/** Sheet label ≠ canon for some cells — map grid position → canonical role id. */
export const CASTING_ROLE_CELLS = {
  po: { col: 0, row: 0 },
  ruby: { col: 1, row: 0 },
  miki: { col: 2, row: 0 },
  mika: { col: 3, row: 0 },
  tao: { col: 4, row: 0 },
  billy: { col: 5, row: 0 },
  vex: { col: 0, row: 1 },
  kai: { col: 2, row: 1 },
  lumi: { col: 3, row: 1 },
  fiona: { col: 4, row: 1 },
};

/** Trim name plate + footer leaf on each casting card. */
export const CASTING_CHROME_TOP = 0.05;
export const CASTING_CHROME_BOTTOM = 0.34;

export function getCastingExtractRect(width, height, col, row, gutters) {
  const cell = getCellBounds(width, height, col, row, CASTING_COLS, CASTING_ROWS, gutters);
  const cellW = cell.width;
  const cellH = cell.height;

  const padL = Math.max(
    MIN_INSET_PX,
    Math.floor(cellW * (col === 0 ? CLEAN_OUTER_EDGE : CLEAN_INNER_COL_GUTTER)),
  );
  const padR = Math.max(
    MIN_INSET_PX,
    Math.floor(cellW * (col === CASTING_COLS - 1 ? CLEAN_OUTER_EDGE : CLEAN_INNER_COL_GUTTER)),
  );
  const padT = Math.max(
    MIN_INSET_PX,
    Math.floor(cellH * CASTING_CHROME_TOP + (row > 0 ? cellH * CLEAN_INNER_ROW_GUTTER : 0)),
  );
  const padB = Math.max(
    MIN_INSET_PX,
    Math.floor(
      cellH * CASTING_CHROME_BOTTOM + (row < CASTING_ROWS - 1 ? cellH * CLEAN_INNER_ROW_GUTTER : 0),
    ),
  );

  const extractWidth = cellW - padL - padR;
  const extractHeight = cellH - padT - padB;

  if (extractWidth < 32 || extractHeight < 32) {
    throw new Error(`Casting extract too small col=${col} row=${row}`);
  }

  return {
    left: cell.left + padL,
    top: cell.top + padT,
    width: extractWidth,
    height: extractHeight,
  };
}
