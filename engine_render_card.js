// engine_render_card.js
// v1.0.6 -> v1.0.7
// Проект: GameBook1
// Функция: построение одной карты выбора — с учётом боя, цены, подсказок по предмету, подсказок компаса, правила броска
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции buildCard()

'use strict';

/* ===== Построение карты выбора =====
   ↗️ ico — в: engine_render_helpers.js
   ↗️ ITEM_HINT, ROLL_RULE — в: engine_render_helpers.js
   ↗️ has, isReady, cdLeft — в: engine_state.js, engine_state_cooldown.js
   ↗️ play — в: engine_story_special.js
   ↙️ Используется в: engine_render_screen.js (render, renderCombat) */
function buildCard(c,i,artHTML){
  const w=document.createElement('div');w.className='cardwrap';
  const d=document.createElement('div');d.className='card';
  /* ⚠️ c.tag из сюжета ИГНОРИРУЕТСЯ намеренно: это спойлер эффекта.
     Оставляем только нейтральные авто-метки «Бой» и «Цена». */
  let tag='';
  if(!c.noTag){
    if(c.combat)tag='Бой';
    else if(c.buy)tag='Цена: '+c.buy.cost+' зол.';
  }
  /* Подсказка про применяемый предмет — ВНУТРИ карты, под .ct.
     Формат: «Подсказка: с Компасом, — без броска кубика». */
  let applyHint='';
  if(c.applyItem){
    const id=c.applyItem;
    const have=has(id);
    const ready=isReady(id);
    let txt=ITEM_HINT[id]||('Подсказка: с '+ITEMS[id].n+'<div class="hgap"></div>— бонус');
    if(have&&!ready)txt+='<div class="hgap"></div>(перезарядка: '+cdLeft(id)+' ходов)';
    applyHint='<div class="card-apply">'+txt+'</div>';
  }
  /* ===== Подсказка активного Компаса =====
     Берётся текст целевого узла (куда ведёт карта). Из него убираются
     HTML-теги и переносы строк. Если длина больше 100 символов — текст
     обрезается по последнему пробелу, чтобы слово не рвалось, и в конце
     ставится многоточие. Если текст задан функцией (зависит от флагов
     игрока) — показывается многоточие, потому что заранее его не построить.
     ↙️ Используется в: карта с флагом compassActive (в этом же файле) */
  let compassHint='';
  if(S.flags.compassActive===S.node&&c.go){
    const target=NODES[c.go];
    if(target){
      let short='';
      if(typeof target.t==='function'){
        short='…';
      }else{
        short=String(target.t).replace(/<[^>]+>/g,'').replace(/\n/g,' ').trim();
        if(short.length>100){
          let cut=short.slice(0,100);
          const lastSpace=cut.lastIndexOf(' ');
          if(lastSpace>0){
            cut=cut.slice(0,lastSpace);
          }
          short=cut+'…';
        }
      }
      compassHint='<div class="card-compass">'+ico('compass',11)+short+'</div>';
    }
  }
  /* ⚠️ Подсказка о правиле броска — отдельный блок внутри карты под .ct.
     Показывается ВСЕГДА при наличии проверки — игрок видит правило заранее.
     Иконка кубика в начало текста НЕ добавляется: она уже стоит в тексте карт
     с проверками (см. story_ch1_*.js), иначе игрок увидит два кубика подряд. */
  let rollHint='';
  if(c.check||c.checkFail||c.checkFood){
    rollHint='<div class="card-apply card-roll">'+ROLL_RULE+'</div>';
  }
  /* ⚠️ c.t обёрнут в <span>: если внутри текста есть SVG-иконки, они выравниваются
     по базовой линии как обычный inline-поток, а не «пляшут» по отдельности. */
  d.innerHTML=artHTML
    +'<div class="ct"><span>'+c.t+'</span></div>'
    +(tag?'<div class="cg">'+tag+'</div>':'')
    +applyHint
    +rollHint
    +compassHint;
  const num=document.createElement('div');num.className='cn';num.textContent=(i+1);
  w.appendChild(d);
  w.appendChild(num);
  w.addEventListener('pointerup',function(e){
    if(e.pointerType==='mouse'&&e.button!==0)return;
    play(c);
  });
  return w;
}