(() => {
  if (window.__ac) {
    alert("Autoclicker ya activo");
    return;
  }

  const S = window.__ac = { run: false, x: 0, y: 0 };

  function init() {
    const canvas = document.querySelector('#unity-canvas');
    const container = document.querySelector('#unity-container');

    if (!canvas || !container) {
      setTimeout(init, 500);
      return;
    }

    // Posición inicial (centro)
    const r = canvas.getBoundingClientRect();
    S.x = r.left + r.width / 2;
    S.y = r.top + r.height / 2;

    // ===== AUTCLICK =====
    setInterval(() => {
      if (!S.run) return;
      const el = document.elementFromPoint(S.x, S.y);
      if (!el) return;
      const ev = { bubbles: true, cancelable: true, clientX: S.x, clientY: S.y };
      el.dispatchEvent(new MouseEvent('mousedown', ev));
      el.dispatchEvent(new MouseEvent('mouseup', ev));
      el.dispatchEvent(new MouseEvent('click', ev));
    }, 40);

    // ===== UI (AISLADA DE UNITY) =====
    const ui = document.createElement('div');

    ui.style.cssText = `
      all: initial;
      position: fixed;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%) scale(1) !important;
      z-index: 2147483647 !important;
      display: flex;
      gap: 8px;
      background: #000;
      padding: 10px;
      border-radius: 10px;
      font-family: -apple-system, system-ui, sans-serif;
      font-size: 16px;
      min-width: 140px;
      justify-content: center;
      box-shadow: 0 0 0 2px #000;
    `;

    function button(text, fn) {
      const b = document.createElement('button');
      b.textContent = text;
      b.style.cssText = `
        all: initial;
        background: #222;
        color: #fff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
      `;
      b.onclick = e => { e.stopPropagation(); fn(e); };
      return b;
    }

    const setBtn = button("SET", () => {
      const r2 = canvas.getBoundingClientRect();
      S.x = r2.left + r2.width / 2;
      S.y = r2.top + r2.height / 2;
      alert("Posición fijada");
    });

    const playBtn = button("PLAY", () => {
      S.run = !S.run;
      playBtn.textContent = S.run ? "PAUSE" : "PLAY";
      alert(S.run ? "Autoclicker ON" : "Autoclicker OFF");
    });

    ui.append(setBtn, playBtn);

    // 🔴 CLAVE: NO body — documentElement
    document.documentElement.appendChild(ui);

    // ===== LIMPIEZA HTML (EXCEPTO UNITY) =====
    setInterval(() => {
      document.body.querySelectorAll('*').forEach(el => {
        if (
          el !== canvas &&
          el !== container &&
          !container.contains(el)
        ) {
          el.remove();
        }
      });
    }, 800);

    alert("Autoclicker listo (UI visible)");
  }

  init();
})();
