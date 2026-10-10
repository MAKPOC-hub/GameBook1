// engine_state_dialogs.js
// v1.0.3 -> v1.0.4
// Проект: GameBook1
// Функция: универсальные модальные окна — подтверждение покупки, информационное окно, окно «Мешок полон», окно принудительной выдачи ключевого предмета, окно результата броска с кубиком, окно результата находки
// Изменение: добавлена функция showPickupResult — окно, которое показывает, какие предметы из находки поместились в мешок, а какие нет. Раньше непоместившийся предмет обозначался коротким всплывающим сообщением, которое исчезало через 2 секунды и легко пропускалось. Теперь это отдельное окно с кнопкой «Далее» — игрок обязательно увидит, что было получено, а что осталось

'use strict';

/* ===== Инжект стилей для окна результата броска ===== */
(function _injectRollStyles(){
  if(document.getElementById('zl-roll-styles'))return;
  const st=document.createElement('style');
  st.id='zl-roll-styles';
  st.textContent=
  '.rollres-title{text-align:center;font-variant:small-caps;letter-spacing:8px;font-size:calc(22px*var(--fz));font-weight:700;margin:8px 0 4px;text-shadow:0 2px 6px rgba(0,0,0,.7),0 0 14px currentColor;padding-left:8px}'
  +'.rollres-dice{display:flex;justify-content:center;margin:6px 0 10px}'
  +'.rollres-dice svg{width:130px;height:130px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.55))}'
  +'.rollres-text{text-align:center;font-size:calc(15px*var(--fz));line-height:1.55;margin:8px 0}'
  +'.rollres-text b{color:#ffe9a0}';
  document.head.appendChild(st);
})();

/* ===== Рисунок кубика, лежащего на столе =====
   Кубик нарисован в изометрии: видна верхняя грань с точками (та цифра,
   которая выпала) и две боковые грани. Под кубиком — небольшая тень.
   Схема точек на гранях — как у настоящего кубика.
   ↙️ Используется в: showRollResult (в этом же файле) */
function _rollDiceFaceSVG(value){
  const dots={
    1:[[1,1]],
    2:[[0,0],[2,2]],
    3:[[0,0],[1,1],[2,2]],
    4:[[0,0],[2,0],[0,2],[2,2]],
    5:[[0,0],[2,0],[1,1],[0,2],[2,2]],
    6:[[0,0],[0,1],[0,2],[2,0],[2,1],[2,2]]
  };
  const v=Math.max(1,Math.min(6,parseInt(value,10)||1));
  const arr=dots[v];
  const scale=0.55;
  let dotsSvg='';
  arr.forEach(function(d){
    const u=(d[0]-1)*scale;
    const vv=(d[1]-1)*scale;
    const sx=50+(u-vv)*17.5;
    const sy=45+(u+vv)*10;
    dotsSvg+='<circle cx="'+sx.toFixed(1)+'" cy="'+sy.toFixed(1)+'" r="2.6" fill="#2f2417"/>';
  });
  return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    +'<ellipse cx="50" cy="87" rx="40" ry="6" fill="rgba(0,0,0,.45)"/>'
    +'<polygon points="15,45 50,65 50,86 15,66" fill="#d9c08a" stroke="#5b422a" stroke-width="1.5" stroke-linejoin="round"/>'
    +'<polygon points="50,65 85,45 85,66 50,86" fill="#a88a55" stroke="#5b422a" stroke-width="1.5" stroke-linejoin="round"/>'
    +'<polygon points="50,25 85,45 50,65 15,45" fill="#f7ead0" stroke="#5b422a" stroke-width="1.5" stroke-linejoin="round"/>'
    +'<polygon points="50,29 81,45 50,61 19,45" fill="none" stroke="#c8a868" stroke-width=".8" opacity=".6"/>'
    +dotsSvg
    +'</svg>';
}

/* ===== Окно результата броска =====
   Показывает лежащий кубик с выпавшей гранью, крупный заголовок
   «УСПЕХ» / «НЕУДАЧА» / «НИЧЬЯ» и текст исхода. Рамка окна окрашена
   по результату: зелёная, красная или жёлтая.
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
  if(outcome==='win'){titleText='УСПЕХ';titleColor='#a8f08a';borderColor='#8fe08a';}
  else if(outcome==='lose'){titleText='НЕУДАЧА';titleColor='#ff9a85';borderColor='#c96a5a';}
  else{titleText='НИЧЬЯ';titleColor='#ffe07a';borderColor='#e8c76a';}
  ov.innerHTML='<div class="invbox detbox" style="max-width:400px;border-color:'+borderColor+';box-shadow:0 0 20px rgba(0,0,0,.6),inset 0 0 20px rgba(0,0,0,.25)">'
    +'<div class="rollres-title" style="color:'+titleColor+'">'+titleText+'</div>'
    +'<div class="rollres-dice">'+_rollDiceFaceSVG(diceValue)+'</div>'
    +'<div class="rollres-text">'+text+'</div>'
    +'<div style="display:flex;justify-content:center;margin-top:16px">'
    +'<button class="btn" id="rr_ok" style="background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c">Далее</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    if(typeof onClose==='function')onClose();
  }
  ov.querySelector('#rr_ok').addEventListener('click',close);
  /* Клик по фону НЕ закрывает окно результата броска — игрок должен
     осознанно нажать «Далее», иначе он не увидит текст исхода. */
}
window.showRollResult=showRollResult;

