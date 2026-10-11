// engine_checkpoints_logic.js
// v1.0.7 -> v1.0.8
// Проект: GameBook1
// Функция: логика чекпоинтов — сохранение снимка состояния, проверка открытия, время открытия, возврат к чекпоинту, окно выбора при нуле сердец, открытие меню «История», обёртка над переходом на узел для автосохранения чекпоинта, автовыдачи и удаления предметов, выдача тайных символов за достижения, шаг назад за осколки
// Изменение: добавлена функция goBack — шаг назад за 1 осколок, максимум на 3 шага. В обёртке go теперь сохраняется снимок состояния перед каждым переходом — до трёх последних. Возврат к чекпоинту очищает историю шагов, потому что это большой прыжок, а не шаг

'use strict';

/* Флаг на время восстановления из истории шагов. Пока он true, обёртка go
   не записывает новый снимок в историю — иначе откат «съел» бы предыдущий
   снимок и восстановление оказалось бы невозможно. */
let _restoringFromHistory=false;

/* ===== Сохранение чекпоинта =====
   Копирует ключевые параметры S в S.checkpoints[id].
   Перезапись: если уже есть — заменяется новым состоянием (см. Правила.txt, 6.4).
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
   Восстанавливает S из сохранённого состояния чекпоинта.
   Проверка: если чекпоинт не сохранён — toast и выход.
   ⚠️ История шагов очищается: возврат к чекпоинту — это большой прыжок,
   а не шаг назад. После возврата игрок начинает путь заново от чекпоинта.
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
  recalcMaxHp();
  save();
  toast('Возврат: '+cp.name);
  render();
  window.scrollTo(0,0);
  return true;
}

/* ===== Окно выбора чекпоинта при HP = 0 =====
   Показывает список открытых чекпоинтов. Клик → returnToCheckpoint(id).
   Если открытых нет — откат на cp1 (Опушка).
   ↗️ .hgap — в: style.css
   ↙️ Вызывается из: engine_combat.js (afterRound), engine_story_special.js (play, doSpecial) при S.hp<=0 */
