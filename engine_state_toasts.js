// engine_state_toasts.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: всплывающие сообщения (тосты) и подсказки над центральной картой и над кубиком + страховочные стили для .skilltoast и .diceglow
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции skillToastOverDice()

'use strict';

/* ===== Страховочный CSS для .skilltoast/.diceglow ===== */
(function _injectSkillStyles(){
if(document.getElementById('zl-skill-styles'))return;
const st=document.createElement('style');
st.id='zl-skill-styles';
st.textContent=
'.skilltoast{position:fixed;z-index:70;transform:translate(-50%,0);pointer-events:none;font-family:Georgia,"Times New Roman",serif;font-size:15px;font-weight:700;letter-spacing:1px;padding:6px 12px;border-radius:10px;background:rgba(20,28,16,.94);border:2px solid #7a5a38;color:#f2e7c8;box-shadow:0 6px 18px rgba(0,0,0,.55);text-shadow:0 2px 4px #000;text-align:center;max-width:90vw;animation:_skilltin .3s}'
+'@keyframes _skilltin{from{opacity:0;transform:translate(-50%,-6px)}to{opacity:1;transform:translate(-50%,0)}}'
+'.skilltoast.overdice{transform:translate(-50%,-100%);animation:_skilltin-over .3s}'
+'@keyframes _skilltin-over{from{opacity:0;transform:translate(-50%,calc(-100% - 6px))}to{opacity:1;transform:translate(-50%,-100%)}}'
+'.skilltoast.win{border-color:#8fbf74;color:#e9ffcf}'
+'.skilltoast.lose{border-color:#c96a5a;color:#ffd6cd}'
+'.skilltoast.tie{border-color:#e8c76a;color:#fff3cf}'
+'#dicewrap .diceglow{position:absolute;inset:-4px;border-radius:28px;opacity:0;transition:opacity .35s ease;pointer-events:none;background:transparent}'
+'#dicewrap .diceglow.win{background:rgba(120,230,90,.18);box-shadow:0 0 26px 6px rgba(120,230,90,.95),0 0 72px 22px rgba(120,230,90,.55);opacity:1}'
+'#dicewrap .diceglow.lose{background:rgba(235,72,60,.18);box-shadow:0 0 26px 6px rgba(235,72,60,.95),0 0 72px 22px rgba(235,72,60,.55);opacity:1}'
+'#dicewrap .diceglow.tie{background:rgba(245,205,80,.18);box-shadow:0 0 26px 6px rgba(245,205,80,.95),0 0 72px 22px rgba(245,205,80,.55);opacity:1}';
document.head.appendChild(st);
})();

/* ===== Тосты =====
   ↙️ Используется в: engine_state.js, engine_state_cooldown.js, engine_items_apply.js, engine_combat.js, engine_story_special.js, engine_checkpoints_logic.js, engine_render_inventory.js, engine_render_quickbar.js, engine_render_start_item.js, settings.js, cardbacks.js */
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;$('#toasts').appendChild(d);setTimeout(function(){d.remove();},2400);}

/* ===== Поиск якоря над центральной картой ===== */
function _cardAnchor(){
  const wraps=document.querySelectorAll('#cards .cardwrap');
  if(!wraps.length)return{x:window.innerWidth/2,y:window.innerHeight*0.28};
  let best=null,bd=Infinity;
  wraps.forEach(function(w){
    const c=w.querySelector('.card');
    if(!c)return;
    const b=c.getBoundingClientRect();
    const cx=b.left+b.width/2;
    const d=Math.abs(cx-window.innerWidth/2);
    if(d<bd){bd=d;best=b;}
  });
  if(!best)return{x:window.innerWidth/2,y:window.innerHeight*0.28};
  return{x:best.left+best.width/2,y:best.top+12};
}

/* ===== Подсказка над картой =====
   ↙️ Используется в: engine_combat.js */
function skillToast(msg,result){
  const pos=_cardAnchor();
  const d=document.createElement('div');
  d.className='skilltoast'+(result?' '+result:'');
  d.textContent=msg;
  d.style.left=pos.x+'px';
  d.style.top=pos.y+'px';
  document.body.appendChild(d);
  setTimeout(function(){d.remove();},2400);
}

/* ===== Подсказка над кубиком =====
   ↙️ Используется в: engine_state_dice_visual.js */
function skillToastOverDice(msg,result){
  const w=$('#dicewrap');
  if(!w)return null;
  const b=w.getBoundingClientRect();
  const d=document.createElement('div');
  d.className='skilltoast overdice'+(result?' '+result:'');
  d.textContent=msg;
  d.style.left=(b.left+b.width/2)+'px';
  d.style.top=(b.top-12)+'px';
  document.body.appendChild(d);
  return d;
}