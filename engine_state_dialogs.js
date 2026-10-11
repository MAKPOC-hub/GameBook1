// engine_state_dialogs.js
// v1.0.12 (текущая)
// Проект: GameBook1
// Функция: универсальные модальные окна — подтверждение покупки, подтверждение опасного действия, информационное окно, окно «Мешок полон», окно принудительной выдачи ключевого предмета, окно результата броска с кубиком, окно находки, окно полученных предметов
// Изменение: заголовок в окне результата броска теперь — случайная фраза из списка (10 для успеха, 9 для неудачи). Одна фраза не выпадает дважды подряд. При ничьей показываются два кубика с одинаковым значением

'use strict';

/* ===== Фразы для окна результата броска =====
   Случайно выбираются в заголовок окна результата. Одна и та же фраза
   не выпадает дважды подряд — храним индекс последней выпавшей.
   Списки независимы: успех и неудача не влияют друг на друга. */
const ROLL_SUCCESS_PHRASES=[
  'Бинго!',
  'Отличный бросок!',
  'Удача!',
  'Ловкость рук!',
  'С блеском!',
  'Легко!',
  'Идеально!',
  'Превосходно!',
  'Судьба улыбнулась!',
  'Кубик на твоей стороне!'
];
const ROLL_FAIL_PHRASES=[
  'Не вышло.',
  'Не в этот раз.',
  'Увы.',
  'Не сработало.',
  'Провал.',
  'Не повезло.',
  'Промах.',
  'Судьба отвернулась.',
  'Кость упала не той стороной.'
];
let _lastSuccessIdx=-1;
let _lastFailIdx=-1;

/* ===== Выбор случайной фразы без мгновенного повтора =====
   Из списка исключается индекс последней выпавшей фразы, из оставшихся
   берётся случайная. Если список пуст (теоретически невозможно) — возврат
   пустой строки, чтобы окно не сломалось. */
function _pickSuccessPhrase(){
  const list=ROLL_SUCCESS_PHRASES;
  if(!list.length)return '';
  const candidates=list.filter(function(_,i){return i!==_lastSuccessIdx;});
  const pick=candidates[Math.floor(Math.random()*candidates.length)];
  _lastSuccessIdx=list.indexOf(pick);
  return pick;
}
function _pickFailPhrase(){
  const list=ROLL_FAIL_PHRASES;
  if(!list.length)return '';
  const candidates=list.filter(function(_,i){return i!==_lastFailIdx;});
  const pick=candidates[Math.floor(Math.random()*candidates.length)];
  _lastFailIdx=list.indexOf(pick);
  return pick;
}

/* ===== Инжект стилей для окна результата броска ===== */
(function _injectRollStyles(){
  if(document.getElementById('zl-roll-styles'))return;
  const st=document.createElement('style');
  st.id='zl-roll-styles';
  st.textContent=
  '.rollres-title{text-align:center;font-variant:small-caps;letter-spacing:8px;font-size:calc(22px*var(--fz));font-weight:700;margin:8px 0 4px;text-shadow:0 2px 6px rgba(0,0,0,.7),0 0 14px currentColor;padding-left:8px}'
  +'.rollres-dice{display:flex;justify-content:center;gap:12px;margin:6px 0 10px}'
  +'.rollres-dice svg{width:130px;height:130px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.55))}'
  +'.rollres-dice-two svg{width:100px;height:100px}'
  +'.rollres-text{text-align:center;font-size:calc(15px*var(--fz));line-height:1.55;margin:8px 0}'
  +'.rollres-text b{color:#ffe9a0}'
  +'.itemrow{display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:12px;margin:8px 0 12px}'
  +'.itemrow .itemcell{width:88px;flex:0 0 auto;text-align:center}'
  +'.btn-acc{background:linear-gradient(#8fae62,#6d8c4a)!important;border-color:#b8d494!important;color:#10160c!important;font-weight:700}'
  +'.received-item{border-bottom:1px solid rgba(122,90,56,.35);padding-bottom:14px;margin-bottom:14px}'
  +'.received-item:last-of-type{border-bottom:none;padding-bottom:0}'
  +'.received-item .det-preview{margin:0 0 8px}'
  +'.received-item .det-preview .gbp{width:130px}'
  +'.received-name{text-align:center;font-weight:700;color:#ffe9a0;font-size:calc(17px*var(--fz));margin-bottom:6px}'
  +'.received-desc{text-align:center;font-size:calc(14px*var(--fz));line-height:1.5;opacity:.92;color:#e9dfc5}';
  document.head.appendChild(st);
})();

