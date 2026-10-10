// itemcards_gallery.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: галерея предметов — открытие оверлея и построение сетки по секциям (стартовые артефакты, оружие, еда, снаряжение, свитки)
// Изменение: удалена секция «Сокровища» — единственный предмет в ней (кольцо) убран из игры

'use strict';

/* ===== Секции галереи предметов =====
   ↙️ Используется в: openItemGallery (в этом же файле) */
const SECTIONS=[
  {n:'Классовые артефакты',ids:['vigor_amulet','vory_knife','flash','compass','lute','horseshoe']},
  {n:'Оружие и доспехи',ids:['sword','ksword','armor']},
  {n:'Еда и зелья',ids:['bread','loaf','sukhar','jerky','berries','potion']},
  {n:'Снаряжение',ids:['flint','candle','rope']},
  {n:'Свитки',ids:['scroll_fire','scroll_heal']}
];

/* ===== Открытие галереи предметов =====
   ↗️ ITEMS — в: engine_data_items.js
   ↗️ ItemCards — в: itemcards_export.js
   ↙️ Вызывается из: settings.js (кнопка «Предметы») через window.openItemGallery */
function openItemGallery(){
  let ov=document.getElementById('itemgallery');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='itemgallery';
    ov.innerHTML='<div class="invbox" style="max-width:820px">'
      +'<h3>Галерея предметов</h3>'
      +'<div id="itemgcontent"></div>'
      +'<div style="text-align:center;margin-top:14px"><button class="btn" id="itemgclose">Закрыть</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#itemgclose').addEventListener('click',function(){ov.classList.add('hidden');});
  }
  const content=ov.querySelector('#itemgcontent');
  content.innerHTML='';
  const allArt=(window.ItemCards&&typeof window.ItemCards.all==='function')?window.ItemCards.all():{};
  SECTIONS.forEach(function(sec){
    const g=document.createElement('div');
    g.className='gbgroup';
    const h=document.createElement('h4');
    h.textContent=sec.n;
    g.appendChild(h);
    const grid=document.createElement('div');
    grid.className='gbgrid';
    sec.ids.forEach(function(id){
      const info=ITEMS[id];
      const a=allArt[id];
      if(!info||!a)return;
      const cell=document.createElement('div');
      cell.className='gbcell';
      cell.title=info.d;
      const card=document.createElement('div');
      card.className='gbp';
      card.style.setProperty('--cbg',a.bg);
      card.style.setProperty('--cbr',a.br);
      const art=document.createElement('div');
      art.className='gbp-art';
      art.innerHTML=a.art;
      card.appendChild(art);
      cell.appendChild(card);
      const nm=document.createElement('div');
      nm.className='gbname';
      nm.textContent=info.n;
      cell.appendChild(nm);
      grid.appendChild(cell);
    });
    g.appendChild(grid);
    content.appendChild(g);
  });
  ov.classList.remove('hidden');
}
window.openItemGallery=openItemGallery;