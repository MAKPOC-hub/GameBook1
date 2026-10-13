// engine_story_special.js
// v1.1.19 -> v1.1.20
// Проект: GameBook1
// Функция: специальные сцены и обработка выбора карты — отдых, сон, урон, рестарт, конец главы, возврат к чекпоинту, бросок стартового предмета, галерея стартовых, покупка, финализация карты, главный обработчик выбора
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции play()

'use strict';

const START_ITEMS=['vigor_amulet','vory_knife','flash','compass','lute','horseshoe'];

function showStartItemReceivedWindow(){
  const id=S.startItem;
  if(!id||!ITEMS[id])return;
  const info=ITEMS[id];
  const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(id):null;
  const old=document.getElementById('startitemreceived');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='startitemreceived';
  const adIconFn=window.adIcon||function(){return '';};
  let preview='';
  if(a){
    preview='<div style="display:flex;justify-content:center;margin:4px 0 12px"><div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+';width:160px"><div class="gbp-art">'+a.art+'</div></div></div>';
  }else{
    preview='<div style="text-align:center;font-size:72px;margin:8px 0 12px;color:#e9dfc5">'+info.n.charAt(0)+'</div>';
  }
  ov.innerHTML='<div class="invbox detbox" style="max-width:420px">'
    +'<h3 style="margin-bottom:6px">Тебе досталось</h3>'
    +preview
    +'<div style="text-align:center;font-size:18px;font-weight:700;color:#ffe9a0;margin-bottom:8px">'+info.n+'</div>'
    +'<div class="detd">'+info.d+'</div>'
    +'<div style="display:flex;flex-direction:column;gap:10px;align-items:center;margin-top:16px">'
    +'<button class="btn btn-acc" id="sir_next" style="min-width:220px">Далее</button>'
    +'<button class="btn" id="sir_other" style="min-width:220px">Выбрать любой предмет за '+adIconFn(16)+' 10</button>'
    +'</div>'
    +'</div>';
  document.body.appendChild(ov);
  function close(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
  }
  ov.querySelector('#sir_next').addEventListener('click',function(){
    close();
    go(4);
  });
  ov.querySelector('#sir_other').addEventListener('click',function(){
    close();
    if(typeof window.openStartItemGallery==='function'){
      window.openStartItemGallery();
    }else{
      toast('Галерея недоступна');
    }
  });
}

/* ===== Обмен свистка на два свитка =====
   У торговца в деревне (глава 3, узел 413). Свисток исчезает из мешка,
   в мешок кладутся два свитка — «Исцеление» и «Огненный шар». Если
   свободных слотов нет — открывается окно выбора: взять первый свиток,
   второй, или оба (потребовав освободить место). */
function _tradeWhistleForScrolls(){
  if(!has('silver_whistle')){toast('Нет свистка');return;}
  /* Удаляем свисток. */
  S.inv.splice(S.inv.indexOf('silver_whistle'),1);
  const newItems=['scroll_heal','scroll_fire'];
  const free=invMax()-S.inv.length;
  /* Мест хватает — кладём оба. */
  if(free>=2){
    newItems.forEach(function(id){S.inv.push(id);});
    save();
    if(typeof window.showItemsReceived==='function'){
      window.showItemsReceived(newItems,0,function(){
        render();
      });
    }else{
      toast('Получено: Свиток «Исцеление» и Свиток «Огненный шар»');
      render();
    }
    return;
  }
  /* Места не хватает — показываем окно выбора. */
  if(typeof window.showPickupResult==='function'){
    window.showPickupResult(
      newItems,
      Math.max(0,free),
      function(){render();},
      function(){
        const got=[];
        for(let i=0;i<newItems.length;i++){
          if(S.inv.length<invMax()){
            S.inv.push(newItems[i]);
            got.push(newItems[i]);
          }
        }
        save();
        if(typeof window.showItemsReceived==='function'&&got.length>0){
          window.showItemsReceived(got,0,function(){render();});
        }else{
          render();
        }
      }
    );
    return;
  }
  /* Страховка. */
  for(let i=0;i<newItems.length;i++){
    if(S.inv.length<invMax())S.inv.push(newItems[i]);
  }
  save();
  render();
}