/* ===== Рисунок кубика, лежащего на столе =====
   Кубик нарисован в изометрии. Видны все три грани: верхняя с точками
   (выпавшее число), левая боковая и правая боковая. Левая освещена,
   правая в тени — между гранями хороший контраст, объём читается.
   Точки на верхней грани разложены по сетке 3×3 с учётом изометрии.
   ↙️ Используется в: showRollResult (в этом же файле) */
function _rollDiceFaceSVG(value){
  const schemes={
    1:[5],
    2:[3,7],
    3:[3,5,7],
    4:[1,3,7,9],
    5:[1,3,5,7,9],
    6:[1,3,4,6,7,9]
  };
  const positions=[
    [0.2,0.2],[0.5,0.2],[0.8,0.2],
    [0.2,0.5],[0.5,0.5],[0.8,0.5],
    [0.2,0.8],[0.5,0.8],[0.8,0.8]
  ];
  const v=Math.max(1,Math.min(6,parseInt(value,10)||1));
  const list=schemes[v];
  let dotsSvg='';
  list.forEach(function(n){
    const p=positions[n-1];
    const u=p[0], vv=p[1];
    const sx=50+(u-vv)*36;
    const sy=42+(u+vv-1)*20;
    dotsSvg+='<circle cx="'+sx.toFixed(1)+'" cy="'+sy.toFixed(1)+'" r="3" fill="#2f2417"/>';
    dotsSvg+='<circle cx="'+(sx-0.8).toFixed(1)+'" cy="'+(sy-0.8).toFixed(1)+'" r="1" fill="#6a5a40" opacity="0.65"/>';
  });
  return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    +'<ellipse cx="50" cy="91" rx="34" ry="4" fill="rgba(0,0,0,.5)"/>'
    +'<polygon points="14,42 50,62 50,86 14,66" fill="#c9a86a" stroke="#3a2410" stroke-width="1.4" stroke-linejoin="round"/>'
    +'<polygon points="50,62 86,42 86,66 50,86" fill="#7a5a2a" stroke="#3a2410" stroke-width="1.4" stroke-linejoin="round"/>'
    +'<polygon points="50,22 86,42 50,62 14,42" fill="#f7ead0" stroke="#3a2410" stroke-width="1.4" stroke-linejoin="round"/>'
    +'<polygon points="50,26 81,42 50,58 19,42" fill="none" stroke="#d9c08a" stroke-width="0.8" opacity="0.7"/>'
    +'<path d="M18 44 L18 64 M22 66 L22 82" stroke="#e0c898" stroke-width="0.6" opacity="0.4" fill="none"/>'
    +'<path d="M82 44 L82 64 M78 66 L78 82" stroke="#4a3420" stroke-width="0.6" opacity="0.5" fill="none"/>'
    +dotsSvg
    +'</svg>';
}

/* ===== Окно результата броска =====
   Заголовок: для успеха и неудачи — случайная фраза из списка (без
   мгновенного повтора), для ничьей — слово «НИЧЬЯ».
   Кубик: при ничьей показываются два кубика с одинаковым значением —
   визуально это означает, что обе стороны выбросили одно и то же.
   Текст под кубиком приходит снаружи и уже не содержит слов успех/неудача.
   ↙️ Используется в: engine_story_special.js (_showRollOutcome) */
function showRollResult(opts,onClose){
  const old=document.getElementById('rollresult');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='rollresult';
  const outcome=(opts&&opts.outcome)||'tie';
  const diceValue=(opts&&opts.dice)||1;
  const text=(opts&&opts.text)||'';
  let titleText='',titleColor='',borderColor='';
  if(outcome==='win'){
    titleText=_pickSuccessPhrase();
    titleColor='#a8f08a';borderColor='#8fe08a';
  }else if(outcome==='lose'){
    titleText=_pickFailPhrase();
    titleColor='#ff9a85';borderColor='#c96a5a';
  }else{
    titleText='НИЧЬЯ';
    titleColor='#ffe07a';borderColor='#e8c76a';
  }
  let diceHTML='';
  if(outcome==='tie'){
    const d1=diceValue;
    const d2=(opts&&typeof opts.dice2==='number')?opts.dice2:diceValue;
    diceHTML='<div class="rollres-dice rollres-dice-two">'+_rollDiceFaceSVG(d1)+_rollDiceFaceSVG(d2)+'</div>';
  }else{
    diceHTML='<div class="rollres-dice">'+_rollDiceFaceSVG(diceValue)+'</div>';
  }
  ov.innerHTML='<div class="invbox detbox" style="max-width:400px;border-color:'+borderColor+';box-shadow:0 0 20px rgba(0,0,0,.6),inset 0 0 20px rgba(0,0,0,.25)">'
    +'<div class="rollres-title" style="color:'+titleColor+'">'+titleText+'</div>'
    +diceHTML
    +'<div class="rollres-text">'+text+'</div>'
    +'<div style="display:flex;justify-content:center;margin-top:16px">'
    +'<button class="btn btn-acc" id="rr_ok">Далее</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    if(typeof onClose==='function')onClose();
  }
  ov.querySelector('#rr_ok').addEventListener('click',close);
}
window.showRollResult=showRollResult;

