(function() {
  if (window.__ac) {
    alert("Autoclicker ya activo");
    return;
  }

  const S = window.__ac = { run: false, t: null, x: 0, y: 0 };

  try {
    // ==== ESPERAR EL CANVAS ====
    function waitCanvas(retries = 50) {
      const canvas = document.querySelector('#unity-canvas');
      const container = document.querySelector('#unity-container');

      if (canvas && container) {
        // Posición inicial
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

        S.t = setInterval(click, 40);

        // ==== UI MINIMA ====
        const ui = document.createElement('div');
        ui.style.cssText = `
          position:fixed;
          bottom:12px;
          left:50%;
          transform:translateX(-50%);
          z-index:2147483647;
          pointer-events:none;
          contain:layout paint size;
        `;

        const bar = document.createElement('div');
        bar.style.cssText = `
          background:#000;
          padding:6px;
          border-radius:6px;
          display:flex;
          gap:4px;
          pointer-events:auto;
        `;

        const btn = (txt, fn) => {
          const b = document.createElement('button');
          b.textContent = txt;
          b.style.cssText = "background:#111;color:#fff;border:0;padding:4px 8px;font-size:12px;";
          b.onclick = e => { e.stopPropagation(); fn(e); };
          return b;
        };

        bar.append(
          btn('SET', () => {
            const rect = canvas.getBoundingClientRect();
            S.x = rect.left + rect.width / 2;
            S.y = rect.top + rect.height / 2;
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

        // ==== LIMPIEZA DE ELEMENTOS NO CANVAS ====
        setInterval(() => {
          document.body.querySelectorAll('*').forEach(e => {
            if (e !== canvas && e !== container && e !== ui) e.remove();
          });
        }, 500);

        alert("Autoclicker cargado correctamente");

      } else {
        if (retries <= 0) {
          alert("No se encontró #unity-canvas ni #unity-container");
          return;
        }
        setTimeout(() => waitCanvas(retries - 1), 200);
      }
    }

    waitCanvas();

  } catch (err) {
    alert("Error en autoclicker: " + err.message);
  }
})();
