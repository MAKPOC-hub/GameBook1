// icons.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: единый источник SVG-иконок для интерфейса (вместо эмодзи)
// Изменение: добавлена иконка ordric — Жрец Ордрик, финальный босс главы 3

(function(){
'use strict';

const Icons={

  /* Кубик */
  dice(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<rect x="3" y="3" width="18" height="18" rx="3" fill="#f6ead0" stroke="#5b422a" stroke-width="1.5"/>'
      +'<circle cx="8" cy="8" r="1.6" fill="#2f2417"/>'
      +'<circle cx="16" cy="8" r="1.6" fill="#2f2417"/>'
      +'<circle cx="12" cy="12" r="1.6" fill="#2f2417"/>'
      +'<circle cx="8" cy="16" r="1.6" fill="#2f2417"/>'
      +'<circle cx="16" cy="16" r="1.6" fill="#2f2417"/>'
      +'</svg>';
  },

  /* Капля воды */
  drop(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<path d="M12 3 Q6 11 6 16 Q6 21 12 21 Q18 21 18 16 Q18 11 12 3 Z" fill="#7fb8c4" stroke="#3a6a80" stroke-width="1.5"/>'
      +'<ellipse cx="9.5" cy="14" rx="1.6" ry="3" fill="#dff0fa" opacity=".65"/>'
      +'</svg>';
  },

  /* Компас */
  compass(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<circle cx="12" cy="12" r="10" fill="#f0e2c4" stroke="#8a6a20" stroke-width="1.5"/>'
      +'<circle cx="12" cy="12" r="6" fill="#fff8e0"/>'
      +'<path d="M12 5 L13.5 11 L12 13 L10.5 11 Z" fill="#b03030" stroke="#5a1010" stroke-width=".6"/>'
      +'<path d="M12 19 L10.5 13 L12 11 L13.5 13 Z" fill="#3a4a58" stroke="#1a2028" stroke-width=".6"/>'
      +'<circle cx="12" cy="12" r="1.4" fill="#5b3a20"/>'
      +'</svg>';
  },

  /* Вспышка */
  flash(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<circle cx="12" cy="12" r="4.5" fill="#ffe9a0"/>'
      +'<circle cx="12" cy="12" r="2.5" fill="#fffbe8"/>'
      +'<g stroke="#e8c76a" stroke-width="1.6" stroke-linecap="round">'
      +'<path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12"/>'
      +'<path d="M5 5 L8 8 M16 16 L19 19 M5 19 L8 16 M16 8 L19 5"/>'
      +'</g>'
      +'</svg>';
  },

  /* Меч */
  sword(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<g transform="rotate(45 12 12)">'
      +'<path d="M11 3 L13 3 L13 15 L12 18 L11 15 Z" fill="#dfe6ee" stroke="#6a7078" stroke-width="1"/>'
      +'<rect x="8" y="15" width="8" height="1.8" fill="#d4b060" stroke="#8a6a20" stroke-width=".6"/>'
      +'<rect x="11" y="16.8" width="2" height="4" fill="#5b3a20"/>'
      +'<circle cx="12" cy="21.5" r="1.2" fill="#d4b060"/>'
      +'</g>'
      +'</svg>';
  },

  /* Бег */
  run(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<circle cx="14" cy="5" r="2.2" fill="#e9dfc5"/>'
      +'<path d="M11 9 Q13 8 15 9 L17 13 L15 14 L13 11 L12 14 L9 20 L7 19 L10 14 L9 11 Z" fill="#e9dfc5" stroke="#5b422a" stroke-width=".4"/>'
      +'<path d="M12 14 L17 17 L16 19 L11 16 Z" fill="#e9dfc5" stroke="#5b422a" stroke-width=".4"/>'
      +'</svg>';
  },

  /* Огонь */
  fire(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<path d="M12 2 Q15 8 14 12 Q17 10 17 8 Q20 13 17 17 Q14 22 12 22 Q10 22 7 17 Q4 13 7 8 Q7 10 10 12 Q9 8 12 2 Z" fill="#e86a2a" stroke="#b03010" stroke-width=".6"/>'
      +'<path d="M12 8 Q14 12 13 15 Q14 15 15 13 Q16 17 13 20 Q12 21 11 20 Q8 17 9 13 Q10 15 11 15 Q10 12 12 8 Z" fill="#ffd23f"/>'
      +'</svg>';
  },

  /* Сердце */
  heart(size,color){
    const s=size||18;
    const c=color||'#e2453b';
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<path d="M12 21 Q3 14 3 8.5 Q3 5 6 4 Q9 3 12 6 Q15 3 18 4 Q21 5 21 8.5 Q21 14 12 21 Z" fill="'+c+'" stroke="#5a1010" stroke-width=".6"/>'
      +'<path d="M7 8 Q8 6 10 6" stroke="#fff" stroke-width="1" fill="none" opacity=".5" stroke-linecap="round"/>'
      +'</svg>';
  },

  /* Лютня */
  lute(size){
    const s=size||18;
    return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" style="vertical-align:-.15em;display:inline-block" aria-hidden="true">'
      +'<ellipse cx="10" cy="15" rx="6" ry="5.5" fill="#c89050" stroke="#5b3a20" stroke-width="1"/>'
      +'<ellipse cx="10" cy="15" rx="2.2" ry="2" fill="#2a1a10"/>'
      +'<rect x="9" y="3" width="2" height="10" fill="#5b3a20"/>'
      +'<rect x="7.5" y="2" width="5" height="2.2" rx=".6" fill="#3a2410"/>'
      +'<circle cx="8" cy="3.2" r=".6" fill="#d4b060"/>'
      +'<circle cx="12" cy="3.2" r=".6" fill="#d4b060"/>'
      +'</svg>';
  },

  /* Враги */
  tree(size){
    const s=size||44;
    return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true">'
      +'<rect x="29" y="38" width="6" height="20" fill="#4a3324" rx="1"/>'
      +'<circle cx="32" cy="26" r="16" fill="#3f6a3a"/>'
      +'<circle cx="22" cy="32" r="10" fill="#35602f"/>'
      +'<circle cx="42" cy="32" r="10" fill="#35602f"/>'
      +'<circle cx="32" cy="20" r="8" fill="#4a7c3e" opacity=".85"/>'
      +'</svg>';
  },
  wolf(size){
    const s=size||44;
    return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true">'
      +'<path d="M16 26 L20 18 L26 24 L38 24 L44 18 L48 26 L48 44 Q48 52 32 52 Q16 52 16 44 Z" fill="#6a7280" stroke="#3a3f46" stroke-width="1.5"/>'
      +'<path d="M20 18 L26 24 L22 28 Z" fill="#3a3f46"/>'
      +'<path d="M44 18 L38 24 L42 28 Z" fill="#3a3f46"/>'
      +'<circle cx="26" cy="34" r="2" fill="#ffe9a0"/>'
      +'<circle cx="38" cy="34" r="2" fill="#ffe9a0"/>'
      +'<path d="M30 40 L32 44 L34 40 Z" fill="#2a2e34"/>'
      +'</svg>';
  },
  spider(size){
    const s=size||44;
    return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true">'
      +'<g stroke="#2a1810" stroke-width="2.5" fill="none" stroke-linecap="round">'
      +'<path d="M22 30 L10 22 M22 36 L8 34 M22 42 L10 48 M28 46 L20 58"/>'
      +'<path d="M42 30 L54 22 M42 36 L56 34 M42 42 L54 48 M36 46 L44 58"/>'
      +'</g>'
      +'<ellipse cx="32" cy="34" rx="10" ry="9" fill="#2a1810" stroke="#100804" stroke-width="1.5"/>'
      +'<circle cx="28" cy="32" r="1.5" fill="#ff9a3a"/>'
      +'<circle cx="36" cy="32" r="1.5" fill="#ff9a3a"/>'
      +'<ellipse cx="32" cy="46" rx="12" ry="8" fill="#3a2418" stroke="#100804" stroke-width="1.5"/>'
      +'</svg>';
  },
  dragon(size){
    const s=size||44;
    return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true">'
      +'<ellipse cx="32" cy="40" rx="22" ry="10" fill="#2e1208" stroke="#100804" stroke-width="1.5"/>'
      +'<path d="M14 34 L6 22 L18 28 Z" fill="#2e1208" stroke="#100804" stroke-width="1.2"/>'
      +'<path d="M50 34 L58 22 L46 28 Z" fill="#2e1208" stroke="#100804" stroke-width="1.2"/>'
      +'<circle cx="26" cy="22" r="7" fill="#8a2a1a" stroke="#100804" stroke-width="1.2"/>'
      +'<circle cx="26" cy="22" r="2.5" fill="#ffd23f"/>'
      +'<circle cx="42" cy="22" r="7" fill="#8a2a1a" stroke="#100804" stroke-width="1.2"/>'
      +'<circle cx="42" cy="22" r="2.5" fill="#ffd23f"/>'
      +'<path d="M30 42 Q32 48 32 50 Q34 48 36 42" fill="#e86a2a"/>'
      +'</svg>';
  },
  ordric(size){
    const s=size||44;
    return '<svg viewBox="0 0 64 64" width="'+s+'" height="'+s+'" aria-hidden="true">'
      +'<path d="M32 10 Q44 14 46 30 L46 54 L18 54 L18 30 Q20 14 32 10 Z" fill="#1a1f1a" stroke="#0a0d0a" stroke-width="1.5"/>'
      +'<path d="M32 14 Q40 18 42 30 L42 44 L22 44 L22 30 Q24 18 32 14 Z" fill="#0e120e"/>'
      +'<ellipse cx="27" cy="30" rx="2" ry="1.6" fill="#8fe08a"/>'
      +'<ellipse cx="37" cy="30" rx="2" ry="1.6" fill="#8fe08a"/>'
      +'<path d="M50 10 L52 46 M50 10 L46 14 M50 10 L54 14" stroke="#4a3a20" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
      +'<circle cx="50" cy="8" r="3.5" fill="#8fe08a" opacity=".9"/>'
      +'<circle cx="50" cy="8" r="6" fill="#8fe08a" opacity=".25"/>'
      +'</svg>';
  }
};

window.Icons=Icons;
})();