/* ===== Окно результата находки =====
   Показывается после того, как игрок взял предметы из узла. В верхней
   части — то, что поместилось в мешок. В нижней (если есть) — то, что
   не поместилось: такие предметы остаются на месте и не переходят
   к игроку. Игрок нажимает «Далее», чтобы продолжить путь.
   ↘️ Альтернатива, когда совсем нет места: showBagFullDialog (в этом же файле)
   ↙️ Используется в: engine_story_special.js (play — блок c.pick) */
function showPickupResult(gotItems,lostItems,onClose){
  const old=document.getElementById('pickupresult');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='pickupresult';

  function _itemCardHTML(id,opacity){
    const info=ITEMS[id]||{n:String(id)};
    const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(id):null;
    let inner='';
    if(a){
      inner='<div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+'"><div class="gbp-art">'+a.art+'</div></div>';
    }else{
      inner='<div class="gbp"><div class="gbp-art" style="font-size:36px;color:#e9dfc5">'+info.n.charAt(0)+'</div></div>';
    }
    return '<div style="text-align:center;opacity:'+(opacity||1)+'">'
      +inner
      +'<div style="font-size:12px;color:#e9dfc5;margin-top:4px;line-height:1.2">'+info.n+'</div>'
      +'</div>';
  }
  function _grid(items,opacity){
    let h='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px;margin:6px 0 10px">';
    items.forEach(function(id){h+=_itemCardHTML(id,opacity);});
    h+='</div>';
    return h;
  }

  let body='<h3 style="margin-bottom:4px">Из мешка</h3>';
  if(gotItems&&gotItems.length){
    body+='<div style="text-align:center;font-size:14px;color:#c9e8a8;letter-spacing:1px;margin-top:6px">Получено</div>';
    body+=_grid(gotItems,1);
  }
  if(lostItems&&lostItems.length){
    body+='<div style="text-align:center;font-size:14px;color:#e8b0a0;letter-spacing:1px;margin-top:10px">Не поместилось</div>';
    body+=_grid(lostItems,.55);
    body+='<div style="text-align:center;font-size:12.5px;line-height:1.4;color:#e9dfc5;opacity:.8;margin:4px 0 8px">'
      +'Эти предметы остались на месте. Освободите место в мешке или купите ячейку — и сможете забрать их в следующий раз.'
      +'</div>';
  }
  body+='<div style="display:flex;justify-content:center;margin-top:14px">'
    +'<button class="btn" id="pk_ok" style="background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c">Далее</button>'
    +'</div>';

  ov.innerHTML='<div class="invbox detbox" style="max-width:420px">'+body+'</div>';
  document.body.appendChild(ov);
  function close(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    if(typeof onClose==='function')onClose();
  }
  ov.querySelector('#pk_ok').addEventListener('click',close);
  /* Клик по фону не закрывает окно — игрок должен нажать «Далее». */
}
window.showPickupResult=showPickupResult;

/* ===== Универсальный диалог подтверждения покупки =====
   ↗️ adIcon — в: settings.js
   ↙️ Используется в: engine_state_cooldown.js, engine_render_quickbar.js, engine_render_inventory.js, engine_render_start_item.js, settings.js, cardbacks.js */
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
    +'<button class="btn" id="buyc_yes" style="background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c">Купить</button>'
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

/* ===== Универсальное информационное окно =====
   Показывает текст + кнопку «Далее». Игрок читает и сам закрывает.
   ↙️ Используется в: engine_story_special.js (play — при c.toastMsg) */
