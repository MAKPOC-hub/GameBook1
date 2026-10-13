// engine_state_cooldown.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: перезарядка предметов — проверка готовности, сколько ходов осталось, установка, тик при переходе, сброс за осколки (с подтверждением)
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции doResetCdForCoins()

'use strict';

/* ===== Перезарядка предметов =====
   ↙️ Используется в: engine_combat.js, engine_items_apply.js, engine_story_special.js, engine_render_quickbar.js, engine_render_inventory.js, engine_render_card.js */
function isReady(id){
  if(!S||!S.itemCd)return true;
  const until=S.itemCd[id];
  if(!until)return true;
  if(S.node>=until){
    delete S.itemCd[id];
    return true;
  }
  return false;
}
function cdLeft(id){
  if(!S||!S.itemCd)return 0;
  const until=S.itemCd[id];
  if(!until)return 0;
  return Math.max(0,until-S.node);
}
function setCd(id){
  if(!S.itemCd)S.itemCd={};
  S.itemCd[id]=S.node+10;
}

function tickCooldowns(){
  if(!S||!S.itemCd)return;
  Object.keys(S.itemCd).forEach(function(id){
    if(S.node>=S.itemCd[id])delete S.itemCd[id];
  });
}

/* ===== Сброс перезарядки за 3 осколка (с подтверждением) =====
   ↗️ confirmBuy — в: engine_state_dialogs.js
   ↗️ getAdCoins, spendAdCoins — в: settings.js */
function resetCdForCoins(id){
  const COST=3;
  if(isReady(id)){toast('Предмет и так готов');return false;}
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  if(cur<COST){toast('Не хватает осколков: нужно '+COST+', у вас '+cur);return false;}
  const name='сброс перезарядки: '+ITEMS[id].n;
  if(typeof window.confirmBuy!=='function'){doResetCdForCoins(id,COST);return true;}
  window.confirmBuy(name,COST,function(){doResetCdForCoins(id,COST);});
  return true;
}
function doResetCdForCoins(id,COST){
  if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(COST)){
    toast('Не удалось списать осколки');return;
  }
  delete S.itemCd[id];
  save();
  toast('Перезарядка сброшена (−'+COST+' осколка)');
}