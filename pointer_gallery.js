// pointer_gallery.js
// v1.0.0
// Проект: GameBook1
// Функция: галерея 50 вариантов указателей прокрутки текста (верхний + нижний). Каждый вариант — под своим номером, со своим цветом, толщиной и анимацией. Только для просмотра и выбора.
// Изменение: файл создан

(function(){
'use strict';

/* ===== 50 пар указателей =====
   Каждая пара — объект с полями:
   n     — номер варианта (1–50), отображается над парой;
   name  — короткое название стиля (для ориентира);
   color — цвет линий стрелки;
   w     — толщина линий в пикселях;
   up    — SVG верхнего указателя (стрелка вверх);
   down  — SVG нижнего указателя (стрелка вниз);
   anim  — имя CSS-анимации (без @keyframes — они ниже).

   Все SVG используют viewBox="0 0 200 18" и preserveAspectRatio="none",
   чтобы указатели растягивались на всю ширину блока 200 пикселей.
   По высоте — 18 пикселей. */

const PAIRS=[

/* === 1–5. Шевроны === */
{n:1,name:'Шеврон тонкий',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,14 100,4 180,14" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,4 100,14 180,4" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgPulse'},

{n:2,name:'Шеврон жирный',color:'#e8c76a',w:4,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#e8c76a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#e8c76a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgBounce'},

{n:3,name:'Шеврон пунктир',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,14 100,4 180,14" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 4"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,4 100,14 180,4" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6 4"/></svg>',
anim:'pgSlide'},

{n:4,name:'Шеврон с тенью',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,5 180,15" fill="none" stroke="#2a1808" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,14 100,4 180,14" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,13 180,3" fill="none" stroke="#2a1808" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,4 100,14 180,4" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgGlow'},

{n:5,name:'Шеврон в круге',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="9" r="8" fill="none" stroke="#e8c76a" stroke-width="1" opacity=".5"/><polyline points="94,11 100,5 106,11" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="9" r="8" fill="none" stroke="#e8c76a" stroke-width="1" opacity=".5"/><polyline points="94,7 100,13 106,7" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgFade'},

/* === 6–10. Двойные и тройные шевроны === */
{n:6,name:'Двойной шеврон',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,16 100,10 180,16" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/><polyline points="20,9 100,3 180,9" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,2 100,8 180,2" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,9 100,15 180,9" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/></svg>',
anim:'pgWave'},

{n:7,name:'Тройной шеврон',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="30,17 100,13 170,17" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".4"/><polyline points="30,11 100,7 170,11" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/><polyline points="30,5 100,1 170,5" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="30,1 100,5 170,1" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="30,7 100,11 170,7" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/><polyline points="30,13 100,17 170,13" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".4"/></svg>',
anim:'pgBreath'},

{n:8,name:'Двойной жирный',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="30,16 100,10 170,16" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/><polyline points="30,8 100,2 170,8" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="30,2 100,8 170,2" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polyline points="30,10 100,16 170,10" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/></svg>',
anim:'pgPulseSlow'},

{n:9,name:'Шеврон с хвостом',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="60,15 100,5 140,15" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="40" y1="14" x2="40" y2="4" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" opacity=".5"/><line x1="160" y1="14" x2="160" y2="4" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="60,3 100,13 140,3" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="40" y1="4" x2="40" y2="14" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" opacity=".5"/><line x1="160" y1="4" x2="160" y2="14" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>',
anim:'pgSlideSoft'},

{n:10,name:'Шеврон-градиент',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pgG10u" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e8c76a" stop-opacity=".15"/><stop offset="1" stop-color="#e8c76a" stop-opacity="1"/></linearGradient></defs><polyline points="20,15 100,3 180,15" fill="none" stroke="url(#pgG10u)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pgG10d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8c76a" stop-opacity=".15"/><stop offset="1" stop-color="#e8c76a" stop-opacity="1"/></linearGradient></defs><polyline points="20,3 100,15 180,3" fill="none" stroke="url(#pgG10d)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgFadeInOut'},

/* === 11–15. Стрелы === */
{n:11,name:'Стрела тонкая',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="16" x2="100" y2="4" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="92,8 100,2 108,8" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="2" x2="100" y2="14" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="92,10 100,16 108,10" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgSlide'},

{n:12,name:'Стрела жирная',color:'#e8c76a',w:4,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="17" x2="100" y2="4" stroke="#e8c76a" stroke-width="4" stroke-linecap="round"/><polyline points="90,8 100,1 110,8" fill="none" stroke="#e8c76a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="1" x2="100" y2="14" stroke="#e8c76a" stroke-width="4" stroke-linecap="round"/><polyline points="90,10 100,17 110,10" fill="none" stroke="#e8c76a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgBounce'},

{n:13,name:'Стрела с наконечником',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="18" x2="100" y2="10" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polygon points="100,2 108,11 92,11" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="0" x2="100" y2="8" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polygon points="100,16 108,7 92,7" fill="#e8c76a"/></svg>',
anim:'pgFade'},

{n:14,name:'Двойная стрела',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="17" x2="100" y2="8" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="90,12 100,6 110,12" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="90,17 100,11 110,17" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="1" x2="100" y2="10" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="90,6 100,12 110,6" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="90,1 100,7 110,1" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/></svg>',
anim:'pgWave'},

{n:15,name:'Стрела-ромб',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 17 L92 8 L100 1 L108 8 Z" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 1 L92 10 L100 17 L108 10 Z" fill="#e8c76a"/></svg>',
anim:'pgPulse'},

/* === 16–20. Точки, черты === */
{n:16,name:'Три точки',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="9" r="2" fill="#e8c76a"/><circle cx="100" cy="9" r="2" fill="#e8c76a"/><circle cx="160" cy="9" r="2" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="9" r="2" fill="#e8c76a"/><circle cx="100" cy="9" r="2" fill="#e8c76a"/><circle cx="160" cy="9" r="2" fill="#e8c76a"/></svg>',
anim:'pgBlink'},

{n:17,name:'Точки вертикально',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="15" r="2" fill="#e8c76a"/><circle cx="100" cy="9" r="1.6" fill="#e8c76a" opacity=".7"/><circle cx="100" cy="4" r="1.2" fill="#e8c76a" opacity=".4"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="3" r="2" fill="#e8c76a"/><circle cx="100" cy="9" r="1.6" fill="#e8c76a" opacity=".7"/><circle cx="100" cy="14" r="1.2" fill="#e8c76a" opacity=".4"/></svg>',
anim:'pgPulseUp'},

{n:18,name:'Черта',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="9" x2="160" y2="9" stroke="#e8c76a" stroke-width="3" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="40" y1="9" x2="160" y2="9" stroke="#e8c76a" stroke-width="3" stroke-linecap="round"/></svg>',
anim:'pgBreath'},

{n:19,name:'Черта с точкой',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="60" y1="12" x2="140" y2="12" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="6" r="2" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="60" y1="6" x2="140" y2="6" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="12" r="2" fill="#e8c76a"/></svg>',
anim:'pgSlideSoft'},

{n:20,name:'Звёздочка',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 2 L102 7 L107 9 L102 11 L100 16 L98 11 L93 9 L98 7 Z" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 2 L102 7 L107 9 L102 11 L100 16 L98 11 L93 9 L98 7 Z" fill="#e8c76a"/></svg>',
anim:'pgPulse'},

/* === 21–25. Зигзаги и волны === */
{n:21,name:'Зигзаг',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="40,14 70,6 100,14 130,6 160,14" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="40,4 70,12 100,4 130,12 160,4" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgWave'},

{n:22,name:'Волна',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 12 Q65 2 100 12 Q135 22 170 12" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 6 Q65 16 100 6 Q135 -4 170 6" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
anim:'pgWaveSoft'},

{n:23,name:'Волнистая линия',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 9 Q50 3 70 9 Q90 15 110 9 Q130 3 150 9 Q165 13 170 9" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 9 Q50 15 70 9 Q90 3 110 9 Q130 15 150 9 Q165 5 170 9" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
anim:'pgSlide'},

{n:24,name:'Пила',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 14 L40 4 L50 14 L60 4 L70 14 L80 4 L90 14 L100 4 L110 14 L120 4 L130 14 L140 4 L150 14 L160 4 L170 14" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 4 L40 14 L50 4 L60 14 L70 4 L80 14 L90 4 L100 14 L110 4 L120 14 L130 4 L140 14 L150 4 L160 14 L170 4" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgFastPulse'},

{n:25,name:'Ступени',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="40,14 70,14 70,9 100,9 100,4 130,4 130,9 160,9 160,14" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="40,4 70,4 70,9 100,9 100,14 130,14 130,9 160,9 160,4" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgSlideSoft'},

/* === 26–30. Цветные варианты — разные палитры === */
{n:26,name:'Шеврон зелёный',color:'#a8e07a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#a8e07a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#a8e07a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgPulse'},

{n:27,name:'Шеврон серебряный',color:'#d8dce4',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#d8dce4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#d8dce4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgGlow'},

{n:28,name:'Шеврон багровый',color:'#e0856a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#e0856a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#e0856a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgBounce'},

{n:29,name:'Шеврон ледяной',color:'#a0d8f0',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#a0d8f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#a0d8f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgFadeInOut'},

{n:30,name:'Шеврон белый',color:'#f0e2c4',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#f0e2c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#f0e2c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgBreath'},

/* === 31–35. Толщина — от тонкой к очень жирной === */
{n:31,name:'Очень тонкий шеврон',color:'#e8c76a',w:1,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,14 100,5 180,14" fill="none" stroke="#e8c76a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,4 100,13 180,4" fill="none" stroke="#e8c76a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgPulse'},

{n:32,name:'Очень жирный шеврон',color:'#e8c76a',w:6,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,16 100,2 180,16" fill="none" stroke="#e8c76a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,2 100,16 180,2" fill="none" stroke="#e8c76a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgPulseSlow'},

{n:33,name:'Шеврон с обводкой',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#2a1808" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,15 100,3 180,15" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#2a1808" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,3 100,15 180,3" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgGlow'},

{n:34,name:'Шеврон с контуром',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#fff3cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,16 100,4 180,16" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#fff3cf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="20,2 100,14 180,2" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgFade'},

{n:35,name:'Шеврон с глоу',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#e8c76a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".25"/><polyline points="20,15 100,3 180,15" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#e8c76a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".25"/><polyline points="20,3 100,15 180,3" fill="none" stroke="#e8c76a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgGlowSlow'},

/* === 36–40. Точки-индикаторы === */
{n:36,name:'Ряд точек',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="9" r="1.6" fill="#e8c76a" opacity=".4"/><circle cx="80" cy="9" r="1.8" fill="#e8c76a" opacity=".6"/><circle cx="100" cy="9" r="2" fill="#e8c76a"/><circle cx="120" cy="9" r="1.8" fill="#e8c76a" opacity=".6"/><circle cx="140" cy="9" r="1.6" fill="#e8c76a" opacity=".4"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="9" r="1.6" fill="#e8c76a" opacity=".4"/><circle cx="80" cy="9" r="1.8" fill="#e8c76a" opacity=".6"/><circle cx="100" cy="9" r="2" fill="#e8c76a"/><circle cx="120" cy="9" r="1.8" fill="#e8c76a" opacity=".6"/><circle cx="140" cy="9" r="1.6" fill="#e8c76a" opacity=".4"/></svg>',
anim:'pgBlink'},

{n:37,name:'Точка-луна',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="9" r="5" fill="none" stroke="#e8c76a" stroke-width="1.5"/><circle cx="100" cy="9" r="2" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="9" r="5" fill="none" stroke="#e8c76a" stroke-width="1.5"/><circle cx="100" cy="9" r="2" fill="#e8c76a"/></svg>',
anim:'pgPulseSlow'},

{n:38,name:'Три ромба',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 9 L64 5 L68 9 L64 13 Z" fill="#e8c76a" opacity=".4"/><path d="M96 9 L100 5 L104 9 L100 13 Z" fill="#e8c76a"/><path d="M132 9 L136 5 L140 9 L136 13 Z" fill="#e8c76a" opacity=".4"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M60 9 L64 5 L68 9 L64 13 Z" fill="#e8c76a" opacity=".4"/><path d="M96 9 L100 5 L104 9 L100 13 Z" fill="#e8c76a"/><path d="M132 9 L136 5 L140 9 L136 13 Z" fill="#e8c76a" opacity=".4"/></svg>',
anim:'pgBlinkWave'},

{n:39,name:'Ромб с обводкой',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 2 L110 9 L100 16 L90 9 Z" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linejoin="round"/><path d="M100 6 L105 9 L100 12 L95 9 Z" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 2 L110 9 L100 16 L90 9 Z" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linejoin="round"/><path d="M100 6 L105 9 L100 12 L95 9 Z" fill="#e8c76a"/></svg>',
anim:'pgGlow'},

{n:40,name:'Х-крестик',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="94" y1="3" x2="106" y2="15" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><line x1="106" y1="3" x2="94" y2="15" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="94" y1="3" x2="106" y2="15" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><line x1="106" y1="3" x2="94" y2="15" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
anim:'pgFade'},

/* === 41–45. Комбинированные === */
{n:41,name:'Шеврон + черта',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="60,13 100,4 140,13" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="60" y1="16" x2="140" y2="16" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="60,5 100,14 140,5" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="60" y1="2" x2="140" y2="2" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>',
anim:'pgSlide'},

{n:42,name:'Стрела и точки',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="15" x2="100" y2="5" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="94,9 100,3 106,9" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="15" r="1.4" fill="#e8c76a" opacity=".6"/><circle cx="120" cy="15" r="1.4" fill="#e8c76a" opacity=".6"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="3" x2="100" y2="13" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="94,9 100,15 106,9" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="3" r="1.4" fill="#e8c76a" opacity=".6"/><circle cx="120" cy="3" r="1.4" fill="#e8c76a" opacity=".6"/></svg>',
anim:'pgFadeInOut'},

{n:43,name:'Треугольник',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polygon points="100,2 112,15 88,15" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polygon points="100,16 112,3 88,3" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linejoin="round"/></svg>',
anim:'pgBreath'},

{n:44,name:'Капля',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 16 L100 6 Q92 4 100 1 Q108 4 100 6 Z" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 2 L100 12 Q92 14 100 17 Q108 14 100 12 Z" fill="#e8c76a"/></svg>',
anim:'pgPulse'},

{n:45,name:'Спираль',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 15 Q88 15 88 9 Q88 3 100 3 Q112 3 112 9 Q112 13 104 13" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 3 Q88 3 88 9 Q88 15 100 15 Q112 15 112 9 Q112 5 104 5" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
anim:'pgSpin'},

/* === 46–50. Экспериментальные формы === */
{n:46,name:'Полукруг с чертой',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M70 14 Q100 2 130 14" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><line x1="70" y1="15" x2="130" y2="15" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M70 4 Q100 16 130 4" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><line x1="70" y1="3" x2="130" y2="3" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
anim:'pgWaveSoft'},

{n:47,name:'Плавник',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 16 L88 4 L100 9 L112 4 Z" fill="#e8c76a"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 2 L88 14 L100 9 L112 14 Z" fill="#e8c76a"/></svg>',
anim:'pgSlideSoft'},

{n:48,name:'Двойные скобки',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M75 15 Q90 9 100 4 Q110 9 125 15" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M75 3 Q90 9 100 14 Q110 9 125 3" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/></svg>',
anim:'pgPulseSlow'},

{n:49,name:'Стрелка с оперением',color:'#e8c76a',w:2,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="17" x2="100" y2="7" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="92,10 100,4 108,10" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="92" y1="16" x2="108" y2="16" stroke="#e8c76a" stroke-width="1.5" opacity=".6"/><line x1="94" y1="18" x2="106" y2="18" stroke="#e8c76a" stroke-width="1.5" opacity=".4"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="1" x2="100" y2="11" stroke="#e8c76a" stroke-width="2" stroke-linecap="round"/><polyline points="92,8 100,14 108,8" fill="none" stroke="#e8c76a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="92" y1="2" x2="108" y2="2" stroke="#e8c76a" stroke-width="1.5" opacity=".6"/><line x1="94" y1="0" x2="106" y2="0" stroke="#e8c76a" stroke-width="1.5" opacity=".4"/></svg>',
anim:'pgFade'},

{n:50,name:'Шеврон пульс-глоу',color:'#e8c76a',w:3,
up:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,15 100,3 180,15" fill="none" stroke="#e8c76a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".4"/><polyline points="20,15 100,3 180,15" fill="none" stroke="#fff3cf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
down:'<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,3 100,15 180,3" fill="none" stroke="#e8c76a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".4"/><polyline points="20,3 100,15 180,3" fill="none" stroke="#fff3cf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
anim:'pgGlowSlow'}
];

/* ===== CSS для галереи и всех анимаций ===== */
(function _injectPointerStyles(){
  if(document.getElementById('zl-pointer-styles'))return;
  const st=document.createElement('style');
  st.id='zl-pointer-styles';
  st.textContent=
  '.pgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:12px}'
  +'@media(max-width:520px){.pgrid{grid-template-columns:1fr}}'
  +'.pgcell{border:2px solid rgba(122,90,56,.55);border-radius:10px;padding:8px;background:rgba(0,0,0,.22);display:flex;flex-direction:column;gap:6px}'
  +'.pghead{font-size:11.5px;color:#e8c76a;font-weight:700;letter-spacing:1px;text-align:center;text-shadow:0 1px 2px #000}'
  +'.pgname{font-size:10px;color:#c8bc9c;text-align:center;opacity:.8;font-style:italic;margin-top:-2px}'
  +'.pgstrip{margin-top:4px;background:linear-gradient(rgba(20,28,16,.92),rgba(20,28,16,.92));border:1px solid #8a6a44;border-radius:8px;padding:3px 0;display:flex;flex-direction:column;align-items:center}'
  +'.pgup,.pgdown{width:200px;height:18px;display:flex;align-items:center;justify-content:center}'
  +'.pgup svg,.pgdown svg{width:100%;height:100%;display:block}'
  /* ===== Анимации ===== */
  +'@keyframes pgPulse{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.65;transform:translateY(-2px)}}'
  +'@keyframes pgPulseSlow{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.75;transform:translateY(0)}}'
  +'@keyframes pgPulseUp{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:.5;transform:translateY(-3px)}}'
  +'@keyframes pgBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}'
  +'@keyframes pgSlide{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}'
  +'@keyframes pgSlideSoft{0%,100%{transform:translateY(0)}50%{transform:translateY(1px)}}'
  +'@keyframes pgWave{0%,100%{transform:translateY(0)}25%{transform:translateY(-2px)}75%{transform:translateY(2px)}}'
  +'@keyframes pgWaveSoft{0%,100%{transform:translateY(0)}25%{transform:translateY(-1.5px)}75%{transform:translateY(1.5px)}}'
  +'@keyframes pgGlow{0%,100%{filter:drop-shadow(0 0 0 transparent);opacity:1}50%{filter:drop-shadow(0 0 4px #e8c76a);opacity:.9}}'
  +'@keyframes pgGlowSlow{0%,100%{filter:drop-shadow(0 0 0 transparent);opacity:1}50%{filter:drop-shadow(0 0 6px #fff3cf);opacity:.85}}'
  +'@keyframes pgFade{0%,100%{opacity:1}50%{opacity:.4}}'
  +'@keyframes pgFadeInOut{0%{opacity:0;transform:translateY(-2px)}40%,60%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(2px)}}'
  +'@keyframes pgBreath{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}'
  +'@keyframes pgBlink{0%,100%{opacity:1}50%{opacity:.35}}'
  +'@keyframes pgBlinkWave{0%,100%{opacity:1}33%{opacity:.4}66%{opacity:.7}}'
  +'@keyframes pgFastPulse{0%,100%{opacity:1}50%{opacity:.5}}'
  +'@keyframes pgSpin{0%,100%{transform:rotate(0deg)}50%{transform:rotate(180deg)}}'
  /* Применение анимаций к элементам по имени */
  +'.pgup.a-pgPulse,.pgdown.a-pgPulse{animation:pgPulse 2s ease-in-out infinite}'
  +'.pgup.a-pgPulseSlow,.pgdown.a-pgPulseSlow{animation:pgPulseSlow 2.6s ease-in-out infinite}'
  +'.pgup.a-pgPulseUp,.pgdown.a-pgPulseUp{animation:pgPulseUp 2s ease-in-out infinite}'
  +'.pgup.a-pgBounce,.pgdown.a-pgBounce{animation:pgBounce 1.6s ease-in-out infinite}'
  +'.pgup.a-pgSlide,.pgdown.a-pgSlide{animation:pgSlide 2s ease-in-out infinite}'
  +'.pgup.a-pgSlideSoft,.pgdown.a-pgSlideSoft{animation:pgSlideSoft 2.2s ease-in-out infinite}'
  +'.pgup.a-pgWave,.pgdown.a-pgWave{animation:pgWave 2.4s ease-in-out infinite}'
  +'.pgup.a-pgWaveSoft,.pgdown.a-pgWaveSoft{animation:pgWaveSoft 2.4s ease-in-out infinite}'
  +'.pgup.a-pgGlow,.pgdown.a-pgGlow{animation:pgGlow 2s ease-in-out infinite}'
  +'.pgup.a-pgGlowSlow,.pgdown.a-pgGlowSlow{animation:pgGlowSlow 3s ease-in-out infinite}'
  +'.pgup.a-pgFade,.pgdown.a-pgFade{animation:pgFade 2s ease-in-out infinite}'
  +'.pgup.a-pgFadeInOut,.pgdown.a-pgFadeInOut{animation:pgFadeInOut 3s ease-in-out infinite}'
  +'.pgup.a-pgBreath,.pgdown.a-pgBreath{animation:pgBreath 3s ease-in-out infinite}'
  +'.pgup.a-pgBlink,.pgdown.a-pgBlink{animation:pgBlink 1.6s ease-in-out infinite}'
  +'.pgup.a-pgBlinkWave,.pgdown.a-pgBlinkWave{animation:pgBlinkWave 2.4s ease-in-out infinite}'
  +'.pgup.a-pgFastPulse,.pgdown.a-pgFastPulse{animation:pgFastPulse 1.2s ease-in-out infinite}'
  +'.pgup.a-pgSpin,.pgdown.a-pgSpin{animation:pgSpin 3s ease-in-out infinite}';
  document.head.appendChild(st);
})();

/* ===== Открытие галереи =====
   Строит сетку 2 в ряд. Каждая ячейка — номер, название, верхняя
   и нижняя стрелки в игровой рамке. Все анимации проигрываются
   постоянно. Кликов нет — это витрина. */
function openPointerGallery(){
  let ov=document.getElementById('pointergallery');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='pointergallery';
    ov.innerHTML='<div class="invbox" style="max-width:820px">'
      +'<h3>Ограничитель текста — 50 вариантов</h3>'
      +'<div class="hint">Просмотр. Каждый вариант под своим номером.<div class="hgap"></div>Все указатели анимированы постоянно.</div>'
      +'<div class="pgrid" id="pggrid"></div>'
      +'<div style="text-align:center;margin-top:14px"><button class="btn" id="pgclose">Закрыть</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#pgclose').addEventListener('click',function(){ov.classList.add('hidden');});
    const g=ov.querySelector('#pggrid');
    PAIRS.forEach(function(p){
      const cell=document.createElement('div');
      cell.className='pgcell';
      cell.innerHTML='<div class="pghead">№ '+p.n+'</div>'
        +'<div class="pgname">'+p.name+'</div>'
        +'<div class="pgstrip">'
        +'<div class="pgup a-'+p.anim+'">'+p.up+'</div>'
        +'<div class="pgdown a-'+p.anim+'">'+p.down+'</div>'
        +'</div>';
      g.appendChild(cell);
    });
  }
  ov.classList.remove('hidden');
}

window.openPointerGallery=openPointerGallery;
})();