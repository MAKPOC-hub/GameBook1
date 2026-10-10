// engine_overlay_history.js
// v1.0.4 -> v1.0.5
// Проект: GameBook1
// Функция: галерея чекпоинтов «История» — вкладки по главам, SVG-картинки чекпоинтов, открытие оверлея, построение сетки плиток
// Изменение: замок на неоткрытой плитке увеличен ещё на 20% — теперь 79% от размера плитки

'use strict';

/* ===== Инжект-стиль для галереи «История» ===== */
(function _injectHistStyles(){
  if(document.getElementById('zl-hist-styles'))return;
  const st=document.createElement('style');
  st.id='zl-hist-styles';
  st.textContent=
  '.histtabs{display:flex;gap:8px;margin-top:12px;justify-content:center;flex-wrap:wrap}'
  +'.histtab{position:relative;padding:10px 16px;border:2px solid #8a6a44;border-radius:10px;background:linear-gradient(#3c5432,#2c4023);color:#e9dfc5;font-family:inherit;font-size:13px;cursor:pointer;letter-spacing:1px;font-variant:small-caps;min-width:130px;text-align:center;transition:transform .15s,border-color .15s,background .15s;overflow:hidden}'
  +'.histtab:hover{transform:translateY(-2px);border-color:#b8d494}'
  +'.histtab.active{border-color:#b8d494;background:linear-gradient(#5a7a44,#3d5a2c);color:#fff3cf;box-shadow:0 0 10px rgba(150,200,110,.35)}'
  +'.histtab.locked{cursor:default;color:#6a6a5a;border-color:#4a4a3a;background:linear-gradient(#2a2a24,#1c1c18)}'
  +'.histtab.locked:hover{transform:none;border-color:#4a4a3a}'
  +'.histtab .ht-name{position:relative;z-index:2;transition:opacity .3s}'
  +'.histtab.locked .ht-name{opacity:0}'
  +'.histtab .ht-fog{position:absolute;inset:0;z-index:1;border-radius:8px;pointer-events:none;background:radial-gradient(circle at 30% 40%,rgba(180,180,180,.55),transparent 60%),radial-gradient(circle at 70% 60%,rgba(210,210,210,.45),transparent 55%),rgba(40,40,40,.55)}'
  +'.histgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-top:12px}'
  +'.histcell{position:relative;cursor:pointer;transition:transform .15s;text-align:center}'
  +'.histcell:hover{transform:translateY(-4px)}'
  +'.histcell.locked{cursor:default;opacity:.55}'
  +'.histcell.locked:hover{transform:none}'
  +'.histart{position:relative;width:100%;aspect-ratio:1/1;border-radius:12px;border:3px solid #8a6a44;background:linear-gradient(#20301c,#182415);overflow:hidden;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.55)}'
  +'.histcell.locked .histart{border-color:#3a3a34;filter:grayscale(.85) brightness(.55)}'
  +'.histart svg{width:100%;height:100%;display:block}'
  +'.histcell .histlock{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:3;pointer-events:none;width:90%;height:90%;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 6px rgba(0,0,0,.9))}'
  +'.histcell .histlock svg{width:100%;height:100%;display:block}'
  +'.histname{margin-top:6px;font-size:12px;color:#e8dcbe;text-shadow:0 1px 2px #000;line-height:1.25;font-weight:700}'
  +'.histcell.locked .histname{color:#6a6a5a}'
  +'.histtime{margin-top:2px;font-size:10.5px;opacity:.7;color:#e8dcbe}'
  +'.histcell.locked .histtime{color:#6a6a5a}'
  +'.histbadge{position:absolute;top:6px;right:6px;z-index:2;font-size:11px;font-weight:700;background:rgba(20,40,16,.92);border:1px solid #b8d494;border-radius:8px;padding:2px 7px;color:#e9ffcf;text-shadow:0 1px 2px #000}'
  +'.histcell.locked .histbadge{background:rgba(40,40,40,.92);border-color:#5a5a4a;color:#8a8a7a}';
  document.head.appendChild(st);
})();

