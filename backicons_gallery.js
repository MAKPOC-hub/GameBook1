// backicons_gallery.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: галерея из 20 вариантов иконки «Шаг назад» в стиле средневековой таверны — для выбора оформления кнопки
// Изменение: все 20 вариантов перерисованы в стиле таверны. Используются деревянные вывески, кованое железо, латунь, воск, свечи, кружки, фляги, монеты — а не абстрактные стрелки. Каждый вариант читается как «назад», но выполнен как предмет, который мог бы висеть в трактире

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
  +'<radialGradient id="backWaxG" cx="35%" cy="30%" r="75%">'
  +'<stop offset="0" stop-color="#a8352a"/>'
  +'<stop offset="0.7" stop-color="#7a2018"/>'
  +'<stop offset="1" stop-color="#4a0e08"/>'
  +'</radialGradient>'
  +'</defs></svg>';

/* ===== 20 вариантов иконки =====
   Каждая — SVG с viewBox 0 0 32 32. Все выглядят как предметы трактира:
   деревянная доска, кованый указатель, свеча, кружка, фляга, монета,
   восковая печать и т. п. Внутри каждого предмета — стрелка «назад». */
const VARIANTS=[

/* 1. Грубая деревянная доска со стрелкой — самое простое */
{n:'Грубая доска',svg:
 '<path d="M11 8 L3 16 L11 24 L11 19 L27 19 L27 13 L11 13 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.6" stroke-linejoin="round"/>'
 +'<path d="M14 15 L24 15 M14 17 L22 17" stroke="#5b3a20" stroke-width="0.6" opacity="0.5" fill="none"/>'},

/* 2. Кованый железный указатель — кузнец выковал стрелку и заклепал её */
{n:'Кованое железо',svg:
 '<path d="M11 8 L3 16 L11 24 L11 19 L27 19 L27 13 L11 13 Z" fill="url(#backIronG)" stroke="#0a0806" stroke-width="1.5" stroke-linejoin="round"/>'
 +'<circle cx="14" cy="16" r="1" fill="#0a0806"/>'
 +'<circle cx="19" cy="16" r="1" fill="#0a0806"/>'
 +'<circle cx="24" cy="16" r="1" fill="#0a0806"/>'},

/* 3. Латунный указатель с прорезью — как дверная ручка или прибор */
{n:'Латунь',svg:
 '<path d="M11 8 L3 16 L11 24 L11 19 L27 19 L27 13 L11 13 Z" fill="url(#backBrassG)" stroke="#3a2810" stroke-width="1.5" stroke-linejoin="round"/>'
 +'<path d="M15 16 L25 16" stroke="#5a3a10" stroke-width="0.6" opacity="0.55" fill="none"/>'
 +'<circle cx="20" cy="16" r="1" fill="none" stroke="#5a3a10" stroke-width="0.7" opacity="0.7"/>'},

/* 4. Табличка с гвоздиками — вывеска, прибитая к стене */
{n:'Табличка',svg:
 '<rect x="2" y="8" width="28" height="16" rx="2" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5"/>'
 +'<path d="M14 12 L8 16 L14 20 L14 18 L25 18 L25 14 L14 14 Z" fill="#2a1a0c" opacity="0.85"/>'
 +'<circle cx="5" cy="11" r="0.9" fill="#2a1a0c"/>'
 +'<circle cx="27" cy="21" r="0.9" fill="#2a1a0c"/>'},

/* 5. Круглый медальон — как эмблема на стене трактира */
{n:'Медальон',svg:
 '<circle cx="16" cy="16" r="13" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5"/>'
 +'<circle cx="16" cy="16" r="10" fill="none" stroke="#2a1a0c" stroke-width="0.6" opacity="0.5"/>'
 +'<path d="M13 12 L8 16 L13 20 L13 18 L22 18 L22 14 L13 14 Z" fill="#2a1a0c"/>'},

/* 6. На цепи — вывеска, подвешенная к потолку */
{n:'На цепи',svg:
 '<circle cx="16" cy="3" r="1.6" fill="none" stroke="#3a2410" stroke-width="1"/>'
 +'<circle cx="16" cy="6" r="1.6" fill="none" stroke="#3a2410" stroke-width="1"/>'
 +'<path d="M16 8 L16 10" stroke="#3a2410" stroke-width="1"/>'
 +'<path d="M11 11 L3 18 L11 25 L11 21 L27 21 L27 15 L11 15 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/>'},

/* 7. С гвоздём — вывеска на одном гвозде, покачивается */
{n:'На гвозде',svg:
 '<circle cx="16" cy="3" r="2" fill="url(#backIronG)" stroke="#0a0806" stroke-width="1"/>'
 +'<path d="M16 5 L16 8" stroke="#3a2410" stroke-width="1.2"/>'
 +'<path d="M11 8 L3 16 L11 24 L11 19 L27 19 L27 13 L11 13 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/>'
 +'<circle cx="16" cy="8" r="1" fill="#0a0806"/>'},

/* 8. С подковой — на счастье и на возврат */
{n:'С подковой',svg:
 '<path d="M11 9 L4 16 L11 23 L11 19 L24 19 L24 22 Q24 26 28 26 L28 22 Q26 22 26 20 L26 13 L11 13 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/>'
 +'<circle cx="27" cy="24" r="0.7" fill="#0a0806"/>'
 +'<circle cx="25" cy="21" r="0.7" fill="#0a0806"/>'},

/* 9. Ключ-стрелка — ключ от задней двери трактира */
{n:'Ключ',svg:
 '<path d="M5 16 L11 10 L11 14 L26 14 Q30 14 30 16 Q30 18 26 18 L11 18 L11 22 Z" fill="url(#backBrassG)" stroke="#3a2810" stroke-width="1.4" stroke-linejoin="round"/>'
 +'<rect x="24" y="12" width="2" height="8" fill="#3a2810"/>'
 +'<rect x="27" y="13" width="2" height="2" fill="#3a2810"/>'},

/* 10. Перо — гусиное перо, которым писали в трактире счета */
{n:'Перо',svg:
 '<path d="M10 10 L4 16 L10 22 L10 18 L20 18 Q26 18 28 24 L30 22 Q26 12 20 12 L10 12 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.3" stroke-linejoin="round"/>'
 +'<path d="M12 13 L13 17 M15 13 L16 17" stroke="#2a1a0c" stroke-width="0.6" opacity="0.5"/>'},

/* 11. Кружка — пивная кружка, символ трактира */
{n:'Кружка',svg:
 '<path d="M6 10 L14 10 L14 24 L6 24 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.3"/>'
 +'<path d="M14 12 Q18 12 18 16 Q18 20 14 20" fill="none" stroke="#2a1a0c" stroke-width="1.3"/>'
 +'<path d="M9 13 L7 16 L9 19 L9 17.5 L13 17.5 L13 14.5 L9 14.5 Z" fill="#2a1a0c"/>'
 +'<path d="M6 10 Q10 7 14 10" stroke="#e8dcbe" stroke-width="1.2" fill="none" opacity="0.85"/>'},

/* 12. Свеча в фонаре — единственный свет в тёмном коридоре */
{n:'Фонарь',svg:
 '<rect x="9" y="6" width="14" height="22" rx="2" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5"/>'
 +'<path d="M16 3 L16 6 M14 3 L18 3" stroke="#0a0806" stroke-width="1.2"/>'
 +'<path d="M13 13 L10 16 L13 19 L13 17.5 L20 17.5 L20 14.5 L13 14.5 Z" fill="#e8a04a" opacity="0.95"/>'
 +'<path d="M16 9 Q17 11 16 13 Q15 11 16 9 Z" fill="#ffd23f" opacity="0.85"/>'},

/* 13. Фляга — дорожная фляга с вином или водой */
{n:'Фляга',svg:
 '<path d="M9 10 Q9 6 13 6 Q16 6 16 8 Q16 6 19 6 Q23 6 23 10 L23 24 Q23 28 16 28 Q9 28 9 24 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.4"/>'
 +'<path d="M16 6 L16 3" stroke="#3a2410" stroke-width="1.4" stroke-linecap="round"/>'
 +'<path d="M13 13 L10 16 L13 19 L13 17.5 L20 17.5 L20 14.5 L13 14.5 Z" fill="#2a1a0c"/>'},

/* 14. Монета — старинная монета, которой платят за ночлег */
{n:'Монета',svg:
 '<circle cx="16" cy="16" r="13" fill="url(#backBrassG)" stroke="#3a2810" stroke-width="1.5"/>'
 +'<circle cx="16" cy="16" r="10" fill="none" stroke="#3a2810" stroke-width="0.6" opacity="0.5"/>'
 +'<path d="M13 13 L9 16 L13 19 L13 17.5 L21 17.5 L21 14.5 L13 14.5 Z" fill="#3a2810"/>'
 +'<circle cx="22" cy="21" r="0.7" fill="#3a2810" opacity="0.6"/>'},

/* 15. Дверное кольцо — стучат в дверь, возвращаясь домой */
{n:'Кольцо',svg:
 '<circle cx="16" cy="20" r="10" fill="none" stroke="url(#backIronG)" stroke-width="2.4"/>'
 +'<circle cx="16" cy="20" r="7" fill="none" stroke="#0a0806" stroke-width="0.5" opacity="0.35"/>'
 +'<circle cx="16" cy="10" r="2.8" fill="url(#backIronG)" stroke="#0a0806" stroke-width="1"/>'
 +'<circle cx="16" cy="10" r="1" fill="#0a0806"/>'
 +'<path d="M13 18 L10 20 L13 22 L13 21 L20 21 L20 19 L13 19 Z" fill="#0a0806"/>'},

/* 16. Ветка — охапка травы, прибитая над входом */
{n:'Ветка',svg:
 '<path d="M10 10 Q4 16 10 22 L10 19 L20 19 Q28 19 28 12 L24 12 Q24 15 20 15 L10 15 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.4" stroke-linejoin="round"/>'
 +'<ellipse cx="22" cy="8" rx="4" ry="2.5" fill="#6b8a4a" stroke="#2a1a0c" stroke-width="0.9" transform="rotate(-20 22 8)"/>'
 +'<ellipse cx="26" cy="6" rx="3" ry="2" fill="#5a7a3a" stroke="#2a1a0c" stroke-width="0.7" transform="rotate(-40 26 6)"/>'},

/* 17. Приборы — вилка и ложка трактирного стола */
{n:'Приборы',svg:
 '<path d="M9 6 L9 14 M12 6 L12 14 M15 6 L15 14 M12 14 L12 26" stroke="url(#backIronG)" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
 +'<ellipse cx="23" cy="10" rx="3" ry="5" fill="url(#backIronG)" stroke="#0a0806" stroke-width="1"/>'
 +'<path d="M23 15 L23 26" stroke="url(#backIronG)" stroke-width="1.8" stroke-linecap="round"/>'
 +'<path d="M23 15 L23 26" stroke="#0a0806" stroke-width="0.6" stroke-linecap="round" opacity="0.4"/>'
 +'<path d="M21 20 L25 20" stroke="#3a2410" stroke-width="0.7" opacity="0.5"/>'},

/* 18. Рука-указатель — деревянная рука, которой указывали путь */
{n:'Рука-указатель',svg:
 '<path d="M11 8 L3 16 L11 24 L11 20 L27 20 L27 12 L11 12 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/>'
 +'<circle cx="17" cy="16" r="1.3" fill="#2a1a0c"/>'
 +'<path d="M21 12 L21 20 M24 13 L24 19" stroke="#2a1a0c" stroke-width="0.8" opacity="0.5"/>'
 +'<path d="M12 14 L12 18" stroke="#2a1a0c" stroke-width="0.6" opacity="0.4"/>'},

/* 19. Щит — герб трактира, вывеска на стене */
{n:'Щит',svg:
 '<path d="M16 2 Q27 4 27 15 Q27 24 16 30 Q5 24 5 15 Q5 4 16 2 Z" fill="url(#backWoodG)" stroke="#2a1a0c" stroke-width="1.5" stroke-linejoin="round"/>'
 +'<path d="M16 2 L16 30" stroke="#2a1a0c" stroke-width="0.5" opacity="0.4"/>'
 +'<path d="M13 13 L9 16 L13 19 L13 17.5 L22 17.5 L22 14.5 L13 14.5 Z" fill="#2a1a0c"/>'},

/* 20. Восковая печать — на письме или приказе, сургуч */
{n:'Печать',svg:
 '<circle cx="16" cy="16" r="13" fill="url(#backWaxG)" stroke="#2a0404" stroke-width="1.5"/>'
 +'<circle cx="16" cy="16" r="10" fill="none" stroke="#2a0404" stroke-width="0.8" opacity="0.65"/>'
 +'<path d="M13 12 L8 16 L13 20 L13 18 L22 18 L22 14 L13 14 Z" fill="#2a0404"/>'
 +'<circle cx="19" cy="13" r="0.7" fill="#2a0404" opacity="0.6"/>'
 +'<circle cx="19" cy="19" r="0.7" fill="#2a0404" opacity="0.6"/>'}
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
      +'<div class="hint">Двадцать вариантов в стиле трактира.<div class="hgap"></div>Выбор пока не сохраняется — только просмотр.</div>'
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