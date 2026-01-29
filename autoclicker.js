(() => {
  if (window.__ac) { alert("Autoclicker ya activo"); return; }
  const S = window.__ac = { run: false, interval: null, x: 0, y: 0 };

  const tryInit = () => {
    const canvas = document.querySelector('#unity-canvas');
    const container = document.querySelector('#unity-container');
    if (!canvas || !container) {
      setTimeout(tryInit, 500);
      return;
    }

    // ==== Posición inicial ====
    const rect = canvas.getBoundingClientRect();
    S.x = rect.left + rect.width / 2;
    S.y = rect.top + rect.height / 2;

    // ==== CLICK CORE ====
    function click() {
      if (!S.run) return;
      const el = document.elementFromPoint(S.x, S.y);
      if (!el) return;
      const ev = { bubbles: true, cancelable: true, clientX: S.x, clientY: S.y };
      el.dispatchEvent(new MouseEvent('mousedown', ev));
      el.dispatchEvent(new MouseEvent('mouseup', ev));
      el.dispatchEvent(new MouseEvent('click', ev));
    }
    S.interval = setInterval(click, 40);

    // ==== UI mínima ====
    const ui = document.createElement('div');
    ui.style.cssText = "position:fixed;bottom:10px;left:50%;transform:translateX(-50%);z-index:999999;pointer-events:none;";

    const bar = document.createElement('div');
    bar.style.cssText = "background:#000;padding:6px;border-radius:8px;display:flex;gap:6px;pointer-events:auto;";

    const btn = (txt, fn) => {
      const b = document.createElement('button');
      b.textContent = txt;
      b.style.cssText = "background:#222;color:#fff;border:none;padding:6px 10px;font-size:14px;";
      b.onclick = e => { e.stopPropagation(); fn(e); };
      return b;
    };

    bar.append(
      btn('SET', () => {
        const r = canvas.getBoundingClientRect();
        S.x = r.left + r.width / 2;
        S.y = r.top + r.height / 2;
        alert("Posición fijada");
      }),
      btn('PLAY', e => {
        S.run = !S.run;
        e.target.textContent = S.run ? 'PAUSE' : 'PLAY';
        alert(S.run ? "Autoclicker iniciado" : "Autoclicker pausado");
      })
    );

    ui.appendChild(bar);
    document.body.appendChild(ui);

    // ==== LIMPIEZA REPETIDA DEL DOM ====
    setInterval(() => {
      document.body.querySelectorAll('*').forEach(e => {
        if (e !== canvas && e !== container && e !== ui) e.remove();
      });
    }, 500);

    alert("Autoclicker listo y contenido innecesario eliminado");

  };

  tryInit();
})();