function doSpecial(c){
  if(!c||!c.special)return false;

  if(c.special==='camp'){
    S.hp=Math.min(S.maxhp,S.hp+1);
    toast('Вы отдохнули (+1 сердце)');
    if(c.go){go(c.go);}
    return true;
  }
  if(c.special==='sleep'){
    S.hp=S.maxhp;
    save();
    toast('Вы отдохнули. Силы вернулись.');
    if(c.go){go(c.go);}
    return true;
  }
  if(c.special==='hurt'){
    S.hp--;
    save();
    if(S.hp<=0){
      if(typeof showCheckpointChoice==='function')showCheckpointChoice();
      return true;
    }
    toast('Вы теряете 1 сердце');
    if(c.combat){startCombat(c.combat,c.win,c.flee||0,0,c.lose||0);return true;}
    if(c.go){go(c.go);}
    return true;
  }
  if(c.special==='restart'){
    try{localStorage.removeItem('zl_save');}catch(e){}
    hasSave=false;
    S=newState();
    go(1);
    return true;
  }
  if(c.special==='to_ch2'){
    go(200);
    return true;
  }
  if(c.special==='to_checkpoint'){
    if(typeof showCheckpointChoice==='function')showCheckpointChoice();
    return true;
  }

  /* ===== Обмен свистка =====
     Игрок показывает торговцу серебряный свисток, тот даёт два свитка.
     Свиток «Исцеление» восстанавливает 2 сердца вне боя, свиток
     «Огненный шар» бьёт врага на 2 HP в бою. */
  if(c.special==='tradeWhistle'){
    _tradeWhistleForScrolls();
    return true;
  }

  if(c.special==='takeLukerjaNote'){
    if(typeof window.addNote==='function'){
      window.addNote(
        'parol_lukerja',
        'Пароль от Лукерьи',
        'Сказать охотнику с перевязанной ногой: «Я от Лукерьи».',
        ''
      );
    }
    return false;
  }

  if(c.special==='takeNumber37'){
    let found=false;
    if(S&&Array.isArray(S.notes)){
      for(let i=0;i<S.notes.length;i++){
        if(S.notes[i].id==='mystery_37'){
          S.notes[i].id='number_37';
          S.notes[i].title='Три и семь';
          S.notes[i].text='Число. Где — не помню. Но помню, что важно.';
          found=true;
          break;
        }
      }
    }
    if(!found&&typeof window.addNote==='function'){
      window.addNote(
        'number_37',
        'Три и семь',
        'Число. Где — не помню. Но помню, что важно.',
        ''
      );
    }
    if(typeof save==='function')save();
    return false;
  }

  if(c.special==='takeMirrorNote'){
    if(typeof window.addNote==='function'){
      window.addNote(
        'sign_press_circle',
        'Круг с точкой',
        'Нажать.',
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="32" fill="none" stroke="#5a3a1a" stroke-width="4"/><circle cx="50" cy="50" r="5" fill="#5a3a1a"/></svg>'
      );
    }
    return false;
  }

  if(c.special==='takeMirrorHint'){
    if(typeof window.addNote==='function'){
      window.addNote(
        'hint_mirror',
        'Слабость Жреца',
        'Ордрик боится зеркал. Если показать ему его же лицо — замрёт на один ход.',
        ''
      );
    }
    return false;
  }

  if(c.special==='takeStrazhHint'){
    if(typeof window.addNote==='function'){
      window.addNote(
        'hint_strazh',
        'Тайна Стража',
        'У Стража пусто в груди. Если вставить туда что-то большое и тёплое — он проснётся.',
        ''
      );
    }
    return false;
  }

  if(c.special==='rollStartItem'){
    if(S.flags.startItemRolled){
      if(c.go){go(c.go);}
      return true;
    }
    busy=true;
    const v=Math.floor(Math.random()*6)+1;
    const chosen=START_ITEMS[v-1];
    S.startItem=chosen;
    S.flags.startItemRolled=1;
    S.flags.startItemRolledValue=v;
    if(!has(chosen))S.inv.push(chosen);
    recalcMaxHp();
    S.pendingStartItem=1;
    save();
    showDie(v,function(){
      busy=false;
      S.pendingStartItem=null;
      save();
      render();
      showStartItemReceivedWindow();
    },null,'Бросок '+v+' — '+ITEMS[chosen].n);
    return true;
  }

  if(c.special==='openStartItemGallery'){
    if(typeof window.openStartItemGallery==='function'){
      window.openStartItemGallery();
    }else{
      toast('Галерея недоступна');
    }
    return true;
  }

  return false;
}

function buyItem(c){
  const it=c.buy.item,cost=c.buy.cost;
  if(S.flags['b_'+it]){toast('Уже куплено');return;}
  if(S.gold<cost){toast('Не хватает золота');return;}
  S.gold-=cost;S.flags['b_'+it]=1;addItem(it);save();render();
}

