// engine_checkpoints_logic.js
// v1.0.12 -> v1.0.13
// Проект: GameBook1
// Функция: логика чекпоинтов — сохранение снимка состояния, проверка открытия, время открытия, возврат к чекпоинту, окно выбора при нуле сердец, открытие меню «История», обёртка над переходом на узел для автосохранения чекпоинта, автовыдачи и удаления предметов, выдача тайных символов за достижения, шаг назад за осколки
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции-обёртки go

'use strict';

let _restoringFromHistory=false;

/* ===== Фразы для окна смерти =====
   PHRASES_DEFEAT — констатация: силы покинули, тьма забрала, путь прервался.
   PHRASES_INSPIRE — восхваление: боги отвлеклись, звёзды гасли от зависти.
   Обе части выбираются случайно, независимо друг от друга.
   Одна и та же фраза не выпадает дважды подряд — помним индекс последней. */
const PHRASES_DEFEAT=[
  'Силы покинули тебя.',
  'Тьма забрала своё.',
  'Последний вздох сорвался.',
  'Мрак поглотил тебя.',
  'Погас огонь в груди.',
  'Занавес опустился.',
  'Мир потемнел.',
  'Свеча погасла.',
  'Путь прервался.',
  'Тишина накрыла тебя.',
  'Последний рубеж пал.'
];
const PHRASES_INSPIRE=[
  'Но это были отличные битвы. По твоим приключениям сложат легенды.',
  'Но странники не умирают — они уходят за горизонт.',
  'И это не конец — это пауза перед новым заходом.',
  'Но дух твой сильнее, чем тело.',
  'Но история твоя ещё не окончена.',
  'Но ты сражался достойно. Достойно — уже победа.',
  'Но впереди — ещё сто дорог. И каждая из них — твоя.',
  'Но на твои битвы и приключения отвлекались Боги.',
  'Но о таком страннике рассказывают у костров сотни лет спустя.',
  'Но звёзды смотрели на тебя — и гасли от зависти.',
  'Но в твоей тени хотят стоять короли.',
  'Но ветер подхватывает эхо твоих шагов и несёт по свету.',
  'Но такой забег — уже сам по себе подвиг.',
  'Но твои приключения видели облака. И задержались посмотреть.'
];
let _lastDefeatIdx=-1;
let _lastInspireIdx=-1;

/* ===== Выбор случайной фразы без мгновенного повтора =====
   Из списка исключается индекс последней выпавшей, из оставшихся берётся
   случайная. Списки независимы: фразы упадка и восхваления не влияют
   друг на друга. */
function _pickDefeatPhrase(){
  const list=PHRASES_DEFEAT;
  if(!list.length)return '';
  const candidates=list.filter(function(_,i){return i!==_lastDefeatIdx;});
  const pick=candidates[Math.floor(Math.random()*candidates.length)];
  _lastDefeatIdx=list.indexOf(pick);
  return pick;
}
function _pickInspirePhrase(){
  const list=PHRASES_INSPIRE;
  if(!list.length)return '';
  const candidates=list.filter(function(_,i){return i!==_lastInspireIdx;});
  const pick=candidates[Math.floor(Math.random()*candidates.length)];
  _lastInspireIdx=list.indexOf(pick);
  return pick;
}

/* ===== Сохранение чекпоинта =====
   ↙️ Вызывается из: обёртки go (в этом же файле) при заходе на узел-чекпоинт */
function saveCheckpoint(id){
  if(!S)return;
  if(!S.checkpoints)S.checkpoints={};
  S.checkpoints[id]={
    node:S.node,
    hp:S.hp,
    maxhp:S.maxhp,
    gold:S.gold,
    inv:(S.inv||[]).slice(),
    flags:Object.assign({},S.flags||{}),
    itemCd:Object.assign({},S.itemCd||{}),
    bagExt:S.bagExt||0,
    startItem:S.startItem||null,
    ts:Date.now()
  };
  save();
}

/* ↙️ Используется в: engine_overlay_history.js, showCheckpointChoice (в этом же файле) */
function isCheckpointOpen(id){
  return !!(S&&S.checkpoints&&S.checkpoints[id]);
}

/* ↙️ Используется в: engine_overlay_history.js, showCheckpointChoice (в этом же файле) */
function getCheckpointTime(id){
  if(!S||!S.checkpoints||!S.checkpoints[id])return '';
  const t=S.checkpoints[id].ts;
  if(!t)return '';
  const d=new Date(t);
  function pad(n){return n<10?('0'+n):(''+n);}
  return pad(d.getDate())+'.'+pad(d.getMonth()+1)+' '+pad(d.getHours())+':'+pad(d.getMinutes());
}

/* ===== Возврат к чекпоинту =====
   ↗️ getCheckpoint, getCheckpointList — в: engine_checkpoints_data.js
   ↙️ Вызывается из: engine_overlay_history.js (клик по плитке), showCheckpointChoice (в этом же файле) */
