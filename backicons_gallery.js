// backicons_gallery.js
// v1.0.0
// Проект: GameBook1
// Функция: галерея из 20 вариантов иконки «Шаг назад» в деревянном стиле — для выбора оформления кнопки
// Изменение: файл создан. Галерея открывается кнопкой «Шаг назад» в верхней панели. Пока выбор не сохраняется, это витрина. Когда функция отката вернётся, добавим кнопку «Выбрать» в каждой плитке

(function(){
'use strict';

/* ===== Общий деревянный градиент =====
   Один SVG с defs, вставленный в оверлей. Все иконки ссылаются на него
   через url(#backWoodG). Это компактнее, чем дублировать градиент в каждой
   иконке. */
const WOOD_DEFS='<svg width="0" height="0" style="position:absolute"><defs>'
  +'<linearGradient id="backWoodG" x1="0" y1="0" x2="0" y2="1">'
  +'<stop offset="0" stop-color="#c9a06a"/>'
  +'<stop offset="0.5" stop-color="#9a6a3a"/>'
  +'<stop offset="1" stop-color="#6b4520"/>'
  +'</linearGradient>'
  +'</defs></svg>';

/* ===== 20 вариантов иконки =====
   Каждая — SVG с viewBox 0 0 32 32. Обводка #3a2410, заливка — общий
   деревянный градиент. Разная форма: от простой стрелки до компаса. */
const VARIANTS=[
{n:'Классика',svg:'<path d="M11 8 L3 16 L11 24 L11 19 L25 19 L25 13 L11 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/>'},
{n:'Тонкая',svg:'<path d="M13 10 L5 16 L13 22 L13 18 L25 18 L25 14 L13 14 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/>'},
{n:'Загиб',svg:'<path d="M10 8 L2 16 L10 24 L10 19 L22 19 L22 26 L28 26 L28 17 Q28 13 24 13 L10 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/>'},
{n:'Крюк',svg:'<path d="M11 8 L3 16 L11 24 L11 19 L22 19 L22 22 Q22 26 26 26 L26 22 Q24 22 24 20 L24 13 L11 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/>'},
{n:'Резьба',svg:'<path d="M11 8 L3 16 L11 24 L11 19 L25 19 L25 13 L11 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 15 L24 15 M13 17 L24 17" stroke="#3a2410" stroke-width="0.6" opacity="0.55" fill="none"/>'},
{n:'Дуга',svg:'<path d="M6 10 Q6 22 18 22 L18 26 L26 20 L18 14 L18 18 Q11 18 11 10 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/>'},
{n:'Двойная',svg:'<path d="M11 8 L3 16 L11 24 L11 19 L14 19 L14 13 L11 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/><path d="M22 8 L14 16 L22 24 L22 19 L25 19 L25 13 L22 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/>'},
{n:'Тройная',svg:'<path d="M9 9 L3 16 L9 23 L9 19 L11 19 L11 13 L9 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/><path d="M17 9 L11 16 L17 23 L17 19 L19 19 L19 13 L17 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/><path d="M25 9 L19 16 L25 23 L25 19 L27 19 L27 13 L25 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/>'},
{n:'Кольцо',svg:'<circle cx="16" cy="16" r="13" fill="none" stroke="#3a2410" stroke-width="1.8"/><path d="M12 11 L6 16 L12 21 L12 18 L23 18 L23 14 L12 14 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/>'},
{n:'Ромб',svg:'<path d="M16 2 L30 16 L16 30 L2 16 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 11 L7 16 L12 21 L12 18 L21 18 L21 14 L12 14 Z" fill="#3a2410" opacity="0.75"/>'},
{n:'Завиток',svg:'<path d="M11 8 L3 16 L11 24 L11 19 L20 19 Q24 19 24 14 Q24 8 18 8 L14 8 L14 12 L18 12 Q20 12 20 14 Q20 15 18 15 L11 15 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/>'},
{n:'Ветка',svg:'<path d="M14 10 L6 16 L14 22 L14 18 L26 18 L26 14 L14 14 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.3" stroke-linejoin="round"/><ellipse cx="23" cy="8" rx="5" ry="3" fill="#6b8a4a" stroke="#3a2410" stroke-width="1" transform="rotate(-30 23 8)"/>'},
{n:'Стрела',svg:'<path d="M3 16 L11 10 L11 14 L26 14 L26 18 L11 18 L11 22 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.4" stroke-linejoin="round"/><path d="M26 10 L30 13 L26 16 M26 16 L30 19 L26 22" fill="none" stroke="#3a2410" stroke-width="1.2" stroke-linecap="round"/>'},
{n:'Щит',svg:'<path d="M16 3 Q25 4 25 12 Q25 22 16 28 Q7 22 7 12 Q7 4 16 3 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 12 L9 16 L13 20 L13 18 L21 18 L21 14 L13 14 Z" fill="#3a2410" opacity="0.75"/>'},
{n:'Свиток',svg:'<rect x="5" y="8" width="22" height="16" rx="3" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5"/><path d="M11 13 L8 16 L11 19 L11 18 L21 18 L21 14 L11 14 Z" fill="#3a2410" opacity="0.75"/>'},
{n:'Полумесяц',svg:'<path d="M16 4 Q26 8 26 16 Q26 24 16 28 Q22 22 22 16 Q22 10 16 4 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 12 L6 16 L10 20 L10 18 L16 18 L16 14 L10 14 Z" fill="#3a2410" opacity="0.85"/>'},
{n:'С точками',svg:'<path d="M11 8 L3 16 L11 24 L11 19 L25 19 L25 13 L11 13 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="16" r="1.1" fill="#3a2410"/><circle cx="23" cy="16" r="1.1" fill="#3a2410"/>'},
{n:'Клинок',svg:'<path d="M3 16 L11 8 L11 14 L26 14 Q28 14 28 16 Q28 18 26 18 L11 18 L11 24 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round"/><path d="M11 14 L11 18" stroke="#3a2410" stroke-width="0.6" opacity="0.5"/>'},
{n:'Три полосы',svg:'<rect x="4" y="13" width="16" height="6" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1"/><path d="M20 9 L28 16 L20 23 Z" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.2" stroke-linejoin="round"/><path d="M6 15 L19 15 M6 17 L19 17" stroke="#3a2410" stroke-width="0.6" opacity="0.5" fill="none"/>'},
{n:'Компас',svg:'<circle cx="16" cy="16" r="13" fill="url(#backWoodG)" stroke="#3a2410" stroke-width="1.5"/><circle cx="16" cy="16" r="8" fill="none" stroke="#3a2410" stroke-width="0.7" opacity="0.55"/><path d="M19 16 L11 16 L11 12 L8 16 L11 20 L11 17 L19 17 Z" fill="#3a2410"/><path d="M16 6 L17.5 12 L16 13 L14.5 12 Z" fill="#3a2410" opacity="0.7"/>'}
];

/* ===== Инжект стилей галереи ===== */
(function _injectStyles(){
  if(document.getElementById('zl-backgallery-styles'))return;
  const st=document.createElement('style');
  st.id='zl-backgallery-styles';
  st.textContent=
  '.bggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px;margin-top:12px}'
  +'.bgcell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;border:2px solid rgba(122,90,56,.55);border-radius:10px;background:rgba(0,0,0,.22);cursor:default}'
  +'.bgcell svg{width:44px;height:44px;display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55))}'
  +'.bgname{font-size:11.5px;color:#e8dcbe;text-shadow:0 1px 2px #000;text-align:center;line-height:1.2}';
  document.head.appendChild(st);
})();

/* ===== Открытие галереи =====
   Собирает плитки, привязывает кнопку «Закрыть», показывает оверлей.
   ↙️ Вызывается из: engine_overlay_input.js (кнопка HUD #backb) */
function openBackGallery(){
  let ov=document.getElementById('backgallery');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='backgallery';
    ov.innerHTML='<div class="invbox" style="max-width:560px">'
      +'<h3>Стрелка «Шаг назад»</h3>'
      +'<div class="hint">Двадцать вариантов оформления.<div class="hgap"></div>Выбор пока не сохраняется — только просмотр.</div>'
      +WOOD_DEFS
      +'<div class="bggrid" id="bggrid"></div>'
      +'<div style="text-align:center;margin-top:14px"><button class="btn" id="bgclose">Закрыть</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#bgclose').addEventListener('click',function(){ov.classList.add('hidden');});
    const g=ov.querySelector('#bggrid');
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