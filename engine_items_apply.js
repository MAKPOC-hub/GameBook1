// engine_items_apply.js
// v1.0.3 -> v1.0.4
// Проект: GameBook1
// Функция: применение предметов из мешка — особые предметы, поедание еды, обработка предметов-обманок
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции eatItem()

'use strict';

function applyItemFromBag(id){
  if(!has(id)){toast('Предмета нет в мешке');return false;}
  if(id==='vigor_amulet'){toast('Амулет работает постоянно — +2 сердца к максимуму');return false;}
  if(id==='horseshoe'){toast('Подкова работает постоянно — все ваши броски удачливее');return false;}
  if(id==='vory_knife'){
    if(!S.combat){toast('Бросок тени применяется только в бою');return false;}
    if(!isReady('vory_knife')){toast('Бросок тени: перезарядка '+cdLeft('vory_knife')+' ходов');return false;}
    if(S.combat.knifeUsed){toast('Бросок тени уже использован в этом бою');return false;}
    knifeInCombat();
    return true;
  }
  if(id==='flash'){
    if(!S.combat){toast('Вспышка применяется только в бою');return false;}
    if(!isReady('flash')){toast('Вспышка перезаряжается ('+cdLeft('flash')+' ходов)');return false;}
    flashInCombat();
    return true;
  }
  if(id==='compass'){
    if(!isReady('compass')){toast('Компас перезаряжается ('+cdLeft('compass')+' ходов)');return false;}
    const n=NODES[S.node];
    if(!n){toast('Нечего подсказывать');return false;}
    const cs=(typeof n.c==='function')?n.c(S):(n.c||[]);
    const visible=cs.filter(function(cc){return !cc.req||cc.req(S);});
    if(visible.length<2){toast('Здесь нечего подсказывать');return false;}
    S.flags.compassActive=S.node;
    setCd('compass');
    save();
    toast('Компас подсказывает…');
    render();
    return true;
  }
  if(id==='lute'){
    if(!S.lutePrev||!S.lutePrev.dlg){toast('Лютня звучит только после решений в разговоре');return false;}
    if(S.flags.lute_used){toast('Лютня уже играла в этом разговоре');return false;}
    S.flags.lute_used=1;
    save();
    toast('Лютня звучит — вы возвращаетесь к выбору');
    go(S.lutePrev.node);
    return true;
  }
  return false;
}

/* ===== Съесть или выпить предмет =====
   Обычная еда восстанавливает сердца согласно таблице HEALS.
   Предметы-обманки (у которых в ITEMS стоит bad:true) наоборот —
   отнимают 1 сердце. Оба варианта удаляют предмет из мешка.
   ↙️ Вызывается из: engine_render_inventory.js (openDetail — кнопка
      «Съесть» или «Попробовать»), engine_render_quickbar.js (если
      предмет применён напрямую) */
function eatItem(it){
  if(!has(it)){toast('У вас нет этого');return;}
  /* Обманка: сухарь из телеги, замёрзший кувшин и подобные. */
  if(ITEMS[it]&&ITEMS[it].bad){
    S.hp--;
    S.inv.splice(S.inv.indexOf(it),1);
    save();
    const msg=ITEMS[it].badMsg||(ITEMS[it].n+' — плохо. −1 сердце.');
    toast(msg);
    const det=$('#det');if(det)det.classList.add('hidden');
    if(typeof render==='function')render();
    return;
  }
  /* Обычная еда. */
  if(S.hp>=S.maxhp){toast('Вы и так здоровы');return;}
  healHp(HEALS[it]);
  S.inv.splice(S.inv.indexOf(it),1);
  toast(ITEMS[it].n+' (+'+HEALS[it]+' сердце)');
  save();
  const det=$('#det');if(det)det.classList.add('hidden');
  if(typeof render==='function')render();
}