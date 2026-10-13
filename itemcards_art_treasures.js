// itemcards_art_treasures.js
// v1.0.2 -> v1.0.3
// Проект: GameBook1
// Функция: SVG-арт сокровищ
// Изменение: восстановление после сбоя: дописана закрывающая скобка объекта ART_TREASURES

'use strict';

/* ↙️ Используется в: itemcards_export.js (сборка общего ART) */
window.ART_TREASURES = {
silver_whistle:{bg:'radial-gradient(circle at 30% 20%, rgba(200,215,235,.22), transparent 55%), radial-gradient(circle at 70% 85%, rgba(0,0,0,.55), transparent 58%), #2a3038',br:'#a8b8c8',
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="silverTube" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0e6ee"/><stop offset=".35" stop-color="#a8b4c4"/><stop offset=".65" stop-color="#7a8698"/><stop offset="1" stop-color="#4a5460"/></linearGradient><radialGradient id="silverRing" cx=".35" cy=".30" r=".75"><stop offset="0" stop-color="#f0f4fa"/><stop offset=".55" stop-color="#b8c4d0"/><stop offset="1" stop-color="#5a6470"/></radialGradient></defs><ellipse cx="50" cy="122" rx="26" ry="4" fill="#000" opacity=".45"/><g transform="rotate(-18 50 70)"><rect x="44" y="26" width="12" height="82" rx="3" fill="url(#silverTube)" stroke="#2a3038" stroke-width="1.5"/><rect x="46" y="28" width="2" height="78" fill="#f0f4fa" opacity=".55"/><rect x="48" y="30" width="1" height="74" fill="#fff" opacity=".7"/><rect x="41" y="24" width="18" height="8" rx="2" fill="#c8d2dc" stroke="#2a3038" stroke-width="1.2"/><path d="M44 32 Q50 34 56 32" fill="none" stroke="#3a4450" stroke-width="1" opacity=".6"/><ellipse cx="50" cy="103" rx="6" ry="3" fill="#5a6470" stroke="#2a3038" stroke-width="1"/><rect x="46" y="103" width="8" height="4" rx="1" fill="#3a4450"/><path d="M42 108 Q50 111 58 108" fill="none" stroke="#2a3038" stroke-width="1"/><circle cx="50" cy="118" r="6" fill="url(#silverRing)" stroke="#2a3038" stroke-width="1.3"/><circle cx="50" cy="118" r="3.4" fill="#3a4450"/><circle cx="48.5" cy="116.5" r="1" fill="#f0f4fa" opacity=".9"/></g><g transform="translate(50,50)"><circle r="7" fill="none" stroke="#5a6470" stroke-width="1.6"/><circle r="2" fill="#5a6470"/></g><g fill="#f0f4fa" opacity=".6"><path d="M22 30 L23 33 L26 34 L23 35 L22 38 L21 35 L18 34 L21 33 Z"/><path d="M78 40 L79 43 L82 44 L79 45 L78 48 L77 45 L74 44 L77 43 Z"/></g></svg>`}
};