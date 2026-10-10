// engine_combat.js
// v1.0.3 -> v1.0.4
// Проект: GameBook1
// Функция: бой — запуск, вспышка, бросок тени, продолжение и побег после вспышки, обычная атака, огненный шар, побег, конец раунда, маршрутизация действий
// Изменение: Вспышка в бою с Ордриком не даёт эффекта — он знает заклинание и уклоняется. Пустой ход без карт «Сбежать»/«Продолжить». Плюс в бою с Ордриком при броске кинжала ставится флаг для эпилога

'use strict';

function swordBonus(){
  if(!has('new_sword'))return 0;
  if(S.flags.sword_core_installed)return 2;
  return 1;
}

function startCombat(fid,win,flee,first,lose){
  const f=FOES[fid];
  S.combat={
    id:fid,
    hp:f.h-(first?1:0),
    win:win,
    flee:flee,
    lose:lose||0,
    flashUsed:false,
    knifeUsed:false,
    flashChoose:false,
    log:[first?'Вы бьёте первым!':'Бой начинается!']
  };
  if(S.combat.hp<=0){S.combat=null;toast('Победа!');go(win);return;}
  render();
}

/* ===== Вспышка в бою =====
   Обычно: враг бросает, игрок пропускает бросок и получает карты «Сбежать»/«Продолжить».
   В бою с Ордриком: он знает заклинание, уклоняется. Пустой ход без карт выбора.
   ↙️ Используется в: applyItemFromBag (engine_items_apply.js), combatAction (в этом же файле) */
function flashInCombat(){
  const cb=S.combat;
  if(!cb)return;
  if(!has('flash')){toast('Нет Вспышки');return;}
  if(!isReady('flash')){toast('Вспышка перезаряжается ('+cdLeft('flash')+' ходов)');return;}
  if(cb.flashUsed){toast('Вспышка уже использована в этом бою');return;}
  cb.flashUsed=true;
  setCd('flash');
  /* Ордрик знает это заклинание — Вспышка не срабатывает. */
  if(cb.id==='ordric'){
    cb.log.push('Вспышка! Свет разливается по поляне — но Ордрик знает это заклинание.');
    cb.log.push('Он закрывается посохом и уклоняется. Раунд впустую.');
    save();
    render();
    return;
  }
  const enemy=roll2(false);
  const eDice=DICEF[enemy.a]+DICEF[enemy.b];
  cb.log.push('Вспышка! Враг бросает '+eDice+' = '+enemy.sum+' — но ослеплён.');
  cb.log.push('Вы пропускаете бросок. Раунд впустую.');
  cb.flashChoose=true;
  save();
  render();
}

/* ===== Бросок тени в бою =====
   Если бой с Ордриком — ставим флаг для эпилога.
   ↙️ Используется в: applyItemFromBag (engine_items_apply.js), combatAction (в этом же файле) */
function knifeInCombat(){
  const cb=S.combat;
  if(!cb)return;
  if(!has('vory_knife')){toast('Нет Броска тени');return;}
  if(!isReady('vory_knife')){toast('Бросок тени: перезарядка '+cdLeft('vory_knife')+' ходов');return;}
  if(cb.knifeUsed){toast('Бросок тени уже использован в этом бою');return;}
  cb.knifeUsed=true;
  setCd('vory_knife');
  cb.hp--;
  if(cb.id==='ordric')S.flags.vory_knife_used_in_ordric=1;
  cb.log.push('Бросок тени! Удар в тень — враг ранен. (−1 HP, без броска)');
  afterRound(cb);
}

function flashContinue(){
  const cb=S.combat;
  if(!cb)return;
  cb.flashChoose=false;
  cb.log.push('Бой продолжается.');
  save();
  render();
}
function flashEscape(){
  const cb=S.combat;
  if(!cb)return;
  const flee=cb.flee;
  const lose=cb.lose;
  S.combat=null;
  save();
  if(flee){toast('Вы скрылись в темноте!');go(flee);return;}
  if(lose){go(lose);return;}
  toast('Вы выходите из боя.');
  go(4);
}

function attackAction(){
  const cb=S.combat;
  if(!cb)return;
  const bonus=swordBonus();
  const enemy=roll2(false);
  const player=roll2(has('horseshoe'));
  const playerSum=player.sum+bonus;
  const eDice=DICEF[enemy.a]+DICEF[enemy.b];
  const pDice=DICEF[player.a]+DICEF[player.b]+(bonus?' +'+bonus:'');
  cb.log.push('Враг: '+eDice+' = '+enemy.sum);
  cb.log.push('Вы: '+pDice+' = '+playerSum);
  if(playerSum>enemy.sum){
    cb.hp--;
    cb.log.push('Вы ранили врага! (−1 HP)');
  }else if(enemy.sum>playerSum){
    S.hp--;
    cb.log.push('Враг ранил вас. (−1 сердце)');
  }else{
    cb.log.push('Ничья — никто не ранен.');
  }
  afterRound(cb);
}
function fireScroll(){
  const cb=S.combat;
  if(!cb)return;
  if(!has('scroll_fire')){toast('Нет свитка');return;}
  S.inv.splice(S.inv.indexOf('scroll_fire'),1);
  cb.hp-=2;
  cb.log.push('Огненный шар обжигает врага! (−2 HP). Свиток сгорел.');
  afterRound(cb);
}
function fleeAction(){
  const cb=S.combat;
  if(!cb||!cb.flee)return;
  const bonus=swordBonus();
  const enemy=roll2(false);
  const player=roll2(has('horseshoe'));
  const playerSum=player.sum+bonus;
  cb.log.push('Побег — враг: '+enemy.sum+', вы: '+playerSum+(bonus?' (+'+bonus+' от меча)':''));
  if(playerSum>=enemy.sum){
    const flee=cb.flee;
    S.combat=null;
    save();
    toast('Вы ускользнули!');
    go(flee);
  }else{
    S.hp--;
    cb.log.push('Побег не удался — враг ранил вас.');
    afterRound(cb);
  }
}

function afterRound(cb){
  save();
  if(cb.hp<=0){S.combat=null;toast('Победа!');go(cb.win);return;}
  if(S.hp<=0){
    const loseNode=cb.lose;
    S.combat=null;
    save();
    if(loseNode){go(loseNode);return;}
    if(typeof showCheckpointChoice==='function')showCheckpointChoice();
    return;
  }
  render();
}

function combatAction(c){
  if(busy)return;
  const cb=S.combat;
  if(!cb)return;
  if(cb.flashChoose){
    if(c.ca==='flash_escape'){flashEscape();return;}
    if(c.ca==='flash_continue'){flashContinue();return;}
    return;
  }
  if(c.ca==='atk'){attackAction();return;}
  if(c.ca==='flash'){flashInCombat();return;}
  if(c.ca==='knife'){knifeInCombat();return;}
  if(c.ca==='fire'){fireScroll();return;}
  if(c.ca==='flee'){fleeAction();return;}
}