function returnToCheckpoint(id){
  const cp=getCheckpoint(id);
  if(!cp){toast('Чекпоинт не найден');return false;}
  const snap=S&&S.checkpoints?S.checkpoints[id]:null;
  if(!snap){toast('Этот чекпоинт ещё не открыт');return false;}
  S.node=snap.node;
  S.hp=snap.hp;
  S.maxhp=snap.maxhp;
  S.gold=snap.gold;
  S.inv=(snap.inv||[]).slice();
  S.flags=Object.assign({},snap.flags||{});
  S.itemCd=Object.assign({},snap.itemCd||{});
  S.bagExt=snap.bagExt||0;
  S.startItem=snap.startItem||null;
  S.combat=null;
  S.lutePrev=null;
  S.stepHistory=[];
  /* Сбрасываем отложенные окна — иначе окно результата броска
     могло открыться поверх восстановленного состояния. */
  S.pendingRoll=null;
  S.pendingStartItem=null;
  recalcMaxHp();
  save();
  toast('Возврат: '+cp.name);
  render();
  window.scrollTo(0,0);
  return true;
}

/* ===== Окно выбора при нуле сердец =====
   Две ситуации:
   1) Открытые чекпоинты есть. Показываем две случайные фразы — упадок
      и восхваление — и одну кнопку «История». По ней игрок открывает
      оверлей истории и сам выбирает, куда вернуться.
   2) Открытых чекпоинтов нет (игрок умер до первого сохранения).
      Показываем эпическую фразу про славное начало и короткий путь
      и одну кнопку «Начать сначала».
   ↗️ openHistoryOverlay — в: engine_overlay_history.js
   ↙️ Вызывается из: engine_combat.js (afterRound), engine_story_special.js (play, doSpecial) при S.hp<=0 */
function showCheckpointChoice(){
  const old=document.getElementById('cpchoice');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='cpchoice';
  const opened=CHECKPOINTS.filter(function(cp){return isCheckpointOpen(cp.id);});
  let body='';
  if(opened.length){
    const defeat=_pickDefeatPhrase();
    const inspire=_pickInspirePhrase();
    body='<div style="text-align:center;font-size:14.5px;line-height:1.55;opacity:.9;margin:8px 0">'
      +defeat
      +'<div class="hgap"></div>'
      +inspire
      +'<div class="hgap"></div>'
      +'Выбери место, откуда продолжить.'
      +'</div>'
      +'<div style="text-align:center;margin-top:16px">'
      +'<button class="btn btn-acc" id="cp_open_hist" style="min-width:200px">История</button>'
      +'</div>';
  }else{
    body='<div style="text-align:center;font-size:14.5px;line-height:1.55;opacity:.9;margin:8px 0">'
      +'Славное начало — но путь оказался короче, чем ты думал. Лес заметил твой шаг и запомнил его, и это уже немало.'
      +'<div class="hgap"></div>'
      +'Не стыдно падать на первом шаге. Поднимись, Воин, и попытайся ещё раз!'
      +'</div>'
      +'<div style="text-align:center;margin-top:16px">'
      +'<button class="btn btn-acc" id="cp_start_over" style="min-width:200px">Начать сначала</button>'
      +'</div>';
  }
  ov.innerHTML='<div class="invbox detbox" style="max-width:420px">'
    +'<h3 style="margin-bottom:6px">Тьма близко</h3>'
    +body
    +'</div>';
  document.body.appendChild(ov);
  if(opened.length){
    ov.querySelector('#cp_open_hist').addEventListener('click',function(){
      if(ov.parentNode)ov.parentNode.removeChild(ov);
      if(typeof window.openHistoryOverlay==='function'){
        window.openHistoryOverlay();
      }else{
        toast('Меню истории недоступно');
      }
    });
    return;
  }
  ov.querySelector('#cp_start_over').addEventListener('click',function(){
    if(ov.parentNode)ov.parentNode.removeChild(ov);
    try{localStorage.removeItem('zl_save');}catch(e){}
    hasSave=false;
    S=newState();
    go(1);
  });
}

/* ===== Открытие меню «ИСТОРИЯ» =====
   ↗️ openHistoryOverlay — в: engine_overlay_history.js
   ↙️ Вызывается из: engine_overlay_input.js (кнопка HUD #histb) */
function openHistoryMenu(){
  if(typeof window.openHistoryOverlay==='function'){
    window.openHistoryOverlay();
  }else{
    toast('Меню истории недоступно');
  }
}

/* ===== Шаг назад за 1 осколок =====
   Перед откатом показывается окно подтверждения confirmAction.
   Кнопка «Отмена» стоит слева и коричневая, кнопка «Да, шаг назад»
   стоит справа и зелёная акцентная — опции okAccent:true и reverse:true.
   ⚠️ Строка «Сейчас у тебя:» содержит иконку осколка перед числом —
   чтобы игрок сразу видел, о какой валюте речь.
   ↗️ confirmAction — в: engine_state_dialogs.js
   ↗️ getAdCoins, spendAdCoins — в: settings.js
   ↙️ Вызывается из: engine_overlay_input.js (кнопка HUD #backb, клавиша Z) */
