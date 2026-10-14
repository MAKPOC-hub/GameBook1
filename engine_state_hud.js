// engine_state_hud.js
// v1.0.2 -> v1.0.3
// Проект: GameBook1
// Функция: отрисовка верхней панели — сердца, золото, название локации
// Изменение: название локации теперь кладётся только в текстовую часть бейджа (badge-txt), а не в бейдж целиком. Это сохраняет значок истории, который стоит слева от названия и вставляется один раз в разметке

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
  if(sb){
    const txt=sb.querySelector('.badge-txt');
    if(txt){
      txt.textContent=getLocationName(S.node);
    }else{
      sb.textContent=getLocationName(S.node);
    }
  }
  /* Валюта обновляется отдельно — из settings.js. */
  if(typeof window.updateHudCurrencies==='function')window.updateHudCurrencies();
}