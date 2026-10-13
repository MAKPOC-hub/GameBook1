// engine_render_inventory.js
// v1.0.5 -> v1.0.6
// Проект: GameBook1
// Функция: просмотр предмета и открытие мешка
// Изменение: восстановление после сбоя: дописана функция closeInv()

'use strict';

/* ===== Картинка кошелька ===== */
const PURSE_SVG='<svg viewBox="0 0 40 48" width="38" height="46" aria-hidden="true"><defs><linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a0764a"/><stop offset=".5" stop-color="#7a5230"/><stop offset="1" stop-color="#4a2e18"/></linearGradient><radialGradient id="coinGrad" cx=".35" cy=".35"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".7" stop-color="#d9a636"/><stop offset="1" stop-color="#8a611a"/></radialGradient></defs><path d="M10 18 Q5 28 8 38 Q20 46 32 38 Q35 28 30 18 Z" fill="url(#bagGrad)" stroke="#3a2410" stroke-width="1.5"/><ellipse cx="20" cy="18" rx="10" ry="3" fill="#5a3a1e" stroke="#3a2410" stroke-width="1"/><path d="M12 16 Q20 10 28 16" fill="none" stroke="#c9a24a" stroke-width="1.5"/><path d="M20 10 L20 4" stroke="#c9a24a" stroke-width="1.5"/><circle cx="20" cy="4" r="2" fill="#c9a24a"/></svg>';

/* ===== Мешок ===== */
function openInv(){
  const box=$('#invbox');
  const BASE=3, PREMIUM=5, COST=3;
  const owned=Math.min(PREMIUM, S.bagExt||0);
  const cap=BASE+owned+(has('birch_notes')?1:0);
  const premiumLeft=PREMIUM-owned;
  let h='<div class="invhead"><span class="invh-bag">Мешок '+S.inv.length+'/'+cap+'</span><span class="pursewrap">'+PURSE_SVG+'<b class="purse-n">'+S.gold+'</b></span></div>';
  h+='<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:6px">';
  const groups=[],seen={};
  S.inv.forEach(function(it){if(seen[it]===undefined){seen[it]=1;groups.push(it);}else{seen[it]++;}});
  const hasCards=!!(window.ItemCards&&typeof window.ItemCards.get==='function');
  groups.forEach(function(it){
    const ready=isReady(it);
    const cd=cdLeft(it);
    let cls='bcell-card';
    if(!ready)cls+=' on-cd';
    let a=null;
    if(hasCards)a=window.ItemCards.get(it);
    const cellStyle='width:92px;flex:0 0 auto;';
    if(a){
      h+='<div class="'+cls+'" data-item="'+it+'" title="'+ITEMS[it].n+'" style="'+cellStyle+'">'
        +'<div class="bcc-wrap"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div>'
        +(seen[it]>1?'<span class="cnt">'+seen[it]+'</span>':'')
        +(ready?'':'<span class="cd-badge">'+cd+'</span>')
        +'<div class="bcell-name">'+ITEMS[it].n+'</div>'
        +'</div></div>';
    }else{
      const name=(ITEMS[it]?ITEMS[it].n:'?');
      h+='<div class="'+cls+'" data-item="'+it+'" title="'+name+'" style="'+cellStyle+'"><span style="font-size:28px;opacity:.7">'+name.charAt(0)+'</span>'+(seen[it]>1?'<span class="cnt">'+seen[it]+'</span>':'')+(ready?'':'<span class="cd-badge">'+cd+'</span>')+'<div class="bcell-name">'+name+'</div></div>';
    }
  });
  h+='</div>';
  const emptyCount=cap-groups.length;
  if(emptyCount>0||premiumLeft>0){
    h+='<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:10px;border-top:1px dashed rgba(122,90,56,.35);padding-top:10px">';
    for(let k=0;k<emptyCount;k++)h+='<div class="bcell empty" style="width:92px;flex:0 0 auto;aspect-ratio:5/7.2"></div>';
    const adIconFn=window.adIcon||function(){return '';};
    for(let k=0;k<premiumLeft;k++){
      h+='<div class="bcell premium" data-buy="1" style="width:92px;flex:0 0 auto;aspect-ratio:5/7.2"><span class="price">'+adIconFn(32)+'<b>'+COST+'</b></span></div>';
    }
    h+='</div>';
  }
  h+='<div style="text-align:center;margin-top:12px"><button class="btn" id="invc">Закрыть</button></div>';
  box.innerHTML=h;
  $('#inv').classList.remove('hidden');
  box.querySelectorAll('.bcell[data-item],.bcell-card[data-item]').forEach(function(el){
    el.addEventListener('click',function(){openDetail(el.getAttribute('data-item'));});
  });
  box.querySelectorAll('.bcell.premium').forEach(function(el){
    el.addEventListener('click',unlockSlot);
  });
  $('#invc').addEventListener('click',closeInv);
}

/* ===== Покупка ячейки мешка ===== */
function unlockSlot(){
  const COST=3;
  const MAXEXT=5;
  if((S.bagExt||0)>=MAXEXT){toast('Все премиум-ячейки уже открыты');return;}
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  if(cur<COST){toast('Не хватает осколков: нужно '+COST+', у вас '+cur);return;}
  if(typeof window.confirmBuy!=='function'){doUnlockSlot(COST);return;}
  window.confirmBuy('ячейка мешка', COST, function(){doUnlockSlot(COST);});
}
function doUnlockSlot(COST){
  if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(COST)){
    toast('Не удалось списать осколки');return;
  }
  S.bagExt=(S.bagExt||0)+1;
  save();
  toast('Новая ячейка мешка открыта! (−'+COST+' осколка)');
  openInv();
  renderQuickbar();
}