/* ===== Окно полученных предметов =====
   ↙️ Используется в: engine_story_special.js (play — блок c.pick) */
function showItemsReceived(items,gold,onClose){
  const old=document.getElementById('itemsreceived');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='itemsreceived';

  let body='<h3>Получено</h3>';
  items.forEach(function(id){
    const info=(ITEMS&&ITEMS[id])?ITEMS[id]:{n:String(id),d:''};
    const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(id):null;
    let preview='';
    if(a){
      preview='<div class="det-preview"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div></div>';
    }else{
      preview='<div class="det-preview"><div class="gbp" style="width:130px"><div class="gbp-art" style="font-size:52px;color:#e9dfc5">'+info.n.charAt(0)+'</div></div></div>';
    }
    body+='<div class="received-item">'
      +preview
      +'<div class="received-name">'+info.n+'</div>'
      +'<div class="received-desc">'+info.d+'</div>'
      +'</div>';
  });
  if(gold){
    body+='<div style="text-align:center;font-weight:700;color:#ffe9a0;font-size:calc(15px*var(--fz));margin-top:6px">+'+gold+' золотых</div>';
  }
  body+='<div style="display:flex;justify-content:center;margin-top:16px">'
    +'<button class="btn btn-acc" id="ir_ok">Далее</button>'
    +'</div>';

  ov.innerHTML='<div class="invbox detbox" style="max-width:420px">'+body+'</div>';
  document.body.appendChild(ov);
  function close(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    if(typeof onClose==='function')onClose();
  }
  ov.querySelector('#ir_ok').addEventListener('click',close);
}
window.showItemsReceived=showItemsReceived;

/* ===== Универсальное подтверждение опасного действия =====
   ↘️ Опции: okAccent — зелёная кнопка подтверждения; reverse — обратный
   порядок кнопок (отмена слева, подтверждение справа).
   ↙️ Используется в: engine_render_inventory.js (кнопка «Выкинуть»),
      showForceGetDialog (выбор предмета для замены в этом же файле),
      engine_checkpoints_logic.js (goBack — шаг назад) */
function confirmAction(title,text,okLabel,onConfirm,opts){
  const old=document.getElementById('actionconfirm');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const options=opts||{};
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='actionconfirm';
  ov.style.zIndex='60';
  let okStyle='',noStyle='';
  if(options.okAccent){
    okStyle='';noStyle='';
  }else{
    okStyle='background:linear-gradient(#8a3a3a,#6a2020);border-color:#c96a5a;color:#ffd6cd;font-weight:700';
    noStyle='';
  }
  const okClass=options.okAccent?'btn btn-acc':'btn';
  const noClass=options.okAccent?'btn':'btn btn-acc';
  const okBtn='<button class="'+okClass+'" id="ac_yes" '+(okStyle?'style="'+okStyle+'"':'')+'>'+(okLabel||'Да')+'</button>';
  const noBtn='<button class="'+noClass+'" id="ac_no" '+(noStyle?'style="'+noStyle+'"':'')+'>Отмена</button>';
  const innerButtons=options.reverse?(noBtn+okBtn):(okBtn+noBtn);
  ov.innerHTML='<div class="invbox detbox" style="max-width:380px">'
    +'<h3 style="margin-bottom:10px">'+title+'</h3>'
    +'<div style="text-align:center;font-size:15px;line-height:1.5;margin:10px 0">'+text+'</div>'
    +'<div style="display:flex;justify-content:center;align-items:center;gap:16px;margin-top:16px;flex-wrap:wrap">'
    +innerButtons
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);}
  ov.querySelector('#ac_yes').addEventListener('click',function(){
    close();
    if(typeof onConfirm==='function')onConfirm();
  });
  ov.querySelector('#ac_no').addEventListener('click',close);
}
window.confirmAction=confirmAction;