function showCheckpointChoice(){
  const old=document.getElementById('cpchoice');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const ov=document.createElement('div');
  ov.className='ovl';ov.id='cpchoice';
  const opened=CHECKPOINTS.filter(function(cp){return isCheckpointOpen(cp.id);});
  let listHtml='';
  if(!opened.length){
    listHtml='<div style="text-align:center;font-style:italic;opacity:.85;margin:12px 0">У вас пока нет открытых чекпоинтов. Возврат к началу леса.</div>';
  }else{
    listHtml='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:12px 0">'
      +opened.map(function(cp){
        return '<button class="btn cpbtn" data-cp="'+cp.id+'" style="text-align:center;padding:10px 8px">'
          +'<div style="font-weight:700;color:#ffe9a0;margin-bottom:3px">'+cp.name+'</div>'
          +'<div style="font-size:11px;opacity:.75">'+getCheckpointTime(cp.id)+'</div>'
          +'</button>';
      }).join('')
      +'</div>';
  }
  ov.innerHTML='<div class="invbox detbox" style="max-width:420px">'
    +'<h3 style="margin-bottom:6px">Тьма близко</h3>'
    +'<div style="text-align:center;font-size:14px;line-height:1.5;opacity:.9;margin:8px 0">'
    +'Силы покинули тебя.<div class="hgap"></div>Но лес помнит, где ты был. Выбери место, откуда продолжить.'
    +'</div>'
    +listHtml
    +(opened.length?'':'<div style="text-align:center;margin-top:8px"><button class="btn" id="cp_start_over">Начать сначала</button></div>')
    +'</div>';
  document.body.appendChild(ov);
  if(!opened.length){
    ov.querySelector('#cp_start_over').addEventListener('click',function(){
      if(ov.parentNode)ov.parentNode.removeChild(ov);
      try{localStorage.removeItem('zl_save');}catch(e){}
      hasSave=false;
      S=newState();
      go(1);
    });
    return;
  }
  ov.querySelectorAll('.cpbtn').forEach(function(btn){
    btn.addEventListener('click',function(){
      const id=btn.getAttribute('data-cp');
      if(ov.parentNode)ov.parentNode.removeChild(ov);
      returnToCheckpoint(id);
    });
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
   Берёт последний снимок из S.stepHistory, списывает 1 осколок и
   восстанавливает состояние. Максимум три снимка — три шага назад.
   Снимки сохраняются в обёртке go (в этом же файле) перед каждым
   переходом на новый узел.
   ⚠️ Восстановление возвращает: HP, максимум HP, золото, инвентарь,
   флаги, перезарядки, размер мешка, стартовый предмет. Значит, все
   предметы, взятые за эти шаги, исчезают из инвентаря — так же, как
   это работает при возврате к чекпоинту.
   ⚠️ Сам переход на узел снимка выполняется через go() — тогда сработают
   все проверки узла (saveCp, forceGet, autoGet, removeItem, awardMark).
   Но при этом новый снимок в историю не пишется: этому мешает флаг
   _restoringFromHistory.
   ↗️ awardMark — в: settings.js
   ↗️ getAdCoins, spendAdCoins — в: settings.js
   ↙️ Вызывается из: engine_overlay_input.js (кнопка HUD #backb, клавиша Z) */
function goBack(){
  if(!S){return;}
  if(!S.stepHistory||!S.stepHistory.length){toast('Дальше некуда');return;}
  const COST=1;
  const cur=(typeof window.getAdCoins==='function')?window.getAdCoins():0;
  if(cur<COST){toast('Не хватает осколков: нужно '+COST+', у вас '+cur);return;}
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
window.goBack=goBack;

/* ===== Обёртка go =====
   Делает шесть вещей поверх оригинальной go из engine_state.js:
   1. Перед переходом сохраняет снимок текущего состояния в S.stepHistory
      (до трёх последних). Снимок не делается, если идёт восстановление из
      истории (иначе откат «съел» бы предыдущий снимок).
   2. Сохраняет чекпоинт, если узел назначения помечен saveCp.
   3. Принудительно выдаёт ключевой предмет, если узел помечен forceGet.
   4. Автовыдаёт предмет, если узел помечен autoGet.
   5. Убирает предмет, если узел помечен removeItem.
   6. Выдаёт тайный символ за достижение, если выполнено условие.
   ↗️ _go0 — оригинальная go из: engine_state.js
   ↗️ showForceGetDialog, showBagFullDialog, openInv — в: engine_state_dialogs.js, engine_render_inventory.js
   ↗️ awardMark — в: settings.js
   ↙️ Заменяет глобальную go после загрузки этого файла */
const _go0=go;
go=function(id){
  /* 1. Снимок текущего состояния перед переходом. */
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
  /* Принудительная выдача ключевого предмета */
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
  /* Автовыдача предмета при входе на узел (обычная) */
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
  /* Удаление предмета при входе на узел — без сообщения. */
  if(n.removeItem&&has(n.removeItem)){
    S.inv.splice(S.inv.indexOf(n.removeItem),1);
    recalcMaxHp();
    save();
  }
  /* ===== Выдача тайного символа за достижения ===== */
  if(typeof window.awardMark==='function'){
    if(id===200)window.awardMark('chapter1','Глава 1 пройдена');
    if(id===400)window.awardMark('chapter2','Глава 2 пройдена');
    if(id===460)window.awardMark('chapter3','Глава 3 пройдена');
    if(S.flags&&S.flags.hermit_truth)window.awardMark('hermit_truth','Правда травнице');
    if(S.flags&&S.flags.saw_spider_killed)window.awardMark('spider','Паук побеждён');
    if(S.flags&&S.flags.ch2_choice_D)window.awardMark('core_elders','Ядро отдано старцам');
  }
};