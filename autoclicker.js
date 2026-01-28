(() => {
  if (window.__ac) return;

  const S = window.__ac = {
    run: false,
    t: null,
    x: innerWidth >> 1,
    y: innerHeight >> 1
  };

  // ==== CLICK CORE ====
  function click() {
    if (!S.run) return;

    const el = document.elementFromPoint(S.x, S.y);
    if (!el) return;

    const e = { bubbles:true, cancelable:true, clientX:S.x, clientY:S.y };
    el.dispatchEvent(new MouseEvent('mousedown', e));
    el.dispatchEvent(new MouseEvent('mouseup', e));
    el.dispatchEvent(new MouseEvent('click', e));
  }

  S.t = setInterval(click, 40);

  // ==== UI ROOT ====
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
    b.style.cssText = `
      background:#111;
      color:#fff;
      border:0;
      padding:4px 8px;
      font-size:12px;
    `;
    b.onclick = e => { e.stopPropagation(); fn(e); };
    return b;
  };

  bar.append(
    btn('SET', () => {
      S.x = innerWidth >> 1;
      S.y = innerHeight >> 1;
    }),
    btn('PLAY', e => {
      S.run = !S.run;
      e.target.textContent = S.run ? 'PAUSE' : 'PLAY';
    })
  );

  ui.appendChild(bar);
  document.body.appendChild(ui);
})();
