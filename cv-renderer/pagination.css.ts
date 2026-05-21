import { CVPageGeometry } from "@/cv-renderer/geometry";

export const sharedPaginationCSS = `
  html {
    width: ${CVPageGeometry.pageWidthCSSPx}px;
    min-height: ${CVPageGeometry.pageHeightCSSPx}px;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background: #ececec;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  #pages {
    width: ${CVPageGeometry.pageWidthCSSPx}px;
    margin: 0 auto;
    padding: 0;
  }

  .page {
    position: relative;
    width: ${CVPageGeometry.pageWidthCSSPx}px;
    height: ${CVPageGeometry.pageHeightCSSPx}px;
    max-height: ${CVPageGeometry.pageHeightCSSPx}px;
    overflow: hidden;
    margin: 0 0 22px 0;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.14);
  }

  .page-content {
    position: relative;
    min-height: 100%;
  }

  .cv-block,
  .novo-entry {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .cv-block:empty {
    display: none;
  }

  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    html,
    body {
      width: ${CVPageGeometry.pageWidthCSSPx}px;
      min-height: ${CVPageGeometry.pageHeightCSSPx}px;
      background: #ffffff !important;
    }

    #pages {
      margin: 0;
      padding: 0;
    }

    .page {
      width: ${CVPageGeometry.pageWidthCSSPx}px;
      height: ${CVPageGeometry.pageHeightCSSPx}px;
      max-height: ${CVPageGeometry.pageHeightCSSPx}px;
      margin: 0;
      box-shadow: none;
      border: 0;
      overflow: hidden;
    }

    .page:not(:last-child) {
      page-break-after: always;
      break-after: page;
    }
  }
`;
