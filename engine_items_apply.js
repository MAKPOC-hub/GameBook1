// engine_items_apply.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: применение предметов из мешка — особые предметы (амулет, подкова, бросок тени, вспышка, компас, лютня) и поедание еды
// Изменение: в eatItem после еды вне боя вызывается render(), а не openInv(). Раньше открывалось окно мешка, чтобы игрок оставался в рюкзаке после еды. Теперь мешка в HUD нет — игрок видит обновлённый экран с быстрой панелью, где предмета уже нет

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

function eatItem(it){
  if(!has(it)){toast('У вас нет этого');return;}
  if(S.hp>=S.maxhp){toast('Вы и так здоровы');return;}
  healHp(HEALS[it]);
  S.inv.splice(S.inv.indexOf(it),1);
  toast(ITEMS[it].n+' (+'+HEALS[it]+' сердце)');
  save();
  const det=$('#det');if(det)det.classList.add('hidden');
  /* После еды просто перерисовываем экран: обновится быстрая панель,
     из неё исчезнет съеденный предмет, обновятся сердца в HUD. */
  if(typeof render==='function')render();
}