/* ===== SVG-картинки 10 чекпоинтов =====
   ↙️ Используется в: buildHistoryGrid (в этом же файле) */
const CP_ART={
  cp1:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cp1sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f2"/><stop offset="1" stop-color="#a8cf8a"/></linearGradient></defs><rect width="100" height="100" fill="url(#cp1sky)"/><ellipse cx="50" cy="70" rx="60" ry="20" fill="#628c50"/><polygon points="35,70 45,70 70,100 30,100" fill="#c9a86a" opacity=".8"/><g><polygon points="20,70 12,50 28,50" fill="#35602f"/><rect x="18" y="70" width="4" height="10" fill="#4a3324"/></g><g><polygon points="80,70 72,45 88,45" fill="#3f6a3a"/><rect x="78" y="70" width="4" height="10" fill="#4a3324"/></g><circle cx="50" cy="18" r="10" fill="#ffe9a8" opacity=".85"/></svg>`,
  cp2:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#d9e6b8"/><ellipse cx="50" cy="85" rx="70" ry="18" fill="#a8b06a"/><g><rect x="20" y="30" width="6" height="55" fill="#f2efe2"/><rect x="20" y="40" width="6" height="3" fill="#3a3a34"/><circle cx="23" cy="26" r="12" fill="#e8c76a"/></g><g><rect x="74" y="30" width="6" height="55" fill="#f2efe2"/><rect x="74" y="40" width="6" height="3" fill="#3a3a34"/><circle cx="77" cy="26" r="12" fill="#e8c76a"/></g><ellipse cx="50" cy="72" rx="20" ry="12" fill="#8a8a84" stroke="#4a4a44" stroke-width="2"/><path d="M42 68 L58 78 M42 78 L58 68" stroke="#3a3a34" stroke-width="2" fill="none"/></svg>`,
  cp3:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#e8e0c8"/><ellipse cx="50" cy="90" rx="70" ry="14" fill="#628c50"/><rect x="30" y="50" width="40" height="30" fill="#a8794a" stroke="#5b3a20" stroke-width="2"/><polygon points="24,50 76,50 50,28" fill="#7a4f2e"/><rect x="44" y="62" width="12" height="18" fill="#4a3020"/><circle cx="64" cy="40" r="5" fill="#cfcfc8" opacity=".7"/><circle cx="64" cy="40" r="3" fill="#e8c76a" opacity=".9"/></svg>`,
  cp4:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#5f7263"/><ellipse cx="50" cy="80" rx="80" ry="20" fill="#47543f"/><g fill="#2a2a22" opacity=".7"><ellipse cx="30" cy="72" rx="5" ry="9" transform="rotate(-10 30 72)"/><ellipse cx="48" cy="76" rx="5" ry="9" transform="rotate(5 48 76)"/><ellipse cx="66" cy="74" rx="5" ry="9" transform="rotate(-5 66 74)"/></g><path d="M10 40 Q30 30 50 36 Q70 42 90 34" stroke="#3a3a30" stroke-width="2" fill="none" opacity=".5"/></svg>`,
  cp5:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cp5sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9e6b8"/><stop offset="1" stop-color="#a8cf8a"/></linearGradient></defs><rect width="100" height="100" fill="url(#cp5sky)"/><ellipse cx="50" cy="85" rx="80" ry="18" fill="#628c50"/><ellipse cx="30" cy="72" rx="12" ry="7" fill="#8a7a5a"/><ellipse cx="50" cy="76" rx="14" ry="8" fill="#8a7a5a"/><ellipse cx="70" cy="72" rx="12" ry="7" fill="#8a7a5a"/><g><polygon points="20,60 12,45 28,45" fill="#35602f"/><rect x="18" y="60" width="4" height="10" fill="#4a3324"/></g><g><polygon points="82,60 74,45 90,45" fill="#3f6a3a"/><rect x="80" y="60" width="4" height="10" fill="#4a3324"/></g></svg>`,
  cp6:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cp6w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb8c4"/><stop offset="1" stop-color="#3f7d8c"/></linearGradient></defs><rect width="100" height="100" fill="#3a4a4a"/><rect x="0" y="65" width="100" height="35" fill="url(#cp6w)"/><path d="M20 65 Q30 40 40 55 L40 90 L20 90 Z" fill="#5a6455" stroke="#2e3a2c" stroke-width="2"/><path d="M40 60 Q50 50 65 55 L65 70 L40 70 Z" fill="#2e3a2c"/><g transform="translate(56,58)"><ellipse cx="0" cy="0" rx="8" ry="6" fill="none" stroke="#c8a868" stroke-width="3"/><ellipse cx="0" cy="2" rx="6" ry="5" fill="none" stroke="#c8a868" stroke-width="3"/></g></svg>`,
  cp7:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cp7sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f2"/><stop offset="1" stop-color="#a8cf8a"/></linearGradient></defs><rect width="100" height="100" fill="url(#cp7sky)"/><ellipse cx="50" cy="88" rx="80" ry="14" fill="#628c50"/><g fill="#f2efe2"><path d="M50 42 Q38 50 36 62 L50 68 L64 62 Q62 50 50 42 Z"/><path d="M40 44 Q35 30 30 24 Q36 28 38 38 Z"/><path d="M60 44 Q65 30 70 24 Q64 28 62 38 Z"/><path d="M42 66 L42 80 M46 66 L46 82 M50 66 L50 84 M54 66 L54 82 M58 66 L58 80" stroke="#f2efe2" stroke-width="2"/></g><circle cx="44" cy="52" r="1.6" fill="#2e2010"/><circle cx="56" cy="52" r="1.6" fill="#2e2010"/></svg>`,
  cp8:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#5c8570"/><ellipse cx="50" cy="88" rx="80" ry="16" fill="#3f6350"/><rect x="18" y="45" width="8" height="42" fill="#4a3324"/><g><path d="M60 70 Q56 54 62 48 Q68 44 72 50 Q76 58 72 68 Z" fill="#7a5230"/><circle cx="66" cy="52" r="7" fill="#c89050"/><path d="M62 62 Q60 70 62 78 L68 78 Q70 70 68 62 Z" fill="#a8794a"/></g><path d="M40 60 Q45 58 50 60 M40 64 Q45 62 50 64" stroke="#c8a868" stroke-width="2" fill="none"/></svg>`,
  cp9:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#3a4a3a"/><ellipse cx="50" cy="90" rx="70" ry="12" fill="#2e3a2e"/><rect x="28" y="32" width="44" height="52" fill="none" stroke="#5a3f24" stroke-width="4"/><rect x="26" y="30" width="48" height="6" fill="#4a3324"/><rect x="26" y="80" width="48" height="6" fill="#4a3324"/><ellipse cx="50" cy="55" rx="14" ry="6" fill="#1a2a24" stroke="#5a3f24" stroke-width="2"/><path d="M38 58 L38 76 M62 58 L62 76" stroke="#5a3f24" stroke-width="3"/><circle cx="50" cy="46" r="3" fill="#7fb8c4" opacity=".6"/></svg>`,
  cp10:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="cp10sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9b0"/><stop offset="1" stop-color="#a8cf8a"/></linearGradient></defs><rect width="100" height="100" fill="url(#cp10sky)"/><ellipse cx="50" cy="85" rx="70" ry="16" fill="#628c50"/><polygon points="10,80 30,50 50,80" fill="#35602f"/><polygon points="50,80 70,55 90,80" fill="#3f6a3a"/><polygon points="30,80 45,60 60,80" fill="#4a7c3e" opacity=".85"/><circle cx="50" cy="20" r="12" fill="#fff3cf" opacity=".8"/><circle cx="50" cy="20" r="6" fill="#fffbe8"/></svg>`,
  ch2cp1:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1e22"/><ellipse cx="50" cy="80" rx="80" ry="22" fill="#242a30"/><g fill="#5a4a30" opacity=".85"><path d="M30 78 Q32 70 40 70 Q48 70 50 78 Q46 82 38 82 Q32 82 30 78 Z"/><path d="M50 76 Q52 68 60 68 Q68 68 70 76 Q66 80 58 80 Q52 80 50 76 Z"/></g><circle cx="50" cy="20" r="3" fill="#bfe3f2" opacity=".55"/><path d="M20 26 L24 30 M80 22 L76 26 M50 38 L50 44" stroke="#8a98a8" stroke-width="1" opacity=".4" fill="none"/></svg>`,
  ch2cp2:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1c2422"/><rect x="30" y="30" width="40" height="50" rx="4" fill="#3a4a48" stroke="#7a8a88" stroke-width="2"/><rect x="36" y="38" width="28" height="16" rx="2" fill="#0e1818" stroke="#5a7a78" stroke-width="1.5"/><rect x="40" y="42" width="4" height="8" fill="#8fe08a" opacity=".8"/><rect x="48" y="42" width="4" height="8" fill="#8fe08a" opacity=".5"/><rect x="56" y="42" width="4" height="8" fill="#8fe08a" opacity=".3"/><circle cx="42" cy="64" r="3" fill="#7a8a88"/><circle cx="50" cy="64" r="3" fill="#7a8a88"/><circle cx="58" cy="64" r="3" fill="#7a8a88"/><rect x="44" y="72" width="12" height="3" fill="#5a7a78"/></svg>`,
  ch2cp3:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1e2828"/><rect x="20" y="30" width="60" height="42" rx="3" fill="#8a98a0" stroke="#4a5458" stroke-width="2"/><g fill="#1e2828"><circle cx="30" cy="42" r="2"/><circle cx="42" cy="42" r="2"/><circle cx="30" cy="52" r="2"/><circle cx="54" cy="52" r="2"/><circle cx="42" cy="62" r="2"/><circle cx="66" cy="42" r="2"/><circle cx="66" cy="62" r="2"/></g><rect x="28" y="34" width="44" height="2" fill="#4a5458" opacity=".5"/></svg>`,
  ch2cp4:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1c2422"/><ellipse cx="50" cy="82" rx="60" ry="12" fill="#2a3634"/><g><ellipse cx="50" cy="58" rx="14" ry="10" fill="#5a4a38"/><ellipse cx="50" cy="42" rx="11" ry="12" fill="#8a7a60"/><circle cx="46" cy="40" r="1.5" fill="#2a1a10"/><circle cx="54" cy="40" r="1.5" fill="#2a1a10"/><path d="M46 48 Q50 51 54 48" stroke="#2a1a10" stroke-width="1.5" fill="none"/></g><path d="M38 58 L28 62 M62 58 L72 62" stroke="#5a4a38" stroke-width="3" stroke-linecap="round"/></svg>`,
  ch2cp5:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1c2422"/><ellipse cx="50" cy="85" rx="70" ry="12" fill="#2a3634"/><g><path d="M30 70 Q30 40 50 38 Q70 40 70 70 Z" fill="#5a4a38"/><circle cx="50" cy="56" r="9" fill="#8a7a60"/><circle cx="46" cy="54" r="1.5" fill="#2a1a10"/><circle cx="54" cy="54" r="1.5" fill="#2a1a10"/></g><path d="M40 70 L60 70" stroke="#3a2a1a" stroke-width="2"/></svg>`,
  ch2cp6:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ch2cp6w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0e8"/><stop offset="1" stop-color="#3a6a80"/></linearGradient></defs><rect width="100" height="100" fill="#0e2028"/><rect x="0" y="55" width="100" height="45" fill="url(#ch2cp6w)"/><g stroke="#bfe3f2" stroke-width="1.5" fill="none" opacity=".7"><path d="M10 68 Q30 62 50 68 Q70 74 90 68"/><path d="M10 82 Q30 76 50 82 Q70 88 90 82"/></g><g fill="#dff0fa" opacity=".9"><path d="M20 30 L21 33 L24 34 L21 35 L20 38 L19 35 L16 34 L19 33 Z"/><path d="M78 24 L79 27 L82 28 L79 29 L78 32 L77 29 L74 28 L77 27 Z"/></g></svg>`,
  ch2cp7:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#2a2420"/><ellipse cx="50" cy="82" rx="70" ry="14" fill="#3a3228"/><g><ellipse cx="50" cy="52" rx="16" ry="14" fill="#5a4030" stroke="#2a1a10" stroke-width="1.5"/><ellipse cx="38" cy="42" rx="6" ry="5" fill="#8a5a30"/><ellipse cx="62" cy="42" rx="6" ry="5" fill="#8a5a30"/><ellipse cx="50" cy="36" rx="6" ry="5" fill="#a87040"/></g><circle cx="46" cy="52" r="2" fill="#ffd23f" opacity=".9"/><circle cx="54" cy="52" r="2" fill="#ffd23f" opacity=".9"/></svg>`,
  ch2cp8:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a2024"/><ellipse cx="50" cy="90" rx="70" ry="10" fill="#2a3034"/><path d="M30 88 L30 40 Q30 24 50 24 Q70 24 70 40 L70 88 Z" fill="#5a6470" stroke="#2a3038" stroke-width="2"/><circle cx="50" cy="44" r="8" fill="#0e1818" stroke="#3a4450" stroke-width="2"/><circle cx="50" cy="44" r="3" fill="#8fe08a" opacity=".85"/><rect x="40" y="60" width="20" height="4" fill="#3a4450"/><rect x="38" y="70" width="24" height="4" fill="#3a4450"/></svg>`,
  ch2cp9:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1e1a28"/><ellipse cx="50" cy="86" rx="70" ry="12" fill="#2e2840"/><path d="M30 86 L36 40 L50 30 L64 40 L70 86 Z" fill="#4a4560" stroke="#2a2540" stroke-width="2"/><g fill="#0e0a18"><rect x="40" y="50" width="6" height="4" rx="1"/><rect x="54" y="50" width="6" height="4" rx="1"/><rect x="46" y="62" width="8" height="4" rx="1"/></g><circle cx="50" cy="30" r="3" fill="#b08ae0" opacity=".9"/></svg>`,
  ch2cp10:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="ch2cp10g" cx=".5" cy=".5"><stop offset="0" stop-color="#fff3cf"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#8a6a20"/></radialGradient></defs><rect width="100" height="100" fill="#2a2418"/><circle cx="50" cy="50" r="30" fill="none" stroke="#8a6a20" stroke-width="1" opacity=".5"/><circle cx="50" cy="50" r="18" fill="url(#ch2cp10g)" stroke="#5a4a20" stroke-width="1.5"/><circle cx="50" cy="50" r="8" fill="#fffbe8"/><g stroke="#ffd23f" stroke-width="1.5" stroke-linecap="round" opacity=".8"><path d="M50 12 L50 22 M50 78 L50 88 M12 50 L22 50 M78 50 L88 50"/><path d="M24 24 L32 32 M76 24 L68 32 M24 76 L32 68 M76 76 L68 68"/></g></svg>`,
  ch3cp1:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ch3cp1s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ab0c8"/><stop offset="1" stop-color="#d8e0d0"/></linearGradient></defs><rect width="100" height="100" fill="url(#ch3cp1s)"/><ellipse cx="50" cy="86" rx="80" ry="18" fill="#5a6a50"/><path d="M0 70 Q20 62 40 68 Q60 74 80 66 Q90 62 100 66 L100 100 L0 100 Z" fill="#7a8a70"/><g opacity=".6"><circle cx="76" cy="24" r="10" fill="#fff3cf"/><path d="M62 30 Q76 22 90 30" stroke="#fff3cf" stroke-width="2" fill="none"/></g></svg>`,
  ch3cp2:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ch3cp2s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f2"/><stop offset="1" stop-color="#cfe8b2"/></linearGradient></defs><rect width="100" height="100" fill="url(#ch3cp2s)"/><ellipse cx="50" cy="86" rx="80" ry="16" fill="#628c50"/><polygon points="50,30 40,86 60,86" fill="#b99a62"/><g fill="#3f6a3a"><polygon points="12,80 12,54 30,54 30,80"/><polygon points="6,54 21,40 36,54"/></g><g fill="#4a7c3e"><polygon points="70,80 70,58 90,58 90,80"/><polygon points="64,58 80,44 96,58"/></g></svg>`,
  ch3cp3:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#2a2820"/><ellipse cx="50" cy="86" rx="80" ry="14" fill="#3a3428"/><ellipse cx="42" cy="76" rx="14" ry="5" fill="#1a1814"/><g fill="#5a4030"><circle cx="38" cy="76" r="2"/><circle cx="44" cy="75" r="2"/><circle cx="50" cy="76" r="2"/></g><g transform="rotate(-20 70 70)"><rect x="66" y="42" width="4" height="30" fill="#4a3a28"/><path d="M70 42 L74 30 L70 20 L66 30 Z" fill="#c8ccd4" stroke="#6a7078" stroke-width="1"/><rect x="62" y="48" width="12" height="3" fill="#8a6a20"/></g></svg>`,
  ch3cp4:`<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1e1a"/><ellipse cx="50" cy="90" rx="80" ry="12" fill="#242a24"/><g><path d="M32 88 Q32 30 50 26 Q68 30 68 88 Z" fill="#2a2f28" stroke="#0a0d0a" stroke-width="2"/><path d="M40 44 Q44 40 48 44 M52 44 Q56 40 60 44" stroke="#8fe08a" stroke-width="2.5" fill="none"/></g><g transform="rotate(15 74 60)"><rect x="72" y="20" width="4" height="56" fill="#4a3a20"/><circle cx="74" cy="20" r="6" fill="#8fe08a" opacity=".85"/><circle cx="74" cy="20" r="10" fill="#8fe08a" opacity=".25"/></g></svg>`
};