function _finalizeCard(c){
  if(c.buy){buyItem(c);return;}
  if(c.go){
    const wasDialog=!!(NODES[S.node]&&NODES[S.node].d);
    S.lutePrev={node:S.node,dlg:wasDialog?1:0};
    if(NODES[c.go]&&NODES[c.go].d&&!wasDialog){
      S.flags.lute_used=0;
    }
    S.flags.compassActive=null;
    go(c.go);
  }else{render();}
}

function _itemIconHTML(itemId,width){
  if(!itemId)return '';
  const w=width||110;
  const a=(window.ItemCards&&typeof window.ItemCards.get==='function')?window.ItemCards.get(itemId):null;
  if(!a)return '';
  return '<div style="display:flex;justify-content:center;margin:14px 0 4px">'
    +'<div class="gbp" style="--cbg:'+a.bg+';--cbr:'+a.br+';width:'+w+'px">'
    +'<div class="gbp-art">'+a.art+'</div>'
    +'</div></div>';
}

function _prepareAndShowRoll(text,nextNode,outcome,diceValue){
  S.pendingRoll={
    text:text,
    nextNode:(nextNode===null||nextNode===undefined)?null:nextNode,
    outcome:outcome||'tie',
    dice:diceValue||1,
    ts:Date.now()
  };
  save();
  showDie(diceValue,function(){
    busy=false;
    if(!S.pendingRoll)return;
    _showRollOutcome(text,nextNode,outcome,diceValue);
  },outcome);
}

function _showRollOutcome(text,nextNode,outcome,diceValue){
  const proceed=function(){
    S.pendingRoll=null;
    save();
    if(S.hp<=0){
      if(typeof showCheckpointChoice==='function')showCheckpointChoice();
      return;
    }
    if(nextNode===null||nextNode===undefined){
      render();
    }else{
      go(nextNode);
    }
  };
  if(typeof window.showRollResult==='function'){
    window.showRollResult({outcome:outcome||'tie',dice:diceValue||1,text:text},proceed);
  } else if(typeof window.showInfo==='function'){
    window.showInfo(text,proceed);
  } else {
    proceed();
  }
}
window._showRollOutcome=_showRollOutcome;

