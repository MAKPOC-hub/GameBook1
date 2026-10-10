// engine_render_card.js
// v1.0.4 -> v1.0.5
// Проект: GameBook1
// Функция: построение одной карты выбора — с учётом боя, цены, подсказок по предмету, подсказок компаса, правила броска
// Изменение: удалена временная панель диагностики, которая помогала найти причину на телефоне. Причина оказалась не в коде, а в кэше GitHub — сервер отдавал старые версии файлов. Логика нажатия остаётся прежней: три события click, pointerup и touchend плюс принудительный захват указателя при касании

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
  /* Подсказка активного Компаса — тоже внутри карты */
  let compassHint='';
  if(S.flags.compassActive===S.node&&c.go){
    const target=NODES[c.go];
    if(target){
      const t=(typeof target.t==='function')?'…':String(target.t);
      const short=t.replace(/<[^>]+>/g,'').replace(/\n/g,' ').slice(0,60);
      compassHint='<div class="card-compass">'+ico('compass',11)+short+(t.length>60?'…':'')+'</div>';
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

  /* ===== Перехват нажатия по карте =====
     ⚠️ Подписываемся сразу на три события — click, pointerup и touchend.
     Разные мобильные браузеры создают разные события при тапе пальцем:
     некоторые создают click, некоторые только pointerup, некоторые только
     touchend. Чтобы карта срабатывала в любом браузере, слушаем все три
     и защищаемся от двойного срабатывания через метку времени. */

  /* Принудительный захват указателя при касании.
     Если браузер сам не передаёт событие отпускания (pointerup/pointercancel
     приходит на другой элемент), setPointerCapture заставляет браузер
     направлять все события по этому указателю именно на нашу карту. */
  w.addEventListener('pointerdown',function(e){
    try{w.setPointerCapture(e.pointerId);}catch(err){}
  });

  /* Запоминаем, где палец коснулся карты. Нужно, чтобы отличить тап
     (палец остался почти на месте) от начала жеста скролла
     (палец ушёл далеко в сторону). */
  let _touchStartX=0,_touchStartY=0;
  w.addEventListener('touchstart',function(e){
    if(e.touches&&e.touches[0]){
      _touchStartX=e.touches[0].clientX;
      _touchStartY=e.touches[0].clientY;
    }
  },{passive:true});

  /* Общая функция обработки. Одна метка времени — одно срабатывание карты. */
  let _tapHandledAt=0;
  function _cardTapHandler(e){
    if(e&&e.type==='pointerup'&&e.pointerType==='mouse'&&e.button!==0)return;
    const now=Date.now();
    if(now-_tapHandledAt<500)return;
    _tapHandledAt=now;
    play(c);
  }

  w.addEventListener('click',_cardTapHandler);
  w.addEventListener('pointerup',_cardTapHandler);
  w.addEventListener('touchend',function(e){
    if(e.changedTouches&&e.changedTouches[0]){
      const dx=Math.abs(e.changedTouches[0].clientX-_touchStartX);
      const dy=Math.abs(e.changedTouches[0].clientY-_touchStartY);
      if(dx>10||dy>10)return;
    }
    _cardTapHandler(e);
  });

  return w;
}