/* ===== SVG замка для неоткрытого чекпоинта =====
   Занимает 79% плитки, прикрывая содержимое. */
const LOCK_SVG='<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">'
  +'<rect x="5" y="10" width="14" height="10" rx="2" fill="#c9a86a" stroke="#3a2410" stroke-width="1"/>'
  +'<path d="M8 10 L8 7 Q8 3 12 3 Q16 3 16 7 L16 10" fill="none" stroke="#c9a86a" stroke-width="2" stroke-linecap="round"/>'
  +'<circle cx="12" cy="14.5" r="1.6" fill="#3a2410"/>'
  +'<rect x="11.4" y="14.5" width="1.2" height="3" fill="#3a2410"/>'
  +'</svg>';

/* ===== Открытие оверлея «История» =====
   ↙️ Вызывается из: engine_checkpoints_logic.js (openHistoryMenu → window.openHistoryOverlay),
   engine_overlay_input.js (кнопка #histb, клавиша H) */
function openHistoryOverlay(){
  let ov=document.getElementById('histov');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='histov';
    ov.innerHTML='<div class="invbox" style="max-width:820px">'
      +'<h3>История</h3>'
      +'<div class="hint">Пройденные места отмечены.<div class="hgap"></div>Вернись к любому, чтобы продолжить оттуда.</div>'
      +'<div class="histtabs" id="histtabs"></div>'
      +'<div class="histgrid" id="histgrid"></div>'
      +'<div style="text-align:center;margin-top:14px"><button class="btn" id="hist_close">Закрыть</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#hist_close').addEventListener('click',function(){ov.classList.add('hidden');});
  }
  if(typeof window._histActiveChapter!=='number'){
    const list=getCheckpointList();
    let firstOpen=0;
    for(let i=0;i<list.length;i++){
      if(isCheckpointOpen(list[i].id)){firstOpen=list[i].ch;break;}
    }
    window._histActiveChapter=firstOpen||1;
  }
  buildHistoryTabs();
  buildHistoryGrid();
  ov.classList.remove('hidden');
}