/* ===== Просмотр предмета =====
   ⚠️ Кнопка использования показывается для двух случаев:
   1) обычная еда (HEALS[it]) — кнопка «Съесть (+N сердце)»;
   2) обманка (ITEMS[it].bad) — кнопка «Попробовать».
   Оба варианта вызывают eatItem — он сам разберётся. */
function openDetail(it){
  if(it==='birch_notes'){
    if(typeof window.openNotes==='function'){window.openNotes();}
    return;
  }
  let det=$('#det');
  if(!det){
    det=document.createElement('div');det.className='ovl hidden';det.id='det';
    const d=document.createElement('div');d.className='invbox detbox';d.id='detbox';
    det.appendChild(d);document.body.appendChild(det);
    det.addEventListener('click',function(e){if(e.target===det)det.classList.add('hidden');});
  }
  const info=ITEMS[it];
  const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(it):null;
  let preview;
  if(a){
    preview='<div class="det-preview"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div></div>';
  }else{
    preview='<div class="det-preview"><div class="gbp" style="width:140px"><div class="gbp-art" style="font-size:52px;color:#e9dfc5">'+info.n.charAt(0)+'</div></div></div>';
  }
  const rawName=String(info.n);
  let titleHTML=rawName;
  const quoteIdx=rawName.indexOf(' «');
  if(quoteIdx>0){
    titleHTML=rawName.slice(0,quoteIdx)+'<br>'+rawName.slice(quoteIdx+1);
  }
  let btns='';
  const ready=isReady(it);
  const cd=cdLeft(it);
  const noCombat=!S.combat;
  /* Обычная еда. */
  if(HEALS[it]&&noCombat&&S.hp<S.maxhp){
    btns+='<button class="btn" id="detuse">Съесть (+'+HEALS[it]+' '+ico('heart',14)+')</button>';
  }
  /* Обманка — кнопка доступна всегда, даже при полном здоровье. */
  if(ITEMS[it]&&ITEMS[it].bad&&noCombat){
    btns+='<button class="btn" id="detuse">Попробовать</button>';
  }
  if(it==='scroll_heal'&&noCombat&&S.hp<S.maxhp)btns+='<button class="btn" id="detuse">Сотворить (+2 '+ico('heart',14)+')</button>';
  if(it==='scroll_fire'&&S.combat)btns+='<button class="btn" id="detfire">Огненный шар (враг −2 '+ico('heart',14)+')</button>';
  if(it==='compass'||it==='flash'||it==='lute'||it==='vory_knife'){
    if(!ready){
      btns+='<button class="btn" id="detreset">Сбросить перезарядку (3 осколка)</button>';
    }else{
      btns+='<button class="btn" id="detapply">Применить</button>';
    }
  }
  btns+='<button class="btn" id="detdrop">Выкинуть</button><button class="btn" id="detclose">Закрыть</button>';
  $('#detbox').innerHTML=preview+'<h3>'+titleHTML+'</h3><div class="detd">'+info.d+'</div>'
    +'<div style="display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:8px;margin-top:12px">'+btns+'</div>';
  det.classList.remove('hidden');
  const u=$('#detuse');
  if(u)u.addEventListener('click',function(){
    if(it==='scroll_heal'){
      S.inv.splice(S.inv.indexOf(it),1);healHp(2);toast('Исцеление (+2 сердца)');save();
      det.classList.add('hidden');
      if(typeof window.updateHudCurrencies==='function')window.updateHudCurrencies();
      render();
    }else{eatItem(it);}
  });
  const fi=$('#detfire');
  if(fi)fi.addEventListener('click',function(){
    det.classList.add('hidden');
    if(typeof fireScroll==='function')fireScroll();
  });
  const ap=$('#detapply');
  if(ap)ap.addEventListener('click',function(){
    const used=applyItemFromBag(it);
    if(used){det.classList.add('hidden');}
  });
  const rs=$('#detreset');
  if(rs)rs.addEventListener('click',function(){
    if(resetCdForCoins(it)){det.classList.add('hidden');}
  });
  $('#detdrop').addEventListener('click',function(){
    if(typeof window.confirmAction==='function'){
      window.confirmAction(
        'Выкинуть предмет?',
        '<b style="color:#ffe9a0">'+info.n+'</b> исчезнет из мешка навсегда. Вернуть его будет нельзя.',
        'Да, выкинуть',
        function(){
          S.inv.splice(S.inv.indexOf(it),1);
          recalcMaxHp();
          toast('Выброшено: '+info.n);save();
          det.classList.add('hidden');render();
        }
      );
    }else{
      S.inv.splice(S.inv.indexOf(it),1);
      recalcMaxHp();
      toast('Выброшено: '+info.n);save();
      det.classList.add('hidden');render();
    }
  });
  $('#detclose').addEventListener('click',function(){det.classList.add('hidden');});
}

/* ===== Закрыть мешок ===== */
function closeInv(){$('#inv').classList.add('hidden');}