/* ===== Покупка ячейки мешка из окна переполнения ===== */
function _tryBuySlotFromOverflow(){
  const COST=3;
  const MAXEXT=5;
  if((S.bagExt||0)>=MAXEXT){toast('Все премиум-ячейки уже открыты');return false;}
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  if(cur<COST){toast('Не хватает осколков: нужно '+COST+', у вас '+cur);return false;}
  function doPurchase(){
    if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(COST)){
      toast('Не удалось списать осколки');return;
    }
    S.bagExt=(S.bagExt||0)+1;
    save();
    toast('Новая ячейка мешка открыта! (−'+COST+' осколка)');
    const pk=document.getElementById('pickupresult');
    if(pk&&pk.parentNode)pk.parentNode.removeChild(pk);
    const bf=document.getElementById('bagfulldialog');
    if(bf&&bf.parentNode)bf.parentNode.removeChild(bf);
    const fg=document.getElementById('forcegetdialog');
    if(fg&&fg.parentNode)fg.parentNode.removeChild(fg);
    if(typeof render==='function')render();
    if(typeof renderQuickbar==='function')renderQuickbar();
  }
  if(typeof window.confirmBuy==='function'){
    window.confirmBuy('ячейка мешка', COST, doPurchase);
    return true;
  }
  doPurchase();
  return true;
}

/* ===== Окно находки, когда места в мешке не хватает ===== */
function showPickupResult(items,free,onBack,onContinue){
  const old=document.getElementById('pickupresult');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='pickupresult';

  function _itemCardHTML(id,willFit){
    const info=ITEMS[id]||{n:String(id)};
    const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(id):null;
    let inner='';
    if(a){
      inner='<div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div>';
    }else{
      inner='<div class="gbp"><div class="gbp-art" style="font-size:36px;color:#e9dfc5">'+info.n.charAt(0)+'</div></div>';
    }
    return '<div class="itemcell" style="opacity:'+(willFit?1:.45)+'">'
      +inner
      +'<div style="font-size:12px;color:#e9dfc5;margin-top:4px;line-height:1.2">'+info.n+'</div>'
      +'</div>';
  }

  let grid='<div class="itemrow">';
  items.forEach(function(id,i){
    grid+=_itemCardHTML(id,i<free);
  });
  grid+='</div>';

  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  const canBuy=((S.bagExt||0)<5)&&(cur>=3);
  const adIconFn=window.adIcon||function(){return '';};
  const buyBlock=canBuy
    ? '<div style="text-align:center;margin-top:10px"><button class="btn" id="pk_buy">Купить ячейку мешка — '+adIconFn(18)+' 3</button></div>'
    : '<div style="text-align:center;font-size:12px;opacity:.7;margin-top:10px">Для покупки ячейки нужно 3 осколка. У вас: '+cur+'.</div>';

  ov.innerHTML='<div class="invbox detbox" style="max-width:420px">'
    +'<h3 style="margin-bottom:4px">Мешок полон</h3>'
    +grid
    +'<div style="text-align:center;font-size:14px;line-height:1.5;margin:6px 0 4px">'
    +'В мешке не хватает места для всей находки.'
    +'<div class="hgap"></div>'
    +'Лучше вернуться, освободить место или купить ячейку — и взять находку снова.'
    +'</div>'
    +buyBlock
    +'<div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap">'
    +'<button class="btn btn-acc" id="pk_back">Назад</button>'
    +'<button class="btn" id="pk_cont">Продолжить</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);}
  ov.querySelector('#pk_back').addEventListener('click',function(){
    close();
    if(typeof onBack==='function')onBack();
  });
  ov.querySelector('#pk_cont').addEventListener('click',function(){
    close();
    if(typeof onContinue==='function')onContinue();
  });
  const buy=ov.querySelector('#pk_buy');
  if(buy){
    buy.addEventListener('click',function(){
      _tryBuySlotFromOverflow();
    });
  }
}
window.showPickupResult=showPickupResult;

