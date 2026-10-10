// engine_render_quickbar.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: панель быстрого доступа — слоты, покупка премиум-ячейки, применение предмета по клику
// Изменение: номер в каждой ячейке теперь привязан к самой ячейке, а не к её позиции на экране. Раньше при нажатии на стрелки ‹ › предметы уезжали, а цифры 1-5 оставались на своих местах. Теперь цифра переезжает вместе с ячейкой — игрок видит, куда именно уехал предмет

'use strict';

/* ===== Панель быстрого доступа =====
   ↗️ ItemCards — в: itemcards.js
   ↗️ isReady, cdLeft — в: engine_state_cooldown.js
   ↗️ eatItem, applyItemFromBag — в: engine_items_apply.js
   ↗️ fireScroll — в: engine_combat.js
   ↙️ Вызывается из: engine_render_screen.js (render, renderCombat) */
function renderQuickbar(){
  const box=$('#quickbar');
  if(!box)return;
  const inv=S.inv||[];
  const BASE=3, PREMIUM=5, COST=3;
  const owned=Math.min(PREMIUM, S.bagExt||0);
  const cap=BASE+owned;
  const premiumLeft=PREMIUM-owned;

  const cells=[];
  inv.forEach(function(id){cells.push({type:'item',id:id});});
  for(let k=inv.length;k<cap;k++)cells.push({type:'empty'});
  for(let k=0;k<premiumLeft;k++)cells.push({type:'premium'});

  const total=cells.length;
  const showArrows=total>5;
  if(typeof S.quickOffset!=='number')S.quickOffset=0;
  if(showArrows){
    S.quickOffset=((S.quickOffset%total)+total)%total;
  }else{
    S.quickOffset=0;
  }

  let h='';
  if(showArrows)h+='<div class="qs-arrow" data-dir="-1">‹</div>';

  /* ⚠️ Номер ячейки считается по её месту в общем списке (абсолютный индекс),
     а не по позиции на экране. При сдвиге стрелками содержимое ячеек
     переезжает, и номер переезжает вместе с ним — игрок видит, куда именно
     уехал предмет. Если считать номер от позиции на экране (i+1), номера
     будут всегда 1..5, независимо от сдвига — это неправильно. */
  for(let i=0;i<5;i++){
    let cell=null;
    let absIdx=i;
    if(total<=5){
      if(i<total)cell=cells[i];
      absIdx=i;
    }else{
      absIdx=(S.quickOffset+i)%total;
      cell=cells[absIdx];
    }
    const num=absIdx+1;
    if(!cell){
      h+='<div class="qs-slot empty"><span class="qs-num">'+num+'</span></div>';
      continue;
    }
    if(cell.type==='empty'){
      h+='<div class="qs-slot empty"><span class="qs-num">'+num+'</span></div>';
      continue;
    }
    if(cell.type==='premium'){
      const adIconFn=window.adIcon||function(){return '';};
      h+='<div class="qs-slot premium" data-buy="1" title="Купить ячейку за '+COST+' осколка">'
        +'<span class="qs-price-icon">'+adIconFn(28)+'</span>'
        +'<span class="qs-price">'+COST+'</span>'
        +'<span class="qs-num">'+num+'</span>'
        +'</div>';
      continue;
    }
    const itemId=cell.id;
    const ready=isReady(itemId);
    const cd=cdLeft(itemId);
    const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(itemId):null;
    let inner='';
    if(a){
      inner='<div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div>';
    }else{
      const name=(ITEMS[itemId]?ITEMS[itemId].n:'?');
      inner='<div class="qs-emoji">'+name.charAt(0)+'</div>';
    }
    const cdBadge=ready?'':'<span class="cd-badge">'+cd+'</span>';
    h+='<div class="qs-slot'+(ready?'':' on-cd')+'" data-item="'+itemId+'" title="'+(ITEMS[itemId]?ITEMS[itemId].n:'')+'">'+inner+cdBadge+'<span class="qs-num">'+num+'</span></div>';
  }

  if(showArrows)h+='<div class="qs-arrow" data-dir="1">›</div>';
  box.innerHTML=h;

  box.querySelectorAll('.qs-slot[data-item]').forEach(function(el){
    el.addEventListener('click',function(){quickUseItem(el.getAttribute('data-item'));});
  });
  box.querySelectorAll('.qs-slot.premium').forEach(function(el){
    el.addEventListener('click',function(){quickUnlockSlot();});
  });
  box.querySelectorAll('.qs-arrow').forEach(function(el){
    el.addEventListener('click',function(e){
      e.stopPropagation();
      const dir=parseInt(el.getAttribute('data-dir'),10);
      if(total<=5)return;
      S.quickOffset=((S.quickOffset||0)+dir+total)%total;
      renderQuickbar();
    });
  });
}

/* ===== Покупка премиум-ячейки =====
   ↗️ confirmBuy — в: engine_state_dialogs.js
   ↗️ getAdCoins, spendAdCoins — в: settings.js
   ↙️ Вызывается из: renderQuickbar (в этом же файле) */
function quickUnlockSlot(){
  const COST=3;
  const MAXEXT=5;
  if((S.bagExt||0)>=MAXEXT){toast('Все премиум-ячейки уже открыты');return;}
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  if(cur<COST){toast('Не хватает осколков: нужно '+COST+', у вас '+cur);return;}
  if(typeof window.confirmBuy!=='function'){doQuickUnlockSlot(COST);return;}
  window.confirmBuy('ячейка мешка', COST, function(){doQuickUnlockSlot(COST);});
}
function doQuickUnlockSlot(COST){
  if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(COST)){
    toast('Не удалось списать осколки');return;
  }
  S.bagExt=(S.bagExt||0)+1;
  save();
  toast('Новая ячейка мешка открыта! (−'+COST+' осколка)');
  renderQuickbar();
}

/* ===== Быстрое применение предмета =====
   ↙️ Вызывается из: renderQuickbar (в этом же файле) */
function quickUseItem(id){
  if(!has(id)){toast('Предмета нет');renderQuickbar();return;}
  if(!isReady(id)){toast(ITEMS[id].n+': перезарядка '+cdLeft(id)+' ходов (сброс — в рюкзаке за 3 осколка)');renderQuickbar();return;}
  if(HEALS[id]){
    if(S.hp>=S.maxhp){toast('Вы и так здоровы');renderQuickbar();return;}
    eatItem(id);
    return;
  }
  if(id==='scroll_heal'){
    if(S.hp>=S.maxhp){toast('Вы и так здоровы');renderQuickbar();return;}
    if(S.combat){toast('Свиток лечения не работает в бою');renderQuickbar();return;}
    S.inv.splice(S.inv.indexOf(id),1);
    healHp(2);
    toast('Исцеление (+2 сердца)');
    save();
    render();
    return;
  }
  if(id==='scroll_fire'){
    if(!S.combat){toast('Огненный шар — только в бою');renderQuickbar();return;}
    fireScroll();
    return;
  }
  applyItemFromBag(id);
  renderQuickbar();
}