/* ===== Проверка: открыта ли глава =====
   Глава считается открытой, если есть хотя бы один открытый чекпоинт этой главы.
   ↙️ Используется в: buildHistoryTabs (в этом же файле) */
function isChapterOpen(ch){
  const list=getCheckpointList();
  for(let i=0;i<list.length;i++){
    if(list[i].ch===ch&&isCheckpointOpen(list[i].id))return true;
  }
  return false;
}

/* ===== Вкладки глав =====
   Закрытая глава — туман, название не видно.
   Открытая глава — название видно, клик переключает сетку.
   ↙️ Вызывается из: openHistoryOverlay (в этом же файле) */
function buildHistoryTabs(){
  const box=document.getElementById('histtabs');
  if(!box)return;
  box.innerHTML='';
  const chapters=getChapterList();
  chapters.forEach(function(c){
    const open=isChapterOpen(c.n);
    const active=(window._histActiveChapter===c.n);
    const btn=document.createElement('button');
    btn.className='histtab'+(open?'':' locked')+(active?' active':'');
    let inner='';
    if(!open){
      inner='<div class="ht-fog"></div><span class="ht-name">'+c.title+'</span>';
    }else{
      inner='<span class="ht-name">'+c.title+'</span>';
    }
    btn.innerHTML=inner;
    if(open){
      btn.addEventListener('click',function(){
        window._histActiveChapter=c.n;
        buildHistoryTabs();
        buildHistoryGrid();
      });
    }
    box.appendChild(btn);
  });
}