/* ===== Универсальный диалог подтверждения покупки ===== */
function confirmBuy(name, cost, onConfirm){
  const old=document.getElementById('buyconfirm');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='buyconfirm';
  const adIconFn=window.adIcon||function(){return '';};
  ov.innerHTML='<div class="invbox detbox" style="max-width:380px">'
    +'<h3 style="margin-bottom:10px">Подтверждение покупки</h3>'
    +'<div style="text-align:center;font-size:16px;line-height:1.5;margin:10px 0;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px">'
    +'<span>Купить <b style="color:#ffe9a0">'+name+'</b> за</span>'
    +'<span style="display:inline-flex;align-items:center;gap:4px;vertical-align:middle">'
    +adIconFn(22)+' <b style="color:#ffd97a">'+cost+'</b>'
    +'</span>'
    +'<span>?</span>'
    +'</div>'
    +'<div style="display:flex;justify-content:center;align-items:center;gap:16px;margin-top:16px">'
    +'<button class="btn btn-acc" id="buyc_yes">Купить</button>'
    +'<button class="btn" id="buyc_no">Отмена</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);}
  ov.querySelector('#buyc_yes').addEventListener('click',function(){
    close();
    if(typeof onConfirm==='function')onConfirm();
  });
  ov.querySelector('#buyc_no').addEventListener('click',close);
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
}
window.confirmBuy=confirmBuy;

/* ===== Универсальное информационное окно ===== */
function showInfo(text, onClose){
  const old=document.getElementById('infodialog');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='infodialog';
  ov.innerHTML='<div class="invbox detbox" style="max-width:380px">'
    +'<div style="text-align:center;font-size:16px;line-height:1.55;margin:10px 0">'+text+'</div>'
    +'<div style="display:flex;justify-content:center;margin-top:16px">'
    +'<button class="btn btn-acc" id="info_ok">Далее</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    if(typeof onClose==='function')onClose();
  }
  ov.querySelector('#info_ok').addEventListener('click',close);
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
}
window.showInfo=showInfo;

/* ===== Окно «Мешок полон» (одиночный предмет) ===== */
function showBagFullDialog(itemId, onBack, onContinue){
  const old=document.getElementById('bagfulldialog');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='bagfulldialog';
  const info=(ITEMS&&ITEMS[itemId])?ITEMS[itemId]:{n:'Предмет'};
  const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(itemId):null;
  let preview='';
  if(a){
    preview='<div style="display:flex;justify-content:center;margin:4px 0 12px"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+';width:110px"><div class="gbp-art">'+a.art+'</div></div></div>';
  }
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  const adIconFn=window.adIcon||function(){return '';};
  const canBuy=((S.bagExt||0)<5)&&(cur>=3);
  const buyBlock=canBuy
    ? '<div style="text-align:center;margin-top:10px"><button class="btn" id="bagf_buy">Купить ячейку мешка — '+adIconFn(18)+' 3</button></div>'
    : '<div style="text-align:center;font-size:12px;opacity:.7;margin-top:10px">Для покупки ячейки нужно 3 осколка. У вас: '+cur+'.</div>';
  ov.innerHTML='<div class="invbox detbox" style="max-width:380px">'
    +'<h3 style="margin-bottom:6px">Мешок полон</h3>'
    +preview
    +'<div style="text-align:center;font-size:15px;line-height:1.5;margin:8px 0">'
    +'<b style="color:#ffe9a0">'+info.n+'</b> не может добавиться в инвентарь.'
    +'<div class="hgap"></div>Лучше вернуться, освободить место или купить ячейку — и взять предмет снова.'
    +'</div>'
    +buyBlock
    +'<div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap">'
    +'<button class="btn btn-acc" id="bagf_back">Назад</button>'
    +'<button class="btn" id="bagf_cont">Продолжить</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);}
  ov.querySelector('#bagf_back').addEventListener('click',function(){
    close();
    if(typeof onBack==='function')onBack();
  });
  ov.querySelector('#bagf_cont').addEventListener('click',function(){
    close();
    if(typeof onContinue==='function')onContinue();
  });
  const buy=ov.querySelector('#bagf_buy');
  if(buy){
    buy.addEventListener('click',function(){
      _tryBuySlotFromOverflow();
    });
  }
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
}
window.showBagFullDialog=showBagFullDialog;