function goBack(){
  if(!S){return;}
  if(!S.stepHistory||!S.stepHistory.length){toast('Дальше некуда');return;}
  const COST=1;
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  if(cur<COST){toast('Не хватает осколков: нужно '+COST+', у вас '+cur);return;}
  function doBack(){
    if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(COST)){
      toast('Не удалось списать осколки');return;
    }
    const snap=S.stepHistory.pop();
    _restoringFromHistory=true;
    S.hp=snap.hp;
    S.maxhp=snap.maxhp;
    S.gold=snap.gold;
    S.inv=(snap.inv||[]).slice();
    S.flags=Object.assign({},snap.flags||{});
    S.itemCd=Object.assign({},snap.itemCd||{});
    S.bagExt=snap.bagExt||0;
    S.startItem=snap.startItem||null;
    S.combat=null;
    S.lutePrev=null;
    recalcMaxHp();
    go(snap.node);
    _restoringFromHistory=false;
    toast('Шаг назад (−'+COST+' осколок)');
  }
  if(typeof window.confirmAction==='function'){
    const adIconFn=window.adIcon||function(){return '';};
    const priceLine='<span style="white-space:nowrap;display:inline-block">'+adIconFn(16)+' <b style="color:#ffe9a0">1</b> осколок</span>';
    const curLine='<span style="white-space:nowrap;display:inline-block">'+adIconFn(16)+' <b style="color:#ffe9a0">'+cur+'</b></span>';
    window.confirmAction(
      'Шаг назад?',
      'Ты вернёшься на предыдущий шаг. Состояние откатится: предметы, взятые за этот шаг, исчезнут.'
      +'<div class="hgap"></div>'
      +'За откат нужно заплатить '+priceLine+'.'
      +'<div class="hgap"></div>'
      +'Сейчас у тебя: '+curLine+'.',
      'Да, шаг назад',
      doBack,
      {okAccent:true, reverse:true}
    );
  }else{
    doBack();
  }
}
window.goBack=goBack;

/* ===== Обёртка go =====
   ↗️ _go0 — оригинальная go из: engine_state.js
   ↗️ showForceGetDialog, showBagFullDialog, openInv — в: engine_state_dialogs.js, engine_render_inventory.js
   ↗️ awardMark — в: settings.js
   ↙️ Заменяет глобальную go после загрузки этого файла */
const _go0=go;
go=function(id){
  if(!_restoringFromHistory&&S){
    if(!S.stepHistory)S.stepHistory=[];
    S.stepHistory.push({
      node:S.node,
      hp:S.hp,
      maxhp:S.maxhp,
      gold:S.gold,
      inv:(S.inv||[]).slice(),
      flags:Object.assign({},S.flags||{}),
      itemCd:Object.assign({},S.itemCd||{}),
      bagExt:S.bagExt||0,
      startItem:S.startItem||null
    });
    while(S.stepHistory.length>3)S.stepHistory.shift();
  }
  _go0(id);
  const n=NODES[id];
  if(!n)return;
  if(n.saveCp&&typeof saveCheckpoint==='function'){
    saveCheckpoint(n.saveCp);
  }
  if(n.forceGet&&!S.flags['force_'+id]){
    const item=n.forceGet;
    if(S.inv.length<invMax()){
      S.flags['force_'+id]=1;
      if(!has(item)){S.inv.push(item);recalcMaxHp();}
      save();
      toast('Получено: '+ITEMS[item].n);
    }else{
      if(typeof window.showForceGetDialog==='function'){
        window.showForceGetDialog(item,function(){
          S.flags['force_'+id]=1;
          save();
          render();
          if(typeof renderQuickbar==='function')renderQuickbar();
        });
      }
    }
  }
  if(n.autoGet&&!S.flags['auto_'+id]){
    const item=n.autoGet;
    if(S.inv.length<invMax()){
      S.flags['auto_'+id]=1;
      if(!has(item)){S.inv.push(item);recalcMaxHp();}
      save();
      toast('Получено: '+ITEMS[item].n);
    }else{
      if(typeof window.showBagFullDialog==='function'){
        window.showBagFullDialog(item,function(){
          if(typeof openInv==='function')openInv();
        },function(){
          S.flags['auto_'+id]=1;
          save();
        });
      }
    }
  }
  if(n.removeItem&&has(n.removeItem)){
    S.inv.splice(S.inv.indexOf(n.removeItem),1);
    recalcMaxHp();
    save();
  }
  if(typeof window.awardMark==='function'){
    if(id===200)window.awardMark('chapter1','Глава 1 пройдена');
    if(id===400)window.awardMark('chapter2','Глава 2 пройдена');
    if(id===460)window.awardMark('chapter3','Глава 3 пройдена');
    if(S.flags&&S.flags.hermit_truth)window.awardMark('hermit_truth','Правда травнице');
    if(S.flags&&S.flags.spider_killed)window.awardMark('spider','Паук побеждён');
    if(S.flags&&S.flags.ch2_choice_D)window.awardMark('core_elders','Ядро отдано старцам');
  }
};