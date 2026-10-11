// backicons_gallery.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: галерея из 20 вариантов иконки «Шаг назад» — рука-указатель с хвостом, направленным вверх (как у пера, но наоборот)
// Изменение: все 20 вариантов перерисованы по одной базовой форме — рука-указатель с наконечником стрелки слева, прямоугольным основанием и изогнутым хвостом, уходящим вверх. Варианты различаются фактурой (дерево, железо, латунь, кость, кожа, рог) и мелкими деталями (прожилки, сучки, гвозди, руны, крестик, кольцо, обмотка)

(function(){
'use strict';

/* ===== Общие градиенты =====
   Один SVG с defs, вставленный в оверлей. Все иконки ссылаются на эти
   градиенты через url(#…). Так компактнее, чем дублировать их в каждой
   иконке. */
const DEFS='<svg width="0" height="0" style="position:absolute"><defs>'
  +'<linearGradient id="backWoodG" x1="0" y1="0" x2="0" y2="1">'
  +'<stop offset="0" stop-color="#c9a06a"/>'
  +'<stop offset="0.5" stop-color="#9a6a3a"/>'
  +'<stop offset="1" stop-color="#6b4520"/>'
  +'</linearGradient>'
  +'<linearGradient id="backIronG" x1="0" y1="0" x2="0" y2="1">'
  +'<stop offset="0" stop-color="#7a7a80"/>'
  +'<stop offset="0.5" stop-color="#4a4a4e"/>'
  +'<stop offset="1" stop-color="#2a2a2e"/>'
  +'</linearGradient>'
  +'<linearGradient id="backBrassG" x1="0" y1="0" x2="0" y2="1">'
  +'<stop offset="0" stop-color="#e8c76a"/>'
  +'<stop offset="0.5" stop-color="#b8924a"/>'
  +'<stop offset="1" stop-color="#7a5a20"/>'
  +'</linearGradient>'
  +'</defs></svg>';

/* ===== Базовая форма руки-указателя с хвостом вверх =====
   Наконечник стрелки слева (точка 3,16), прямоугольное основание
   от 11 до 20 по горизонтали, изогнутый хвост уходит вверх, кончик —
   в районе (30,6). Все 20 вариантов используют эту форму. */
const BASE_PATH='M11 8 L3 16 L11 24 L11 20 L20 20 Q26 20 28 8 L30 6 Q26 10 20 12 L11 12 Z';

const VARIANTS=[

/* 1. Дерево — классика */
{n:'Классика',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/>'},

/* 2. Тонкая — узкое основание, хвост длиннее */
{n:'Тонкая',svg:'<path d="M12 10 L5 16 L12 22 L12 19 L20 19 Q25 19 28 6 L30 4 Q26 8 20 11 L12 11 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.2" stroke-linejoin="round"/>'},

/* 3. Широкая — основание толще, хвост короче */
{n:'Широкая',svg:'<path d="M10 7 L2 16 L10 25 L10 20 L20 20 Q24 20 25 12 L26 10 Q24 12 20 14 L10 14 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.6" stroke-linejoin="round"/>'},

/* 4. С прожилками — тонкие линии вдоль хвоста */
{n:'С прожилками',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 20 Q25 19 27 12 M20 18 Q24 17 26 12 M21 16 Q24 15 25 13" stroke="#2a1a0c" stroke-width="0.5" fill="none" opacity="0.55"/>'},

/* 5. С сучками — крупные и мелкие кружки на хвосте */
{n:'С сучками',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><circle cx="24" cy="14" r="1.2" fill="#2a1a0c" opacity="0.5"/><circle cx="17" cy="17" r="0.8" fill="#2a1a0c" opacity="0.45"/><circle cx="27" cy="10" r="0.6" fill="#2a1a0c" opacity="0.4"/>'},

/* 6. Кованое железо — тёмный металл с заклёпками */
{n:'Кованое',svg:'<path d="'+BASE_PATH+'" fill="url(#backIronG)" stroke="#0a0806" stroke-width="1.5" stroke-linejoin="round"/><circle cx="15" cy="16" r="0.9" fill="#0a0806"/><circle cx="19" cy="16" r="0.9" fill="#0a0806"/><circle cx="23" cy="15" r="0.9" fill="#0a0806"/>'},

/* 7. Латунь — золотистый сплав с прорезью */
{n:'Латунь',svg:'<path d="'+BASE_PATH+'" fill="url(#backBrassG)" stroke="#3a2810" stroke-width="1.4" stroke-linejoin="round"/><path d="M15 16 L25 16" stroke="#5a3a10" stroke-width="0.5" opacity="0.5"/>'},

/* 8. Кость — светлая с трещинами */
{n:'Кость',svg:'<path d="'+BASE_PATH+'" fill="#e8dcc0" stroke="#5a4a30" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 13 L16 19 M20 13 L20 19" stroke="#5a4a30" stroke-width="0.5" opacity="0.5"/><path d="M22 18 Q24 16 25 13" stroke="#5a4a30" stroke-width="0.5" opacity="0.5" fill="none"/>'},

/* 9. Кожа — тёмно-коричневая с металлическими заклёпками */
{n:'Кожа',svg:'<path d="M11 9 L4 16 L11 23 L11 20 L20 20 Q26 20 28 8 L29 7 Q26 10 20 12 L11 12 Z" fill="#6b4a2a" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><circle cx="15" cy="16" r="0.7" fill="#d9b888" opacity="0.75"/><circle cx="19" cy="15" r="0.7" fill="#d9b888" opacity="0.75"/><circle cx="23" cy="14" r="0.7" fill="#d9b888" opacity="0.75"/>'},

/* 10. Рог — тёмный с продольными насечками */
{n:'Рог',svg:'<path d="M12 9 L4 16 L12 23 L12 20 L20 20 Q25 20 27 9 L29 8 Q25 12 20 13 L12 13 Z" fill="#3a2818" stroke="#1a1008" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 13 L16 19 M20 13 L20 19" stroke="#7a5a3a" stroke-width="0.4" opacity="0.55"/>'},

/* 11. С кольцом — декоративное кольцо в хвосте */
{n:'С кольцом',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.4" stroke-linejoin="round"/><circle cx="24" cy="14" r="2" fill="none" stroke="#3a2410" stroke-width="1.2"/>'},

/* 12. С гвоздиками — по углам основания прибиты гвозди */
{n:'С гвоздиками',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><circle cx="13" cy="11" r="0.7" fill="#4a4a4e"/><circle cx="13" cy="21" r="0.7" fill="#4a4a4e"/><circle cx="20" cy="11" r="0.7" fill="#4a4a4e"/><circle cx="20" cy="21" r="0.7" fill="#4a4a4e"/>'},

/* 13. С прорезью — вертикальный разрез в хвосте */
{n:'С прорезью',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><path d="M23 18 L27 10" stroke="#2a1a0c" stroke-width="1.2" opacity="0.75"/>'},

/* 14. С загнутым кончиком — острие хвоста загибается внутрь */
{n:'С загнутым',svg:'<path d="M11 8 L3 16 L11 24 L11 20 L20 20 Q26 20 27 11 Q28 7 25 7 Q23 7 24 10 Q25 12 23 13 L20 13 L11 13 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.4" stroke-linejoin="round"/>'},

/* 15. С крестиком — крестик у основания */
{n:'С крестиком',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 13 L18 19 M18 13 L14 19" stroke="#2a1a0c" stroke-width="0.9" opacity="0.75" fill="none"/>'},

/* 16. С рунами — три вертикальные насечки */
{n:'С рунами',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 11 L13 21 M16 11 L16 21 M19 11 L19 21" stroke="#2a1a0c" stroke-width="0.6" opacity="0.65"/>'},

/* 17. Пламевидный хвост — волнистый край */
{n:'Пламя',svg:'<path d="M11 8 L3 16 L11 24 L11 20 L20 20 Q24 20 25 14 Q25 9 29 5 L30 8 Q27 11 27 15 Q27 21 22 22 L11 22 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.4" stroke-linejoin="round"/>'},

/* 18. С точкой — крупная точка на указательном пальце */
{n:'С точкой',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><circle cx="16" cy="16" r="1.5" fill="#2a1a0c"/>'},

/* 19. С заклёпкой — металлическая заклёпка в основании */
{n:'С заклёпкой',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><circle cx="16" cy="16" r="2" fill="#7a7a80" stroke="#2a2a2e" stroke-width="0.6"/>'},

/* 20. С обмоткой — основание обмотано ремешками */
{n:'С обмоткой',svg:'<path d="'+BASE_PATH+'" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 12 L12 20 M14 12 L14 20 M16 12 L16 20" stroke="#2a1a0c" stroke-width="0.6" opacity="0.65"/>'}
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
      +'<div class="hint">Двадцать вариантов руки-указателя с хвостом вверх.<div class="hgap"></div>Выбор пока не сохраняется — только просмотр.</div>'
      +DEFS
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