function showInfo(text, onClose){
  const old=document.getElementById('infodialog');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='infodialog';
  ov.innerHTML='<div class="invbox detbox" style="max-width:380px">'
    +'<div style="text-align:center;font-size:16px;line-height:1.55;margin:10px 0">'+text+'</div>'
    +'<div style="display:flex;justify-content:center;margin-top:16px">'
    +'<button class="btn" id="info_ok" style="background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c">Далее</button>'
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

/* ===== Окно «Мешок полон» =====
   Показывается, когда игрок получает предмет, но в мешке нет места совсем
   (ни одного свободного слота). Две кнопки:
   — «Назад»: закрыть окно и остаться на текущем узле. Игрок может открыть
     мешок, купить ячейку, потом снова нажать карту находки.
   — «Продолжить»: закрыть окно и продолжить путь без предмета.
   ↗️ ITEMS, ItemCards — в: engine_data_items.js, itemcards_export.js
   ↙️ Используется в: engine_story_special.js (play — ветки pick и checkTake),
      engine_checkpoints_logic.js (обёртка go — авто-выдача при autoGet) */
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
  ov.innerHTML='<div class="invbox detbox" style="max-width:380px">'
    +'<h3 style="margin-bottom:6px">Мешок полон</h3>'
    +preview
    +'<div style="text-align:center;font-size:15px;line-height:1.5;margin:8px 0">'
    +'<b style="color:#ffe9a0">'+info.n+'</b> не может добавиться в инвентарь.'
    +'<div class="hgap"></div>Чтобы получить предмет, освободите место в мешке.'
    +'</div>'
    +'<div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap">'
    +'<button class="btn" id="bagf_back">Назад</button>'
    +'<button class="btn" id="bagf_cont" style="background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c">Продолжить</button>'
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
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
}
window.showBagFullDialog=showBagFullDialog;

/* ===== Окно принудительной выдачи ключевого предмета =====
   Показывается, когда игрок вошёл на узел с forceGet, но мешок полон.
   В отличие от showBagFullDialog, окно нельзя закрыть, не сделав выбор.
   Игрок либо выбрасывает один предмет (тогда ключевой занимает его место),
   либо покупает ячейку за 3 осколка (тогда ключевой кладётся в новую).
   Перфокарты выбрасывать нельзя — они нужны для головоломки в главе 2.
   ↗️ ITEMS, ItemCards — в: engine_data_items.js, itemcards_export.js
   ↗️ getAdCoins, spendAdCoins — в: settings.js
   ↙️ Используется в: engine_checkpoints_logic.js (обёртка go — ветка forceGet) */
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
  function isProtected(id){
    return id.indexOf('punch_')===0;
  }
  function buildBody(){
    const cells=[];
    S.inv.forEach(function(id){cells.push(id);});
    let grid='';
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
      grid+='<div class="bcell-card'+(prot?' protected':'')+'" data-drop="'+id+'" style="'+(prot?'opacity:.55;cursor:not-allowed;':'')+'">'
        +'<div class="bcc-wrap">'+inner+'<div class="bcell-name">'+ii.n+'</div></div>'
        +'</div>';
    });
    const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
    const maxExt=5;
    const canBuySlot=((S.bagExt||0)<maxExt)&&(cur>=3);
    return '<h3 style="margin-bottom:6px">Тебе нужен этот предмет</h3>'
      +preview
      +'<div style="text-align:center;font-size:15px;line-height:1.5;margin:8px 0">'
      +'<b style="color:#ffe9a0">'+info.n+'</b> — ключевой предмет. Он нужен для истории и не может быть потерян.'
      +'<div class="hgap"></div>Мешок полон. Выбрось один предмет, чтобы взять <b>'+info.n+'</b>.'
      +'</div>'
      +'<div class="baggrid" style="grid-template-columns:repeat(4,1fr)">'+grid+'</div>'
      +(canBuySlot
        ?'<div style="text-align:center;margin-top:12px"><button class="btn adbtn" id="fg_buyslot"><span>Купить ячейку за</span>'+adIconFn(18)+' <b>3</b></button></div>'
        :'')
      +'<div style="text-align:center;font-size:12px;opacity:.7;margin-top:10px">Перфокарты выбрасывать нельзя — они нужны для головоломки в шахтах.</div>';
  }
  ov.innerHTML='<div class="invbox detbox" style="max-width:460px">'+buildBody()+'</div>';
  document.body.appendChild(ov);
  function close(){if(ov.parentNode)ov.parentNode.removeChild(ov);}
  function bindEvents(){
    ov.querySelectorAll('.bcell-card').forEach(function(el){
      if(el.classList.contains('protected'))return;
      el.addEventListener('click',function(){
        const id=el.getAttribute('data-drop');
        const idx=S.inv.indexOf(id);
        if(idx<0)return;
        S.inv.splice(idx,1);
        S.inv.push(itemId);
        recalcMaxHp();
        save();
        if(typeof window.updateAdCoins==='function')window.updateAdCoins();
        close();
        toast('Выброшено: '+(ITEMS[id]?ITEMS[id].n:id)+'. Получено: '+info.n);
        if(typeof onContinue==='function')onContinue();
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