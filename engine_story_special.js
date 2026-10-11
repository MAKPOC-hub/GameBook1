// engine_story_special.js
// v1.1.13
// Проект: GameBook1
// Функция: специальные сцены и обработка выбора карты — отдых, сон, урон, рестарт, конец главы, возврат к чекпоинту, бросок стартового предмета, галерея стартовых, покупка, финализация карты, главный обработчик выбора
// Содержит исправленную логику находок: при переполнении открывается окно showPickupResult с кнопкой покупки ячейки

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

  if(c.special==='rollStartItem'){
    if(S.flags.startItemRolled){
      if(c.go){go(c.go);}
      return true;
    }
    busy=true;
    const v=Math.floor(Math.random()*6)+1;
    const chosen=START_ITEMS[v-1];
    showDie(v,function(){
      busy=false;
      S.startItem=chosen;
      S.flags.startItemRolled=1;
      S.flags.startItemRolledValue=v;
      if(!has(chosen))S.inv.push(chosen);
      recalcMaxHp();
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

/* ===== Картинка предмета для окна результата ===== */
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

/* ===== Показать окно с исходом броска и перейти дальше ===== */
function _showRollOutcome(text,nextNode,outcome,diceValue){
  const proceed=function(){
    if(S.hp<=0){
      if(typeof showCheckpointChoice==='function')showCheckpointChoice();
      return;
    }
    if(nextNode===null){
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

  /* ===== Проверка с предметом ===== */
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
    const diceMsg=ok?('Бросок '+v+' — успех!'):('Бросок '+v+' — неудача');
    showDie(v,function(){
      busy=false;
      let gotItem=false;
      let bagFull=false;
      if(item){
        if(S.inv.length<invMax()){S.inv.push(item);recalcMaxHp();gotItem=true;}
        else{bagFull=true;}
      }
      if(!ok){S.hp--;}
      save();
      let text='';
      if(ok){
        text='<b>Бросок '+v+' — успех!</b>'
          +'<div class="hgap"></div>'
          +'Ты выхватил верёвку из-под паука. Он метнулся следом, но промахнулся — и остался в нише один.';
      }else{
        text='<b>Бросок '+v+' — неудача.</b>'
          +'<div class="hgap"></div>'
          +'Ты потянулся за верёвкой — и паук ударил первым. Укус в руку, резкий, обжигающий. Ты отступаешь, но верёвку не бросаешь.'
          +'<div class="hgap"></div><b>−1 сердце</b>';
      }
      if(gotItem){
        text+='<div class="hgap"></div><b>Получено: '+ITEMS[item].n+'</b>';
        text+=_itemIconHTML(item,110);
      }else if(bagFull){
        text+='<div class="hgap"></div><b>Мешок полон — '+ITEMS[item].n+' остаётся в нише</b>';
      }
      _showRollOutcome(text,target,outcome,v);
    },outcome,diceMsg);
    return;
  }

  /* ===== Проверка с двумя исходами ===== */
  if(c.checkFail){
    const okNode=c.checkFail[0];
    const failNode=c.checkFail[1];
    busy=true;
    const v=diceRoll(has('horseshoe'));
    const ok=v>=3;
    const outcome=ok?'win':'lose';
    const diceMsg=ok?('Бросок '+v+' — успех!'):('Бросок '+v+' — неудача');
    showDie(v,function(){
      busy=false;
      if(!ok){S.hp--;}
      save();
      let text;
      if(ok){
        text='<b>Бросок '+v+' — успех!</b>';
      }else{
        text='<b>Бросок '+v+' — неудача.</b><div class="hgap"></div><b>−1 сердце</b>';
      }
      _showRollOutcome(text,ok?okNode:failNode,outcome,v);
    },outcome,diceMsg);
    return;
  }

  /* ===== Проверка на еду и питьё ===== */
  if(c.checkFood){
    const flag=c.foodFlag;
    busy=true;
    const v=diceRoll(has('horseshoe'));
    const ok=v>=3;
    const outcome=ok?'win':'lose';
    const diceMsg=ok?('Бросок '+v+' — удача!'):('Бросок '+v+' — неудача');
    showDie(v,function(){
      busy=false;
      if(flag)S.flags[flag]=1;
      if(ok){
        healHp(1);
      }else{
        S.hp--;
      }
      save();
      let text;
      if(ok){
        text='<b>Бросок '+v+' — удача!</b><div class="hgap"></div><b>+1 сердце</b>';
      }else{
        text='<b>Бросок '+v+' — неудача.</b><div class="hgap"></div><b>−1 сердце</b>';
      }
      _showRollOutcome(text,null,outcome,v);
    },outcome,diceMsg);
    return;
  }

  /* ===== Проверка с двумя исходами и Компасом ===== */
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
    const diceMsg=ok?('Бросок '+v+' — успех!'):('Бросок '+v+' — неудача');
    showDie(v,function(){
      busy=false;
      if(!ok){
        S.hp--;
      }
      save();
      let text;
      if(ok){
        text='<b>Бросок '+v+' — успех!</b>';
      }else{
        text='<b>Бросок '+v+' — неудача.</b><div class="hgap"></div><b>−1 сердце</b>';
      }
      _showRollOutcome(text,ok?winNode:failNode,outcome,v);
    },outcome,diceMsg);
    return;
  }

  if(c.combat){
    startCombat(c.combat,c.win,c.flee||0,c.first?1:0,c.lose||0);
    return;
  }

  /* ===== Обычные находки в узле ===== */
  if(c.pick){
    const items=(c.pick.items||[]);
    const gold=c.pick.gold||0;
    const free=invMax()-S.inv.length;
    const totalNeed=items.length;
    /* Случай 1: мест хватает на все предметы. */
    if(totalNeed<=free){
      if(gold){S.gold+=gold;toast('+'+gold+' золотых');}
      items.forEach(function(id){
        S.inv.push(id);
        recalcMaxHp();
        toast('Получено: '+ITEMS[id].n);
      });
      save();
      _finalizeCard(c);
      return;
    }
    /* Случай 2: мест не хватает — окно с выбором и покупкой ячейки. */
    if(typeof window.showPickupResult==='function'){
      window.showPickupResult(
        items,
        free,
        function(){ render(); },
        function(){
          for(let i=0;i<items.length;i++){
            if(S.inv.length<invMax()){
              S.inv.push(items[i]);
              recalcMaxHp();
              toast('Получено: '+ITEMS[items[i]].n);
            }
          }
          if(gold){S.gold+=gold;toast('+'+gold+' золотых');}
          save();
          _finalizeCard(c);
        }
      );
      return;
    }
    /* Страховка. */
    if(gold){S.gold+=gold;toast('+'+gold+' золотых');}
    for(let i=0;i<items.length;i++){
      if(S.inv.length<invMax()){
        S.inv.push(items[i]);
        recalcMaxHp();
        toast('Получено: '+ITEMS[items[i]].n);
      }
    }
    save();
    _finalizeCard(c);
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