/* ===== Построение сетки чекпоинтов активной главы =====
   Неоткрытые чекпоинты — с крупным замком поверх плитки (79% плитки).
   ↗️ getCheckpointList — в: engine_checkpoints_data.js
   ↗️ isCheckpointOpen, getCheckpointTime, returnToCheckpoint — в: engine_checkpoints_logic.js
   ↙️ Вызывается из: openHistoryOverlay, buildHistoryTabs (в этом же файле) */
function buildHistoryGrid(){
  const g=document.getElementById('histgrid');
  if(!g)return;
  g.innerHTML='';
  const activeCh=window._histActiveChapter||1;
  const list=getCheckpointList().filter(function(cp){return cp.ch===activeCh;});
  list.forEach(function(cp){
    const open=isCheckpointOpen(cp.id);
    const cell=document.createElement('div');
    cell.className='histcell'+(open?'':' locked');
    const art=CP_ART[cp.id]||'';
    let html='<div class="histart">'+art;
    if(!open){
      html+='<div class="histlock">'+LOCK_SVG+'</div>';
    }
    html+='</div>'
      +'<div class="histname">'+(open?cp.name:'—')+'</div>'
      +'<div class="histtime">'+(open?getCheckpointTime(cp.id):'')+'</div>'
      +(open?'<div class="histbadge">открыто</div>':'');
    cell.innerHTML=html;
    if(open){
      cell.addEventListener('click',function(){
        if(confirm('Вернуться к «'+cp.name+'»? Текущий прогресс будет заменён состоянием того момента.')){
          document.getElementById('histov').classList.add('hidden');
          returnToCheckpoint(cp.id);
        }
      });
    }
    g.appendChild(cell);
  });
}
window.openHistoryOverlay=openHistoryOverlay;