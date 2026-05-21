export const cvBridgeJS = `
(function () {
  function hexToRgba(hex, alpha) {
    var normalized = String(hex || "").replace("#", "").trim();
    if (normalized.length === 3) {
      normalized = normalized.split("").map(function (c) { return c + c; }).join("");
    }
    var value = parseInt(normalized, 16);
    if (Number.isNaN(value)) {
      return "rgba(174, 182, 186, " + alpha + ")";
    }
    var r = (value >> 16) & 255;
    var g = (value >> 8) & 255;
    var b = value & 255;
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  }

  function setAccentColor(hex) {
    var root = document.documentElement;
    root.style.setProperty("--accent", hex);
    root.style.setProperty("--accent-weak", hexToRgba(hex, 0.25));
  }

  function setStructuredAccentColors(primary, secondary) {
    var root = document.documentElement;
    root.style.setProperty("--structured-primary-accent", primary);
    root.style.setProperty("--structured-secondary-accent", secondary);
    setAccentColor(primary);
  }

  function setThemeOverride(theme) {
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
      return;
    }

    document.documentElement.removeAttribute("data-theme");
  }

  window.CVBridge = window.CVBridge || {};
  window.CVBridge.onNativeEvent = function (event) {
    var ev = typeof event === "string" ? JSON.parse(event) : event;
    if (!ev || !ev.type) {
      return;
    }

    if (ev.type === "setAccentColor") {
      setAccentColor(ev.hex || ev.color || ev.value);
    }

    if (ev.type === "setStructuredAccentColors") {
      setStructuredAccentColors(ev.primary || ev.primaryHex, ev.secondary || ev.secondaryHex);
    }

    if (ev.type === "setThemeOverride") {
      setThemeOverride(ev.theme || ev.value);
    }
  };
  window.CVBridge.setAccentColor = setAccentColor;
  window.CVBridge.setStructuredAccentColors = setStructuredAccentColors;
  window.CVBridge.setThemeOverride = setThemeOverride;
})();
`;
