// engine_render_start_item.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: галерея стартовых предметов — сетка из шести, открытие, предпросмотр, покупка за осколки
// Изменение: восстановление после сбоя: дописан экспорт window.openStartItemGallery

'use strict';

/* ===== Инжект-стиль для сетки стартовой галереи: ровно 3 в ряд ===== */
(function _injectSigGrid(){
  if(document.getElementById('sig-grid-style'))return;
  const st=document.createElement('style');
  st.id='sig-grid-style';
  st.textContent='.sig-grid{grid-template-columns:repeat(3,1fr)!important}'
    +'@media(max-width:420px){.sig-grid{grid-template-columns:repeat(3,1fr)!important;gap:6px!important}}';
  document.head.appendChild(st);
})();

/* ===== Список и цена стартовых предметов =====
   ↙️ Используется в: openStartItemGallery, buildStartGalleryGrid, openStartItemPreview (в этом же файле) */
const START_ITEM_LIST=['vigor_amulet','vory_knife','flash','compass','lute','horseshoe'];
const START_ITEM_COST=10;

/* ===== Открытие галереи стартовых предметов =====
   ↗️ openStartItemGallery — вызывается из engine_story_special.js (special:'openStartItemGallery')
   ↙️ Через window.openStartItemGallery */
function openStartItemGallery(){
  let ov=document.getElementById('startitemgallery');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='startitemgallery';
    const adIconFn=window.adIcon||function(){return '';};
    ov.innerHTML='<div class="invbox" style="max-width:520px">'
      +'<h3>Выбор предмета за '+adIconFn(22)+' '+START_ITEM_COST+'</h3>'
      +'<div class="hint">Кликните по предмету,<br>чтобы увидеть описание.</div>'
      +'<div class="skgrid sig-grid" id="sig_grid"></div>'
      +'<div style="text-align:center;margin-top:14px"><button class="btn" id="sig_close">Закрыть</button></div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#sig_close').addEventListener('click',function(){ov.classList.add('hidden');});
  }
  buildStartGalleryGrid();
  ov.classList.remove('hidden');
}

/* ===== Построение сетки стартовой галереи =====
   ↗️ ItemCards — в: itemcards_export.js
   ↙️ Вызывается из: openStartItemGallery, openStartItemPreview (в этом же файле) */
function buildStartGalleryGrid(){
  const g=document.getElementById('sig_grid');
  if(!g)return;
  g.innerHTML='';
  const hasCards=!!(window.ItemCards&&typeof window.ItemCards.get==='function');
  START_ITEM_LIST.forEach(function(id){
    const info=ITEMS[id];
    const a=hasCards?window.ItemCards.get(id):null;
    const cell=document.createElement('div');
    cell.className='skcell';
    let inner='';
    if(a){
      inner='<div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div>';
    }else{
      inner='<div class="gbp"><div class="gbp-art" style="font-size:44px;color:#e9dfc5">'+info.n.charAt(0)+'</div></div>';
    }
    cell.innerHTML=inner;
    if(S.startItem===id){
      const badge=document.createElement('div');
      badge.className='skcur';
      badge.innerHTML='<span>выпал</span>';
      cell.appendChild(badge);
    }
    cell.addEventListener('click',function(){openStartItemPreview(id);});
    g.appendChild(cell);
  });
}

/* ===== Предпросмотр и покупка стартового предмета =====
   ↗️ recalcMaxHp — в: engine_state.js
   ↗️ confirmBuy — в: engine_state_dialogs.js
   ↗️ getAdCoins, spendAdCoins — в: settings.js
   ↙️ Вызывается из: buildStartGalleryGrid (в этом же файле) */
function openStartItemPreview(id){
  let ov=document.getElementById('startitempreview');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='startitempreview';
    ov.innerHTML='<div class="invbox detbox" style="max-width:420px"><div id="sip_body"></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
  }
  const info=ITEMS[id];
  const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(id):null;
  let preview;
  if(a){
    preview='<div class="det-preview"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div></div>';
  }else{
    preview='<div class="det-preview"><div class="gbp" style="width:140px"><div class="gbp-art" style="font-size:52px;color:#e9dfc5">'+info.n.charAt(0)+'</div></div></div>';
  }
  const isCurrent=S.startItem===id;
  const adIconFn=window.adIcon||function(){return '';};
  let btn;
  if(isCurrent){
    btn='<button class="btn" disabled style="opacity:.6;cursor:default">Уже у вас</button>';
  }else{
    btn='<button class="btn" id="sip_take">Выбрать за '+adIconFn(18)+' '+START_ITEM_COST+'</button>';
  }
  document.getElementById('sip_body').innerHTML=preview
    +'<h3>'+info.n+'</h3>'
    +'<div class="detd">'+info.d+'</div>'
    +'<div style="text-align:center;margin-top:12px">'+btn+' <button class="btn" id="sip_close">Закрыть</button></div>';
  ov.classList.remove('hidden');
  const takeBtn=document.getElementById('sip_take');
  if(takeBtn){
    takeBtn.addEventListener('click',function(){
      const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
      if(cur<START_ITEM_COST){toast('Не хватает осколков: нужно '+START_ITEM_COST+', у вас '+cur);return;}
      function doBuy(){
        if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(START_ITEM_COST)){
          toast('Не удалось списать осколки');return;
        }
        if(S.startItem&&S.inv.indexOf(S.startItem)>=0){
          S.inv.splice(S.inv.indexOf(S.startItem),1);
        }
        S.startItem=id;
        if(S.inv.indexOf(id)<0)S.inv.push(id);
        recalcMaxHp();
        save();
        toast('Выбран предмет: '+ITEMS[id].n);
        document.getElementById('startitempreview').classList.add('hidden');
        buildStartGalleryGrid();
        render();
      }
      if(typeof window.confirmBuy==='function'){
        window.confirmBuy(ITEMS[id].n, START_ITEM_COST, doBuy);
      }else{
        doBuy();
      }
    });
  }
  document.getElementById('sip_close').addEventListener('click',function(){
    document.getElementById('startitempreview').classList.add('hidden');
  });
}
window.openStartItemGallery=openStartItemGallery;