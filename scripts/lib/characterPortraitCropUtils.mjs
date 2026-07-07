/** Casting sheet crop math (2×6 character grid). */

import {
  PANEL_LETTERBOX,
  MIN_INSET_PX,
} from './storyCoverCropUtils.mjs';

export { PANEL_LETTERBOX };

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

/**
 * Measured from casting.png (1024×682).
 * Row 0 tops vary by column — the sheet title overlaps middle cards.
 */
export const CASTING_COL_LEFT_FRAC = [0.03125, 0.1885, 0.341, 0.498, 0.656, 0.814];
export const CASTING_COL_RIGHT_FRAC = [0.186, 0.338, 0.495, 0.654, 0.811, 0.968];

/** Per-column illustration top (row 0) — fractions of source height. */
export const CASTING_ROW0_ART_TOP_FRAC = [
  52 / 682,
  121 / 682,
  119 / 682,
  118 / 682,
  99 / 682,
  56 / 682,
];

/** Name plate starts ~y310 on row 0, ~y565 on row 1. */
export const CASTING_ROW0_ART_BOTTOM_FRAC = 308 / 682;
export const CASTING_ROW1_ART_TOP_FRAC = 378 / 682;
export const CASTING_ROW1_ART_BOTTOM_FRAC = 562 / 682;

/** Default symmetric inset — tuned roles override below. */
export const CASTING_ART_INSET_X = 0.03;

/** Square output — calibrated on Mika (R0C3). */
export const CASTING_FACE_FOCUS_TOP = 0.32;
export const CASTING_CALIBRATION_ROLE = 'mika';

/**
 * Per-role crop tuning.
 * insetLeft trims the card's rounded white border (common on the left edge).
 * focusTop / focusLeft position the face square within the illustration band.
 */
export const CASTING_ROLE_CROP = {
  po: { insetLeft: 0.16, insetRight: 0.04, insetTop: 0.1, focusTop: 0.6, focusLeft: 0.5 },
  ruby: { insetLeft: 0.08, insetRight: 0.04, insetTop: 0.03, focusTop: 0.36, focusLeft: 0.5 },
  miki: { insetLeft: 0.09, insetRight: 0.03, insetTop: 0.02, focusTop: 0.26, focusLeft: 0.58 },
  mika: { insetLeft: 0.03, insetRight: 0.03, insetTop: 0, focusTop: 0.32, focusLeft: 0.5 },
  tao: { insetLeft: 0.07, insetRight: 0.03, insetTop: 0.02, focusTop: 0.28, focusLeft: 0.5 },
  billy: { insetLeft: 0.1, insetRight: 0.04, insetTop: 0.05, focusTop: 0.32, focusLeft: 0.52 },
  vex: { insetLeft: 0.06, insetRight: 0.03, insetTop: 0.02, focusTop: 0.3, focusLeft: 0.46 },
  kai: { insetLeft: 0.03, insetRight: 0.03, insetTop: 0, focusTop: 0.36, focusLeft: 0.5 },
  lumi: { insetLeft: 0.03, insetRight: 0.03, insetTop: 0, focusTop: 0.28, focusLeft: 0.5 },
  fiona: { insetLeft: 0.08, insetRight: 0.04, insetTop: 0.02, focusTop: 0.34, focusLeft: 0.5 },
};

/** @deprecated Use CASTING_ROLE_CROP */
export const CASTING_ROLE_FOCUS_TOP = Object.fromEntries(
  Object.entries(CASTING_ROLE_CROP).map(([role, profile]) => [role, profile.focusTop]),
);

/** Standalone Sage — head and shoulders only (scroll excluded). */
export const SAGE_HEAD_FRAC = 0.34;
export const SAGE_HEAD_TOP_FRAC = 0.04;
export const SAGE_HEAD_INSET_X = 0.18;
export const SAGE_FACE_FOCUS_TOP = 0.05;
export const SAGE_FACE_FOCUS_LEFT = 0.5;

const DEFAULT_CROP = {
  insetLeft: CASTING_ART_INSET_X,
  insetRight: CASTING_ART_INSET_X,
  insetTop: 0,
  focusTop: CASTING_FACE_FOCUS_TOP,
  focusLeft: 0.5,
};

