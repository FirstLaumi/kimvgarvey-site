/* Tweaks panel — palette / accent / hero-layout / motion.
   Persists via __edit_mode_set_keys to the host, and mirrors to data-* on <html>. */

(function () {
  const DEFAULTS = window.__TWEAK_DEFAULTS || {};
  const state = { ...DEFAULTS };
  const root = document.documentElement;

  function apply() {
    root.setAttribute("data-palette", state.palette || "abyssal");
    root.setAttribute("data-accent",  state.accent  || "shore");
    root.setAttribute("data-hero",    state.hero    || "editorial");
    root.setAttribute("data-motion",  state.motion  || "on");
    // sync active states
    document.querySelectorAll("[data-tw]").forEach(btn => {
      const [key, val] = btn.dataset.tw.split(":");
      btn.classList.toggle("on", String(state[key]) === val);
    });
  }

  function setKey(key, val) {
    state[key] = val;
    apply();
    window.parent?.postMessage({
      type: "__edit_mode_set_keys",
      edits: { [key]: val }
    }, "*");
  }
  window.__tweakSet = setKey;

  // Build panel
  function buildPanel() {
    const panel = document.createElement("div");
    panel.className = "tweaks-panel";
    panel.id = "tweaks-panel";
    panel.innerHTML = `
      <div class="tw-row">
        <h5>Palette</h5>
        <div class="tw-opts">
          <button class="tw-swatch" data-tw="palette:abyssal" style="background:linear-gradient(135deg,#0b1418,#7fb7b0)" title="Abyssal"></button>
          <button class="tw-swatch" data-tw="palette:bone" style="background:linear-gradient(135deg,#1a1612,#d9a066)" title="Bone & Ember"></button>
          <button class="tw-swatch" data-tw="palette:pale" style="background:linear-gradient(135deg,#f2ede2,#2f6e6a)" title="Pale Shore"></button>
        </div>
      </div>
      <div class="tw-row">
        <h5>Accent</h5>
        <div class="tw-opts">
          <button class="tw-opt" data-tw="accent:shore">Shore</button>
          <button class="tw-opt" data-tw="accent:shimmer">Shimmer</button>
          <button class="tw-opt" data-tw="accent:ember">Ember</button>
        </div>
      </div>
      <div class="tw-row">
        <h5>Hero Layout</h5>
        <div class="tw-opts">
          <button class="tw-opt" data-tw="hero:editorial">Editorial</button>
          <button class="tw-opt" data-tw="hero:masthead">Masthead</button>
          <button class="tw-opt" data-tw="hero:veil">Veil</button>
        </div>
      </div>
      <div class="tw-row">
        <h5>Motion</h5>
        <div class="tw-opts">
          <button class="tw-opt" data-tw="motion:on">On</button>
          <button class="tw-opt" data-tw="motion:off">Off</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    panel.addEventListener("click", e => {
      const b = e.target.closest("[data-tw]");
      if (!b) return;
      const [k, v] = b.dataset.tw.split(":");
      setKey(k, v);
    });
  }

  buildPanel();
  apply();

  // Edit-mode protocol
  window.addEventListener("message", (e) => {
    const d = e.data || {};
    if (d.type === "__activate_edit_mode")   document.getElementById("tweaks-panel")?.classList.add("on");
    if (d.type === "__deactivate_edit_mode") document.getElementById("tweaks-panel")?.classList.remove("on");
  });
  window.parent?.postMessage({ type: "__edit_mode_available" }, "*");
})();
