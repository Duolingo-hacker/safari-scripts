// Autoclicker para celltosingularity.com
// Guardado en GitHub, inyectable via bookmarklet

(() => {
  // Evitar reinstalar si ya existe
  if (window.__autoClicker) {
    completion("si");
    return;
  }

  // Estado global
  window.__autoClicker = {
    running: false,
    interval: null,
    coords: JSON.parse(localStorage.getItem("__autoClickerCoords")) || { x: window.innerWidth/2, y: window.innerHeight/2 },
    square: JSON.parse(localStorage.getItem("__autoClickerSquare")) || 50,
    fingers: JSON.parse(localStorage.getItem("__autoClickerFingers")) || 20,
    installed: false
  };

  const state = window.__autoClicker;

  // Funciones
  function randomOffset() {
    return Math.random() * state.square - state.square / 2;
  }

  function clickAt(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: "touch", isPrimary: true };
    el.dispatchEvent(new PointerEvent("pointerdown", opts));
    el.dispatchEvent(new PointerEvent("pointerup", opts));
    el.dispatchEvent(new MouseEvent("mousedown", opts));
    el.dispatchEvent(new MouseEvent("mouseup", opts));
    el.dispatchEvent(new MouseEvent("click", opts));
  }

  function multiClick() {
    if (!state.running) return;
    for (let i = 0; i < state.fingers; i++) {
      const x = state.coords.x + randomOffset();
      const y = state.coords.y + randomOffset();
      clickAt(x, y);
    }
  }

  // Panel UI
  if (!state.installed) {
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.left = "50%";
    panel.style.transform = "translateX(-50%)";
    panel.style.zIndex = "999999";
    panel.style.background = "rgba(0,0,0,0.75)";
    panel.style.padding = "12px 20px";
    panel.style.borderRadius = "16px";
    panel.style.display = "flex";
    panel.style.gap = "8px";
    panel.style.pointerEvents = "auto";

    // Botón Set ubicación
    const setBtn = document.createElement("button");
    setBtn.textContent = "📍 Set";
    setBtn.style.padding = "8px 12px";
    setBtn.onclick = (e) => {
      e.stopPropagation(); e.preventDefault();
      state.coords = { x: window.innerWidth/2, y: window.innerHeight/2 };
      localStorage.setItem("__autoClickerCoords", JSON.stringify(state.coords));
      alert(`Ubicación guardada: x=${state.coords.x}, y=${state.coords.y}`);
    };

    // Botón Play/Pause
    const playBtn = document.createElement("button");
    playBtn.textContent = "▶ Play";
    playBtn.style.padding = "8px 12px";
    playBtn.onclick = (e) => {
      e.stopPropagation(); e.preventDefault();
      state.running = !state.running;
      if (state.running) {
        playBtn.textContent = "⏸ Pause";
        state.interval = setInterval(multiClick, 1); // iOS limita ~40ms reales
      } else {
        playBtn.textContent = "▶ Play";
        clearInterval(state.interval);
      }
    };

    panel.appendChild(setBtn);
    panel.appendChild(playBtn);
    document.body.appendChild(panel);

    state.installed = true;
  }

  // Completion obligatorio para Atajos
  completion("si");
})();
