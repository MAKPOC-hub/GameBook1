// backicons_gallery.js
// v2.0.0
// Проект: GameBook1
// Функция: галерея из 20 вариантов кнопки «Шаг назад» — в стиле средневековой таверны
// Изменение: полностью переработано. Все 20 вариантов теперь — таверненные указатели:
// дубовые вывески на железных скобах, кованые стрелы, кружки эля, бочки, фонари,
// виноградные лозы, ключи, колосья, подковы, рога для питья, каменные межевые камни,
// медные таблички, верёвочные узлы, свечи, оленьи рога, мечи, корзины хлеба, пергаменты.
// Цветовая палитра: старое дерево, кованое железо, состаренная медь, пергамент.
(function(){
'use strict';

/* ===== Общие defs: материалы средневековой таверны =====
Старое дерево (тёсаный дуб), кованое железо (чёрное, с патиной),
состаренная медь, пергамент. Один набор defs на все 20 иконок. */
const TAVERN_DEFS='<svg width="0" height="0" style="position:absolute"><defs>'
+'<linearGradient id="tbOakG" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0" stop-color="#7a5a38"/>'
+'<stop offset="0.5" stop-color="#5b3a20"/>'
+'<stop offset="1" stop-color="#3a2410"/>'
+'</linearGradient>'
+'<linearGradient id="tbIronG" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0" stop-color="#4a4a4a"/>'
+'<stop offset="0.5" stop-color="#2a2a2a"/>'
+'<stop offset="1" stop-color="#141414"/>'
+'</linearGradient>'
+'<linearGradient id="tbBrassG" x1="0" y1="0" x2="1" y2="1">'
+'<stop offset="0" stop-color="#c9a24a"/>'
+'<stop offset="0.5" stop-color="#8a6a20"/>'
+'<stop offset="1" stop-color="#5a4018"/>'
+'</linearGradient>'
+'<linearGradient id="tbParchG" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0" stop-color="#e8d5a8"/>'
+'<stop offset="1" stop-color="#b89868"/>'
+'</linearGradient>'
+'<linearGradient id="tbAleG" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0" stop-color="#e8c76a"/>'
+'<stop offset="0.4" stop-color="#c99a2a"/>'
+'<stop offset="1" stop-color="#6a4a10"/>'
+'</linearGradient>'
+'<linearGradient id="tbStoneG" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0" stop-color="#8a8a84"/>'
+'<stop offset="1" stop-color="#4a4a44"/>'
+'</linearGradient>'
+'</defs></svg>';

/* ===== 20 вариантов таверенного указателя «назад» =====
Каждый — SVG 32×32, стиль средневековой таверны. Все стрелки указывают влево
(назад), но обёрнуты в разный таверенный антураж. */
const VARIANTS=[
/* 1. Дубовая вывеска на железной скобе */
{n:'Дубовая вывеска',svg:
'<path d="M16 4 Q18 2 20 4 L20 8" fill="none" stroke="url(#tbIronG)" stroke-width="1.5" stroke-linecap="round"/>'
+'<rect x="4" y="8" width="24" height="16" rx="1" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.8"/>'
+'<circle cx="7" cy="11" r="0.8" fill="#2a1808"/>'
+'<circle cx="25" cy="11" r="0.8" fill="#2a1808"/>'
+'<circle cx="7" cy="21" r="0.8" fill="#2a1808"/>'
+'<circle cx="25" cy="21" r="0.8" fill="#2a1808"/>'
+'<path d="M18 16 L8 16 L12 12 M8 16 L12 20" fill="none" stroke="#1a0e06" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
},
/* 2. Кованая стрела с завитками */
{n:'Кованая стрела',svg:
'<path d="M26 16 L6 16" stroke="url(#tbIronG)" stroke-width="2.2" stroke-linecap="round"/>'
+'<path d="M6 16 L12 10 M6 16 L12 22" stroke="url(#tbIronG)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="M26 16 Q28 12 26 10 Q24 12 26 16 Q28 20 26 22 Q24 20 26 16" fill="none" stroke="url(#tbIronG)" stroke-width="1.2" stroke-linecap="round"/>'
+'<circle cx="26" cy="16" r="1.5" fill="url(#tbIronG)"/>'
},
/* 3. Кружка эля с вырезанной стрелкой */
{n:'Кружка эля',svg:
'<path d="M8 8 L8 24 Q8 26 10 26 L20 26 Q22 26 22 24 L22 8 Z" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.8"/>'
+'<path d="M22 12 Q26 12 26 16 Q26 20 22 20" fill="none" stroke="url(#tbOakG)" stroke-width="2" stroke-linecap="round"/>'
+'<ellipse cx="15" cy="8" rx="7" ry="2" fill="#f0e2c4" opacity="0.9"/>'
+'<rect x="10" y="14" width="10" height="8" rx="0.5" fill="url(#tbAleG)" opacity="0.7"/>'
+'<path d="M16 18 L11 18 L13 16 M11 18 L13 20" stroke="#2a1808" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 4. Бочка с прибитой доской-указателем */
{n:'Бочка',svg:
'<ellipse cx="16" cy="6" rx="8" ry="2.5" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.6"/>'
+'<path d="M8 6 L8 26 Q8 28.5 16 28.5 Q24 28.5 24 26 L24 6" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.8"/>'
+'<path d="M8 10 Q16 12 24 10" fill="none" stroke="#2a1808" stroke-width="0.8"/>'
+'<path d="M8 22 Q16 24 24 22" fill="none" stroke="#2a1808" stroke-width="0.8"/>'
+'<rect x="2" y="14" width="14" height="4" rx="0.5" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.5"/>'
+'<path d="M12 16 L5 16 L7 14.5 M5 16 L7 17.5" stroke="#1a0e06" stroke-width="1" stroke-linecap="round" fill="none"/>'
+'<circle cx="3" cy="16" r="0.5" fill="#2a1808"/>'
},
/* 5. Таверенный фонарь со стрелкой */
{n:'Таверенный фонарь',svg:
'<path d="M16 2 L16 6" stroke="url(#tbIronG)" stroke-width="1.2" stroke-linecap="round"/>'
+'<path d="M12 6 L20 6 L22 10 L22 20 L20 24 L12 24 L10 20 L10 10 Z" fill="none" stroke="url(#tbIronG)" stroke-width="1.5" stroke-linejoin="round"/>'
+'<rect x="12" y="10" width="8" height="10" fill="url(#tbAleG)" opacity="0.4"/>'
+'<circle cx="16" cy="15" r="2" fill="#ffe9a0" opacity="0.9"/>'
+'<path d="M16 15 L6 15 L9 12 M6 15 L9 18" stroke="url(#tbIronG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 6. Виноградная лоза со стрелкой */
{n:'Виноградная лоза',svg:
'<path d="M28 14 Q20 14 14 14 L4 14" stroke="#5b3a20" stroke-width="1.5" stroke-linecap="round" fill="none"/>'
+'<path d="M4 14 L9 10 M4 14 L9 18" stroke="#5b3a20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<circle cx="20" cy="10" r="2" fill="#6a2a5a" stroke="#3a1838" stroke-width="0.4"/>'
+'<circle cx="24" cy="11" r="2" fill="#6a2a5a" stroke="#3a1838" stroke-width="0.4"/>'
+'<circle cx="22" cy="14" r="2" fill="#6a2a5a" stroke="#3a1838" stroke-width="0.4"/>'
+'<circle cx="18" cy="18" r="2" fill="#6a2a5a" stroke="#3a1838" stroke-width="0.4"/>'
+'<circle cx="22" cy="18" r="2" fill="#6a2a5a" stroke="#3a1838" stroke-width="0.4"/>'
+'<path d="M20 8 Q24 4 28 6 M18 16 Q14 20 16 24" stroke="#4a6a3a" stroke-width="0.8" fill="none"/>'
+'<ellipse cx="26" cy="5" rx="2" ry="1.5" fill="#5a7a3a" transform="rotate(-30 26 5)"/>'
},
/* 7. Старый железный ключ */
{n:'Таверенный ключ',svg:
'<circle cx="22" cy="16" r="5" fill="none" stroke="url(#tbIronG)" stroke-width="2"/>'
+'<circle cx="22" cy="16" r="2" fill="url(#tbIronG)"/>'
+'<rect x="6" y="14.5" width="16" height="3" fill="url(#tbIronG)"/>'
+'<path d="M6 16 L2 16 L5 13 M2 16 L5 19" fill="none" stroke="url(#tbIronG)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
+'<rect x="8" y="17.5" width="1.5" height="3" fill="url(#tbIronG)"/>'
+'<rect x="12" y="17.5" width="1.5" height="2" fill="url(#tbIronG)"/>'
},
/* 8. Сноп пшеницы со стрелкой */
{n:'Сноп пшеницы',svg:
'<path d="M20 6 L16 16 L20 26 M22 8 L18 16 L22 24 M24 10 L20 16 L24 22" stroke="#c9a24a" stroke-width="0.8" fill="none"/>'
+'<ellipse cx="20" cy="6" rx="1" ry="2" fill="#e8c76a" transform="rotate(-20 20 6)"/>'
+'<ellipse cx="22" cy="8" rx="1" ry="2" fill="#e8c76a" transform="rotate(-10 22 8)"/>'
+'<ellipse cx="24" cy="10" rx="1" ry="2" fill="#e8c76a"/>'
+'<ellipse cx="24" cy="22" rx="1" ry="2" fill="#e8c76a"/>'
+'<ellipse cx="22" cy="24" rx="1" ry="2" fill="#e8c76a" transform="rotate(10 22 24)"/>'
+'<ellipse cx="20" cy="26" rx="1" ry="2" fill="#e8c76a" transform="rotate(20 20 26)"/>'
+'<path d="M18 14 Q16 16 18 18" stroke="#8a6a20" stroke-width="1.5" fill="none"/>'
+'<path d="M18 16 L4 16 L8 12 M4 16 L8 20" stroke="url(#tbOakG)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 9. Кованая скоба-указатель */
{n:'Кованая скоба',svg:
'<path d="M28 6 L28 26" stroke="url(#tbIronG)" stroke-width="2.5" stroke-linecap="round"/>'
+'<circle cx="28" cy="6" r="1.5" fill="url(#tbIronG)"/>'
+'<circle cx="28" cy="26" r="1.5" fill="url(#tbIronG)"/>'
+'<path d="M28 16 Q22 16 18 16 L6 16" stroke="url(#tbIronG)" stroke-width="2" stroke-linecap="round" fill="none"/>'
+'<path d="M6 16 L11 11 M6 16 L11 21" stroke="url(#tbIronG)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<path d="M24 12 Q22 14 24 16 Q22 18 24 20" stroke="url(#tbIronG)" stroke-width="1" fill="none" stroke-linecap="round"/>'
},
/* 10. Деревянный щит таверны */
{n:'Щит таверны',svg:
'<path d="M16 4 L26 8 L26 18 Q26 26 16 28 Q6 26 6 18 L6 8 Z" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="1"/>'
+'<path d="M16 6 L24 9 L24 18 Q24 24 16 26 Q8 24 8 18 L8 9 Z" fill="none" stroke="#8a6a20" stroke-width="0.6"/>'
+'<path d="M20 16 L10 16 L14 12 M10 16 L14 20" stroke="#2a1808" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<circle cx="16" cy="8" r="0.8" fill="#c9a24a"/>'
},
/* 11. Подкова со стрелкой */
{n:'Подкова',svg:
'<path d="M10 24 Q4 18 4 12 Q4 6 10 6 Q16 6 16 12 Q16 14 15 16" fill="none" stroke="url(#tbIronG)" stroke-width="2.5" stroke-linecap="round"/>'
+'<path d="M22 24 Q28 18 28 12 Q28 6 22 6 Q18 6 17 10" fill="none" stroke="url(#tbIronG)" stroke-width="2.5" stroke-linecap="round"/>'
+'<circle cx="10" cy="24" r="1" fill="url(#tbIronG)"/>'
+'<circle cx="22" cy="24" r="1" fill="url(#tbIronG)"/>'
+'<circle cx="7" cy="10" r="0.6" fill="#2a1808"/>'
+'<circle cx="25" cy="10" r="0.6" fill="#2a1808"/>'
+'<path d="M16 16 L4 16 L8 12 M4 16 L8 20" stroke="url(#tbIronG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 12. Рог для питья */
{n:'Рог для питья',svg:
'<path d="M26 8 Q28 12 26 18 Q22 26 14 28 Q10 28 8 26" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.8"/>'
+'<ellipse cx="26" cy="11" rx="2.5" ry="4" fill="#8a6a20" stroke="#2a1808" stroke-width="0.6"/>'
+'<ellipse cx="26" cy="11" rx="1.5" ry="3" fill="#1a0e06"/>'
+'<path d="M14 28 L4 28 L8 24 M4 28 L8 32" stroke="url(#tbOakG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<path d="M20 14 Q18 18 14 22" stroke="#8a6a20" stroke-width="0.6" fill="none"/>'
},
/* 13. Каменный межевой камень */
{n:'Межевой камень',svg:
'<path d="M12 28 L10 10 Q10 6 16 4 Q22 6 22 10 L20 28 Z" fill="url(#tbStoneG)" stroke="#2a2a24" stroke-width="0.8"/>'
+'<path d="M12 28 L20 28" stroke="#2a2a24" stroke-width="1"/>'
+'<path d="M18 16 L10 16 L13 13 M10 16 L13 19" stroke="#2a2a24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<circle cx="16" cy="10" r="1" fill="#4a4a44"/>'
+'<path d="M14 22 L18 22 M15 24 L17 24" stroke="#4a4a44" stroke-width="0.5"/>'
},
/* 14. Медная табличка */
{n:'Медная табличка',svg:
'<rect x="4" y="8" width="24" height="16" rx="1" fill="url(#tbBrassG)" stroke="#3a2a10" stroke-width="0.8"/>'
+'<circle cx="7" cy="11" r="0.8" fill="#3a2a10"/>'
+'<circle cx="25" cy="11" r="0.8" fill="#3a2a10"/>'
+'<circle cx="7" cy="21" r="0.8" fill="#3a2a10"/>'
+'<circle cx="25" cy="21" r="0.8" fill="#3a2a10"/>'
+'<path d="M18 16 L8 16 L12 12 M8 16 L12 20" stroke="#2a1808" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<path d="M6 8 L6 6 M26 8 L26 6" stroke="url(#tbIronG)" stroke-width="0.8"/>'
},
/* 15. Верёвочный узел со стрелкой */
{n:'Верёвочный узел',svg:
'<path d="M26 14 Q22 14 20 14 Q18 14 18 16 Q18 18 20 18 Q22 18 24 16" fill="none" stroke="#8a6a3a" stroke-width="2" stroke-linecap="round"/>'
+'<path d="M24 16 Q26 18 24 20 Q22 20 20 18" fill="none" stroke="#8a6a3a" stroke-width="2" stroke-linecap="round"/>'
+'<path d="M20 16 L6 16" stroke="#8a6a3a" stroke-width="2" stroke-linecap="round"/>'
+'<path d="M6 16 L10 12 M6 16 L10 20" stroke="#8a6a3a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<path d="M26 14 L28 10 M24 20 L26 24" stroke="#8a6a3a" stroke-width="1.5" stroke-linecap="round"/>'
},
/* 16. Свеча в подсвечнике */
{n:'Свеча',svg:
'<rect x="14" y="6" width="4" height="10" rx="0.5" fill="#e8d5a8" stroke="#8a6a20" stroke-width="0.4"/>'
+'<path d="M16 4 Q15 5 16 6 Q17 5 16 4 Z" fill="#ff9a3a"/>'
+'<circle cx="16" cy="3" r="1" fill="#ffd23f" opacity="0.6"/>'
+'<path d="M10 16 L22 16 L22 18 L20 20 L20 24 L12 24 L12 20 L10 18 Z" fill="url(#tbBrassG)" stroke="#3a2a10" stroke-width="0.6"/>'
+'<path d="M10 22 L2 22 L5 19 M2 22 L5 25" stroke="url(#tbBrassG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 17. Оленьи рога */
{n:'Оленьи рога',svg:
'<path d="M16 24 L16 14" stroke="url(#tbOakG)" stroke-width="2" stroke-linecap="round"/>'
+'<path d="M16 14 Q12 10 10 6 Q9 4 8 3" stroke="url(#tbOakG)" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
+'<path d="M16 14 Q20 10 22 6 Q23 4 24 3" stroke="url(#tbOakG)" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
+'<path d="M12 10 L9 9 M11 8 L8 7" stroke="url(#tbOakG)" stroke-width="1.2" stroke-linecap="round"/>'
+'<path d="M20 10 L23 9 M21 8 L24 7" stroke="url(#tbOakG)" stroke-width="1.2" stroke-linecap="round"/>'
+'<path d="M16 20 L6 20 L10 16 M6 20 L10 24" stroke="url(#tbOakG)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 18. Меч в ножнах (таверна искателей приключений) */
{n:'Меч странника',svg:
'<path d="M26 6 L28 8 L10 26 L8 24 Z" fill="url(#tbIronG)" stroke="#141414" stroke-width="0.5"/>'
+'<path d="M8 24 L6 26 L8 28 L10 26 Z" fill="url(#tbBrassG)" stroke="#3a2a10" stroke-width="0.4"/>'
+'<rect x="24" y="4" width="5" height="2" rx="0.5" fill="url(#tbBrassG)" stroke="#3a2a10" stroke-width="0.3" transform="rotate(-45 26 5)"/>'
+'<path d="M26 6 L28 4" stroke="url(#tbIronG)" stroke-width="1" stroke-linecap="round"/>'
+'<path d="M14 20 L4 20 L7 17 M4 20 L7 23" stroke="url(#tbIronG)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 19. Корзина хлеба */
{n:'Корзина хлеба',svg:
'<path d="M6 14 L26 14 L24 24 L8 24 Z" fill="url(#tbOakG)" stroke="#2a1808" stroke-width="0.8"/>'
+'<path d="M6 14 Q16 12 26 14" fill="none" stroke="#2a1808" stroke-width="0.6"/>'
+'<path d="M8 18 L24 18 M9 22 L23 22" stroke="#2a1808" stroke-width="0.4"/>'
+'<ellipse cx="12" cy="12" rx="3" ry="2.5" fill="#d9a636" stroke="#8a6a20" stroke-width="0.4"/>'
+'<ellipse cx="18" cy="11" rx="3.5" ry="3" fill="#e8c76a" stroke="#8a6a20" stroke-width="0.4"/>'
+'<ellipse cx="22" cy="13" rx="2.5" ry="2" fill="#c99a2a" stroke="#8a6a20" stroke-width="0.4"/>'
+'<path d="M12 19 L4 19 L7 16 M4 19 L7 22" stroke="url(#tbOakG)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
},
/* 20. Пергаментный свиток */
{n:'Пергамент',svg:
'<ellipse cx="6" cy="16" rx="2.5" ry="8" fill="url(#tbParchG)" stroke="#8a6a20" stroke-width="0.6"/>'
+'<ellipse cx="26" cy="16" rx="2.5" ry="8" fill="url(#tbParchG)" stroke="#8a6a20" stroke-width="0.6"/>'
+'<rect x="6" y="8" width="20" height="16" fill="url(#tbParchG)" stroke="#8a6a20" stroke-width="0.5"/>'
+'<path d="M8 12 L24 12 M8 14 L20 14 M8 20 L24 20" stroke="#8a6a20" stroke-width="0.3" opacity="0.5"/>'
+'<path d="M18 17 L8 17 L11 14 M8 17 L11 20" stroke="#5a4018" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
+'<circle cx="25" cy="22" r="1.5" fill="#8a2a1a" stroke="#5a1010" stroke-width="0.3"/>'
}
];

/* ===== Инжект стилей галереи ===== */
(function _injectStyles(){
if(document.getElementById('zl-backgallery-styles'))return;
const st=document.createElement('style');
st.id='zl-backgallery-styles';
st.textContent=
'.bggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px;margin-top:12px}'
+'.bgcell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border:2px solid rgba(122,90,56,.55);border-radius:10px;background:rgba(0,0,0,.22);cursor:default;transition:transform .15s}'
+'.bgcell:hover{transform:translateY(-2px);border-color:#b8d494}'
+'.bgcell svg{width:44px;height:44px;display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55))}'
+'.bgname{font-size:11.5px;color:#e8dcbe;text-shadow:0 1px 2px #000;text-align:center;line-height:1.2}';
document.head.appendChild(st);
})();

/* ===== Открытие галереи ===== */
function openBackGallery(){
let ov=document.getElementById('backgallery');
if(!ov){
ov=document.createElement('div');
ov.className='ovl hidden';ov.id='backgallery';
ov.innerHTML='<div class="invbox" style="max-width:560px">'
+'<h3>Таверенный указатель</h3>'
+'<div class="hint">Двадцать указателей в стиле средневековой таверны.<div class="hgap"></div>Выбор пока не сохраняется — только просмотр.</div>'
+TAVERN_DEFS
+'<div class="bggrid" id="bggrid"></div>'
+'<div style="text-align:center;margin-top:14px"><button class="btn" id="bgclose">Закрыть</button></div>'
+'</div>';
document.body.appendChild(ov);
ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
ov.querySelector('#bgclose').addEventListener('click',function(){ov.classList.add('hidden');});
}
const g=ov.querySelector('#bggrid');
if(g&&!g.dataset.built){
g.dataset.built='1';
VARIANTS.forEach(function(v,i){
const cell=document.createElement('div');
cell.className='bgcell';
cell.innerHTML='<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+v.svg+'</svg>'
+'<div class="bgname">'+(i+1)+'. '+v.n+'</div>';
g.appendChild(cell);
});
}
ov.classList.remove('hidden');
}
window.openBackGallery=openBackGallery;
})();