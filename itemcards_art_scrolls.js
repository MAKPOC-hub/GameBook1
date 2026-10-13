// itemcards_art_scrolls.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: SVG-арты свитков (два штуки) — «Огненный шар» и «Исцеление»
// Изменение: восстановление после сбоя: дописана закрывающая скобка объекта ART_SCROLLS

'use strict';

/* ↙️ Используется в: itemcards_export.js (сборка общего ART) */
window.ART_SCROLLS = {
scroll_fire:{bg:'radial-gradient(circle at 30% 20%, rgba(255,140,80,.14), transparent 55%), radial-gradient(circle at 70% 85%, rgba(0,0,0,.5), transparent 55%), #3a1c14',br:'#c85a2a',
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><rect x="26" y="24" width="48" height="92" fill="#f0e2c4" stroke="#8a6a20" stroke-width="1.5"/><ellipse cx="50" cy="24" rx="24" ry="5" fill="#d4b060" stroke="#8a6a20" stroke-width="1"/><ellipse cx="50" cy="116" rx="24" ry="5" fill="#d4b060" stroke="#8a6a20" stroke-width="1"/><path d="M50 44 Q62 58 58 72 Q56 80 50 84 Q44 80 42 72 Q40 62 46 56 Q46 62 50 64 Q52 58 50 44 Z" fill="#e86a2a" stroke="#b03010" stroke-width="1.5"/><path d="M50 56 Q55 64 52 72 Q51 76 50 78 Q47 74 47 68 Q47 62 50 56 Z" fill="#ffd23f"/><g stroke="#8a6a20" stroke-width="1" opacity=".6"><path d="M32 96 L68 96 M32 102 L68 102 M32 108 L56 108"/></g><g fill="#ffe9a0"><path d="M30 34 L31.5 38 L35.5 39.5 L31.5 41 L30 45 L28.5 41 L24.5 39.5 L28.5 38 Z"/></g></svg>`},
scroll_heal:{bg:'radial-gradient(circle at 30% 20%, rgba(140,220,160,.14), transparent 55%), radial-gradient(circle at 70% 85%, rgba(0,0,0,.5), transparent 55%), #1c3020',br:'#3f8a4a',
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><rect x="26" y="24" width="48" height="92" fill="#f0e2c4" stroke="#8a6a20" stroke-width="1.5"/><ellipse cx="50" cy="24" rx="24" ry="5" fill="#d4b060" stroke="#8a6a20" stroke-width="1"/><ellipse cx="50" cy="116" rx="24" ry="5" fill="#d4b060" stroke="#8a6a20" stroke-width="1"/><g fill="#3f8a4a" stroke="#1e5a2a" stroke-width="1.5"><rect x="45" y="46" width="10" height="34" rx="2"/><rect x="33" y="58" width="34" height="10" rx="2"/></g><circle cx="50" cy="63" r="24" fill="none" stroke="#3f8a4a" stroke-width="1.5" opacity=".7"/><g stroke="#8a6a20" stroke-width="1" opacity=".6"><path d="M32 96 L68 96 M32 102 L68 102 M32 108 L56 108"/></g><g fill="#c0e8b0"><circle cx="32" cy="40" r="1.6"/><circle cx="68" cy="44" r="1.4"/></g></svg>`}
};