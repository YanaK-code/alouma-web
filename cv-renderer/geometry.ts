export const CVPageGeometry = {
  pageWidthPt: 595,
  pageHeightPt: 842,
  cssPixelsPerPoint: 96 / 72,
  get pageWidthCSSPx() {
    return Math.ceil(this.pageWidthPt * this.cssPixelsPerPoint);
  },
  get pageHeightCSSPx() {
    return Math.ceil(this.pageHeightPt * this.cssPixelsPerPoint);
  },
  get webViewportWidthPt() {
    return this.pageWidthCSSPx;
  },
  get webViewportHeightPt() {
    return this.pageHeightCSSPx;
  },
  get paperRect() {
    return {
      x: 0,
      y: 0,
      width: this.pageWidthPt,
      height: this.pageHeightPt,
    };
  },
} as const;
