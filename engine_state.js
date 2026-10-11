// engine_state.js
// v1.0.2 (текущая)
// Проект: GameBook1
// Функция: состояние игры и базовые действия — создание нового состояния, сохранение, проверка предметов, пересчёт максимума сердец, добавление предмета, применение эффектов узла, лечение, переход на узел, новая игра
// Изменение: в новое состояние добавлены поля pendingRoll и pendingStartItem. Они нужны, чтобы при обновлении страницы между броском кубика и нажатием «Далее» не происходил повторный бросок

'use strict';

/* ===== Состояние ===== */
let S=null,hasSave=false,busy=false;

function newState(){
  return{
    node:1,hp:3,maxhp:3,gold:0,inv:[],
    startItem:null,
    bagExt:0,
    itemCd:{},
    flags:{},
    lutePrev:null,
    checkpoints:{},
    /* История последних трёх шагов — для кнопки «Шаг назад».
       Каждый элемент — снимок состояния до перехода на следующий узел.
       Максимум три снимка; четвёртый вытесняет самый старый. */
    stepHistory:[],
    /* Отложенный результат броска кубика. Устанавливается перед началом
       анимации кубика, очищается при нажатии «Далее» в окне результата.
       Если игрок обновит страницу в этот момент, окно с тем же числом
       покажется снова — повторного броска не будет. */
    pendingRoll:null,
    /* Отложенный бросок стартового предмета на узле 3. */
    pendingStartItem:null
  };
}

function invMax(){return 3+(S.bagExt||0);}
function save(){try{localStorage.setItem('zl_save',JSON.stringify(S));hasSave=true;}catch(e){}}
function has(id){return S.inv.indexOf(id)>=0;}

/* ===== Пересчёт максимума HP =====
   При росте максимума (получен амулет) — добавляем разницу и к текущему HP.
   При падении (выкинули амулет) — обрезаем текущее по новому максимуму.
   ↙️ Используется в: engine_state.js (addItem), engine_items_apply.js, engine_story_special.js, engine_checkpoints_logic.js */
function recalcMaxHp(){
  if(!S)return;
  const base=3;
  const bonus=has('vigor_amulet')?2:0;
  const newMax=base+bonus;
  if(newMax!==S.maxhp){
    const diff=newMax-S.maxhp;
    S.maxhp=newMax;
    if(diff>0){
      S.hp=Math.min(S.maxhp, S.hp+diff);
    }else{
      if(S.hp>S.maxhp)S.hp=S.maxhp;
      if(S.hp<1)S.hp=1;
    }
  }
}

/* ===== Мешок =====
   ↙️ Используется в: engine_story_special.js, engine_render_inventory.js */
function addItem(id){
  if(S.inv.length<invMax()){S.inv.push(id);toast('Получено: '+ITEMS[id].n);recalcMaxHp();}
  else{toast('Мешок полон — '+ITEMS[id].n+' остаётся');}
}
function pickUp(p){if(p.gold){S.gold+=p.gold;toast('+'+p.gold+' золотых');}if(p.items)p.items.forEach(addItem);}

function applySet(s){
  if(s.flags)s.flags.forEach(function(f){S.flags[f]=1;});
  if(s.hp){S.hp=Math.max(0,Math.min(S.maxhp,S.hp+s.hp));}
}
function healHp(n){S.hp=Math.min(S.maxhp,S.hp+n);}

/* ===== Переход на узел и новая игра =====
   ⚠️ go() переопределяется в engine_checkpoints_logic.js: обёртка сохраняет
   чекпоинт, если узел назначения помечен saveCp, и делает снимок состояния
   для кнопки «Шаг назад».
   ⚠️ Положение прокрутки страницы сохраняется: игрок остаётся в той же
   точке, где был на прошлом узле.
   ↗️ Реализация render в: engine_render_screen.js */
function go(id){
  const keepScrollY=window.scrollY||window.pageYOffset||0;
  S.node=id;
  tickCooldowns();
  save();
  render();
  window.scrollTo(0,keepScrollY);
}
function newGame(){S=newState();save();go(1);}