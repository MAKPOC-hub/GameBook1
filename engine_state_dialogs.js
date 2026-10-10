// engine_state_dialogs.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: универсальные модальные окна — подтверждение покупки, информационное окно, окно «Мешок полон», окно принудительной выдачи ключевого предмета
// Изменение: добавлена функция showForceGetDialog — окно для выдачи ключевого сюжетного предмета, когда мешок полон. Игрок выбирает, что выбросить, или покупает ячейку. Окно нельзя закрыть, не сделав выбор

'use strict';

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
   Показывается, когда игрок получает предмет, но в мешке нет места.
   Две кнопки:
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
  function rebuild(){
    ov.querySelector('.invbox').innerHTML=buildBody();
    bindEvents();
  }
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