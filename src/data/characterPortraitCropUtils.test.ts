import { describe, expect, it } from 'vitest';
import {
  CASTING_COLS,
  CASTING_ROW0_ART_BOTTOM_FRAC,
  CASTING_ROW0_ART_TOP_FRAC,
  CASTING_ROW1_ART_BOTTOM_FRAC,
  CASTING_ROW1_ART_TOP_FRAC,
  CASTING_ROWS,
  CASTING_ROLE_CROP,
  getCastingArtRect,
  getCastingPortraitRect,
  getCastingPortraitRectForRole,
  getSagePortraitRect,
} from '../../scripts/lib/characterPortraitCropUtils.mjs';

const SOURCE_W = 1024;
const SOURCE_H = 682;

describe('characterPortraitCropUtils', () => {
  it('uses per-column row-0 tops so the sheet title is excluded from middle cards', () => {
    const po = getCastingArtRect(SOURCE_W, SOURCE_H, 0, 0);
    const ruby = getCastingArtRect(SOURCE_W, SOURCE_H, 1, 0);
    const mika = getCastingArtRect(SOURCE_W, SOURCE_H, 3, 0);

    expect(po.top).toBeLessThanOrEqual(60);
    expect(ruby.top).toBeGreaterThanOrEqual(115);
    expect(mika.top).toBeGreaterThanOrEqual(115);
    expect(mika.top + mika.height).toBeLessThanOrEqual(
      Math.round(SOURCE_H * CASTING_ROW0_ART_BOTTOM_FRAC) + 2,
    );
  });

  it('keeps row 1 art between measured illustration bands', () => {
    const vex = getCastingArtRect(SOURCE_W, SOURCE_H, 0, 1);
    expect(vex.top).toBeGreaterThanOrEqual(Math.round(SOURCE_H * CASTING_ROW1_ART_TOP_FRAC) - 2);
    expect(vex.top + vex.height).toBeLessThanOrEqual(
      Math.round(SOURCE_H * CASTING_ROW1_ART_BOTTOM_FRAC) + 2,
    );
  });

  it('covers all 2×6 grid slots with illustration-sized rects', () => {
    for (let row = 0; row < CASTING_ROWS; row += 1) {
      for (let col = 0; col < CASTING_COLS; col += 1) {
        const rect = getCastingArtRect(SOURCE_W, SOURCE_H, col, row);
        expect(rect.width).toBeGreaterThan(80);
        expect(rect.height).toBeGreaterThan(60);
        expect(rect.left + rect.width).toBeLessThanOrEqual(SOURCE_W);
        expect(rect.top + rect.height).toBeLessThanOrEqual(SOURCE_H);
      }
    }
  });

  it('uses Mika as the calibration reference for default face focus', () => {
    const mika = getCastingPortraitRectForRole(SOURCE_W, SOURCE_H, 'mika');
    const baseline = getCastingPortraitRect(SOURCE_W, SOURCE_H, 3, 0, 0.32, 0.5, {
      insetLeft: 0.03,
      insetRight: 0.03,
      insetTop: 0,
      focusTop: 0.32,
      focusLeft: 0.5,
    });
    expect(mika).toEqual(baseline);
  });

  it('uses stronger left inset for roles with card border chrome', () => {
    expect(CASTING_ROLE_CROP.ruby.insetLeft).toBeGreaterThan(CASTING_ROLE_CROP.mika.insetLeft);
    expect(CASTING_ROLE_CROP.billy.insetLeft).toBeGreaterThan(CASTING_ROLE_CROP.kai.insetLeft);
  });

  it('crops Sage head from trimmed standalone art', () => {
    const rect = getSagePortraitRect(758, 1001);
    expect(rect.top).toBe(0);
    expect(rect.height).toBeLessThan(500);
    expect(rect.left).toBeGreaterThan(50);
  });
});
