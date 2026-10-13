// engine_state_hud.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: отрисовка верхней панели — сердца, золото, название локации
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции hud()

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
  const sb=$('#statb');
  if(sb)sb.innerHTML=getLocationName(S.node);
  /* Валюта обновляется отдельно — из settings.js. */
  if(typeof window.updateHudCurrencies==='function')window.updateHudCurrencies();
}