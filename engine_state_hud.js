// engine_state_hud.js
// v1.0.0
// Проект: GameBook1
// Функция: отрисовка верхней панели — сердца, золото, надпись мешка, название локации
// Изменение: файл создан — выделен из engine2.js (ХАД)

'use strict';

/* ===== ХАД =====
   ↗️ getLocationName — в: engine_data_core.js
   ↙️ Используется в: engine_render_screen.js */
function hud(){
  let h='';
  for(let i=0;i<S.maxhp;i++){
    const filled=i<S.hp;
    const c=filled?'#e2453b':'#4a3b2a';
    const svg=(window.Icons&&Icons.heart)?Icons.heart(33,c):'';
    h+='<span class="heart'+(filled?' on':'')+'">'+svg+'</span>';
  }
  const heartsEl=$('#hearts');
  if(heartsEl)heartsEl.innerHTML=h;
  const gv=$('#goldv');
  if(gv)gv.textContent=S.gold;
  const bl=$('#bagl');
  if(bl)bl.textContent='Мешок '+S.inv.length+'/'+invMax();
  const sb=$('#statb');
  if(sb)sb.innerHTML=getLocationName(S.node);
}