function getRoleCrop(role) {
  return { ...DEFAULT_CROP, ...(CASTING_ROLE_CROP[role] ?? {}) };
}

function getRowArtBounds(height, col, row) {
  if (row === 0) {
    return {
      top: Math.round(height * CASTING_ROW0_ART_TOP_FRAC[col]),
      bottom: Math.round(height * CASTING_ROW0_ART_BOTTOM_FRAC),
    };
  }
  return {
    top: Math.round(height * CASTING_ROW1_ART_TOP_FRAC),
    bottom: Math.round(height * CASTING_ROW1_ART_BOTTOM_FRAC),
  };
}

export function getCastingArtRect(width, height, col, row, cropProfile = DEFAULT_CROP) {
  if (col < 0 || col >= CASTING_COLS || row < 0 || row >= CASTING_ROWS) {
    throw new Error(`Invalid casting cell col=${col} row=${row}`);
  }

  const cellLeft = Math.round(width * CASTING_COL_LEFT_FRAC[col]);
  const cellRight = Math.round(width * CASTING_COL_RIGHT_FRAC[col]);
  const cellW = cellRight - cellLeft;

  const { top: artTop, bottom: artBottom } = getRowArtBounds(height, col, row);
  const artH = artBottom - artTop;

  const padL = Math.max(MIN_INSET_PX, Math.floor(cellW * cropProfile.insetLeft));
  const padR = Math.max(MIN_INSET_PX, Math.floor(cellW * cropProfile.insetRight));
  const padT = Math.max(0, Math.floor(artH * cropProfile.insetTop));

  const extractWidth = cellW - padL - padR;
  const extractHeight = artH - padT;

  if (extractWidth < 32 || extractHeight < 32) {
    throw new Error(`Casting art rect too small col=${col} row=${row}`);
  }

  return {
    left: cellLeft + padL,
    top: artTop + padT,
    width: extractWidth,
    height: extractHeight,
  };
}

export function getCastingFaceSquareRect(
  artRect,
  focusTop = CASTING_FACE_FOCUS_TOP,
  focusLeft = 0.5,
) {
  const side = Math.min(artRect.width, artRect.height);
  const maxYOffset = artRect.height - side;
  const maxXOffset = artRect.width - side;
  const yOffset = Math.round(maxYOffset * focusTop);
  const xOffset = Math.round(maxXOffset * focusLeft);

  return {
    left: artRect.left + xOffset,
    top: artRect.top + yOffset,
    width: side,
    height: side,
  };
}

export function getCastingPortraitRect(
  width,
  height,
  col,
  row,
  focusTop = CASTING_FACE_FOCUS_TOP,
  focusLeft = 0.5,
  cropProfile = DEFAULT_CROP,
) {
  const artRect = getCastingArtRect(width, height, col, row, cropProfile);
  return getCastingFaceSquareRect(artRect, focusTop, focusLeft);
}

export function getCastingPortraitRectForRole(width, height, role) {
  const cell = CASTING_ROLE_CELLS[role];
  if (!cell) {
    throw new Error(`Unknown casting role: ${role}`);
  }
  const crop = getRoleCrop(role);
  return getCastingPortraitRect(
    width,
    height,
    cell.col,
    cell.row,
    crop.focusTop,
    crop.focusLeft,
    crop,
  );
}

/** @deprecated Use getCastingPortraitRect — kept for script import compatibility. */
export function getCastingExtractRect(width, height, col, row, _gutters) {
  return getCastingPortraitRect(width, height, col, row);
}

export function getSagePortraitRect(width, height) {
  const headHeight = Math.round(height * SAGE_HEAD_FRAC);
  const padX = Math.round(width * SAGE_HEAD_INSET_X);
  const top = Math.round(height * SAGE_HEAD_TOP_FRAC);
  const headRect = {
    left: padX,
    top,
    width: width - padX * 2,
    height: Math.max(32, headHeight),
  };
  return getCastingFaceSquareRect(headRect, SAGE_FACE_FOCUS_TOP, SAGE_FACE_FOCUS_LEFT);
}