function play(c){
  if(busy)return;
  if(S.combat){combatAction(c);return;}
  if(c&&c.special){
    if(doSpecial(c))return;
  }
  if(c&&c.startItem){
    if(!S.flags.startItemPicked){
      S.flags.startItemPicked=1;
      S.startItem=c.startItem;
      addItem(c.startItem);
      save();
      toast('Ваш предмет: '+ITEMS[c.startItem].n);
    }
    if(c.go){go(c.go);}
    else{render();}
    return;
  }
  if(c&&c.esc){
    const dir=c.esc;
    const last=S.flags.escLast||'';
    if(last===dir){
      S.flags.escCount=(S.flags.escCount||0)+1;
      if(S.flags.escCount>=3){
        S.hp--;
        save();
        toast('Ордрик настигает! −1 сердце');
        if(S.hp<=0){
          if(typeof showCheckpointChoice==='function')showCheckpointChoice();
          return;
        }
        S.flags.escCount=0;
      }
    }else{
      S.flags.escLast=dir;
      S.flags.escCount=1;
    }
    save();
    if(c.go){go(c.go);}
    else{render();}
    return;
  }
  if(c.use){
    if(has(c.use)){S.inv.splice(S.inv.indexOf(c.use),1);toast(ITEMS[c.use].n+' использован!');save();}
    else{toast('У вас нет: '+ITEMS[c.use].n);return;}
  }

  if(c.checkTake){
    const target=c.checkTake;
    const item=c.take;
    if(item&&S.inv.length>=invMax()){
      if(typeof window.showBagFullDialog==='function'){
        window.showBagFullDialog(item,function(){
          render();
        },function(){
          go(target);
        });
        return;
      }
    }
    busy=true;
    const v=diceRoll(has('horseshoe'));
    const ok=v>=4;
    const outcome=ok?'win':'lose';
    let gotItem=false;
    let bagFull=false;
    if(item){
      if(S.inv.length<invMax()){S.inv.push(item);recalcMaxHp();gotItem=true;}
      else{bagFull=true;}
    }
    if(!ok){S.hp--;}
    let text='';
    if(ok){
      text='Ты выхватил верёвку из-под паука. Он метнулся следом, но промахнулся — и остался в нише один.';
    }else{
      text='Ты потянулся за верёвкой — и паук ударил первым. Укус в руку, резкий, обжигающий. Ты отступаешь, но верёвку не бросаешь.'
        +'<div class="hgap"></div><b>−1 сердце</b>';
    }
    if(gotItem){
      text+='<div class="hgap"></div><b>Получено: '+ITEMS[item].n+'</b>';
      text+=_itemIconHTML(item,110);
      text+='<div class="hgap"></div>'+ITEMS[item].d;
    }else if(bagFull){
      text+='<div class="hgap"></div><b>Мешок полон — '+ITEMS[item].n+' остаётся в нише</b>';
    }
    _prepareAndShowRoll(text,target,outcome,v);
    return;
  }

  if(c.checkFail){
    const okNode=c.checkFail[0];
    const failNode=c.checkFail[1];
    busy=true;
    const v=diceRoll(has('horseshoe'));
    const ok=v>=3;
    const outcome=ok?'win':'lose';
    if(!ok){S.hp--;}
    const nextNode=ok?okNode:failNode;
    const text=ok?'':'<b>−1 сердце</b>';
    _prepareAndShowRoll(text,nextNode,outcome,v);
    return;
  }

  if(c.checkFood){
    const flag=c.foodFlag;
    busy=true;
    const v=diceRoll(has('horseshoe'));
    const ok=v>=3;
    const outcome=ok?'win':'lose';
    if(flag)S.flags[flag]=1;
    if(ok){
      healHp(1);
    }else{
      S.hp--;
    }
    const text=ok?'<b>+1 сердце</b>':'<b>−1 сердце</b>';
    _prepareAndShowRoll(text,null,outcome,v);
    return;
  }

  if(c.check){
    const winNode=c.check[0];
    const failNode=c.check[1];
    if(c.applyItem&&S.flags.compassActive===S.node&&c.applyItem==='compass'){
      S.flags.compassActive=null;
      toast('Компас подсказал верный путь!');
      save();
      go(winNode);
      return;
    }
    busy=true;
    const v=diceRoll(has('horseshoe'));
    const ok=v>=3;
    const outcome=ok?'win':'lose';
    if(!ok){S.hp--;}
    const nextNode=ok?winNode:failNode;
    const text=ok?'':'<b>−1 сердце</b>';
    _prepareAndShowRoll(text,nextNode,outcome,v);
    return;
  }

  if(c.combat){
    startCombat(c.combat,c.win,c.flee||0,c.first?1:0,c.lose||0);
    return;
  }

  if(c.pick){
    const items=(c.pick.items||[]);
    const gold=c.pick.gold||0;
    const free=invMax()-S.inv.length;
    const totalNeed=items.length;
    if(totalNeed<=free){
      if(gold){S.gold+=gold;}
      items.forEach(function(id){
        S.inv.push(id);
        recalcMaxHp();
      });
      save();
      if(typeof window.showItemsReceived==='function'&&items.length>0){
        window.showItemsReceived(items,gold,function(){_finalizeCard(c);});
      }else{
        if(gold)toast('+'+gold+' золотых');
        _finalizeCard(c);
      }
      return;
    }
    if(typeof window.showPickupResult==='function'){
      window.showPickupResult(
        items,
        free,
        function(){ render(); },
        function(){
          const got=[];
          for(let i=0;i<items.length;i++){
            if(S.inv.length<invMax()){
              S.inv.push(items[i]);
              recalcMaxHp();
              got.push(items[i]);
            }
          }
          if(gold){S.gold+=gold;}
          save();
          if(typeof window.showItemsReceived==='function'&&got.length>0){
            window.showItemsReceived(got,gold,function(){_finalizeCard(c);});
          }else{
            if(gold)toast('+'+gold+' золотых');
            _finalizeCard(c);
          }
        }
      );
      return;
    }
    if(gold){S.gold+=gold;}
    const got2=[];
    for(let i=0;i<items.length;i++){
      if(S.inv.length<invMax()){
        S.inv.push(items[i]);
        recalcMaxHp();
        got2.push(items[i]);
      }
    }
    save();
    if(typeof window.showItemsReceived==='function'&&got2.length>0){
      window.showItemsReceived(got2,gold,function(){_finalizeCard(c);});
    }else{
      if(gold)toast('+'+gold+' золотых');
      _finalizeCard(c);
    }
    return;
  }

  const hpBefore=S.hp;
  if(c.set)applySet(c.set);
  if(c.toastMsg){
    const msg=(typeof c.toastMsg==='function')?c.toastMsg(S,hpBefore):c.toastMsg;
    if(msg){
      save();
      showInfo(msg,function(){_finalizeCard(c);});
      return;
    }
  }
  _finalizeCard(c);
}