/* ===== Окно принудительной выдачи ключевого предмета ===== */
function showForceGetDialog(itemId, onContinue){
  const old=document.getElementById('forcegetdialog');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='forcegetdialog';
  const info=(ITEMS&&ITEMS[itemId])?ITEMS[itemId]:{n:'Предмет'};
  const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(itemId):null;
  const adIconFn=window.adIcon||function(){return '';};
  let preview='';
  if(a){
    preview='<div style="display:flex;justify-content:center;margin:4px 0 12px"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+';width:110px"><div class="gbp-art">'+a.art+'</div></div></div>';
  }
  function isProtected(id){return id.indexOf('punch_')===0;}
  function buildBody(){
    const cells=[];
    S.inv.forEach(function(id){cells.push(id);});
    let grid='<div class="itemrow">';
    cells.forEach(function(id){
      const ii=ITEMS[id]||{n:'?'};
      const aa=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(id):null;
      const prot=isProtected(id);
      let inner='';
      if(aa){
        inner='<div class="gbp" style="--cbg:'+aa.bg+';--cbr:'+aa.br+'"><div class="gbp-art">'+aa.art+'</div></div>';
      }else{
        inner='<div class="gbp"><div class="gbp-art" style="font-size:40px;color:#e9dfc5">'+ii.n.charAt(0)+'</div></div>';
      }
      grid+='<div class="itemcell" data-drop="'+id+'" style="'+(prot?'opacity:.55;cursor:not-allowed;':'cursor:pointer;')+'">'
        +inner
        +'<div class="bcell-name" style="position:static;margin-top:4px;background:linear-gradient(#f6ead0,#e6d2a8);border:2px solid #5b422a;border-radius:6px;padding:2px 4px;color:#2f2417;font-size:11px;font-weight:700;line-height:1.15;text-align:center">'+ii.n+'</div>'
        +'</div>';
    });
    grid+='</div>';
    const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
    const canBuySlot=((S.bagExt||0)<5)&&(cur>=3);
    return '<h3 style="margin-bottom:6px">Тебе нужен этот предмет</h3>'
      +preview
      +'<div style="text-align:center;font-size:15px;line-height:1.5;margin:8px 0">'
      +'<b style="color:#ffe9a0">'+info.n+'</b> — ключевой предмет. Он нужен для истории и не может быть потерян.'
      +'<div class="hgap"></div>Мешок полон. Выбрось один предмет, чтобы взять <b>'+info.n+'</b>.'
      +'</div>'
      +grid
      +(canBuySlot
        ?'<div style="text-align:center;margin-top:12px"><button class="btn adbtn" id="fg_buyslot"><span>Купить ячейку за</span>'+adIconFn(18)+' <b>3</b></button></div>'
        :'')
      +'<div style="text-align:center;font-size:12px;opacity:.7;margin-top:10px">Перфокарты выбрасывать нельзя — они нужны для головоломки в шахтах.</div>';
  }
  ov.innerHTML='<div class="invbox detbox" style="max-width:460px">'+buildBody()+'</div>';
  document.body.appendChild(ov);
  function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);}
  function bindEvents(){
    ov.querySelectorAll('.itemcell').forEach(function(el){
      if(el.style.cursor!=='pointer')return;
      el.addEventListener('click',function(){
        const id=el.getAttribute('data-drop');
        const idx=S.inv.indexOf(id);
        if(idx<0)return;
        const dropName=ITEMS[id]?ITEMS[id].n:id;
        confirmAction(
          'Выбросить предмет?',
          '<b style="color:#ffe9a0">'+dropName+'</b> исчезнет из мешка навсегда. Его место займёт <b>'+info.n+'</b>.',
          'Да, выбросить',
          function(){
            S.inv.splice(idx,1);
            S.inv.push(itemId);
            recalcMaxHp();
            save();
            if(typeof window.updateHudCurrencies==='function')window.updateHudCurrencies();
            close();
            toast('Выброшено: '+dropName+'. Получено: '+info.n);
            if(typeof onContinue==='function')onContinue();
          }
        );
      });
    });
    const buy=ov.querySelector('#fg_buyslot');
    if(buy){
      buy.addEventListener('click',function(){
        if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(3)){
          toast('Не удалось списать осколки');return;
        }
        S.bagExt=(S.bagExt||0)+1;
        S.inv.push(itemId);
        recalcMaxHp();
        save();
        close();
        toast('Новая ячейка открыта. Получено: '+info.n);
        if(typeof onContinue==='function')onContinue();
      });
    }
  }
  bindEvents();
}
window.showForceGetDialog=showForceGetDialog;