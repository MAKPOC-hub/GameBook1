// engine_state_dice_visual.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: трёхмерный кубик — сборка граней, повороты, свечение, показ с колбэком и без, скрытие
// Изменение: восстановление после сбоя: дописана строка первичной сборки кубика

'use strict';

/* ===== 3D-кубик ===== */
const DICE_ROT={1:{x:0,y:0},2:{x:90,y:0},3:{x:0,y:-90},4:{x:0,y:90},5:{x:-90,y:0},6:{x:0,y:180}};

/* ===== Сборка кубика =====
   ↙️ Используется в: engine_state_dice_visual.js (showDie, showDieStay) */
function buildDice(){
  const cube=$('#dicecube');
  if(!cube||cube.dataset.built)return;
  cube.dataset.built='1';
  cube.innerHTML='';
  const PIPS={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,4,7,3,6,9]};
  for(let v=1;v<=6;v++){
    const f=document.createElement('div');
    f.className='face f'+v;
    for(let i=1;i<=9;i++){
      const cell=document.createElement('div');
      cell.className='cell';
      if(PIPS[v].indexOf(i)>=0){const pip=document.createElement('div');pip.className='pip';cell.appendChild(pip);}
      f.appendChild(cell);
    }
    cube.appendChild(f);
  }
}

/* ===== Свечение вокруг кубика ===== */
function _ensureDiceGlow(){
  const w=$('#dicewrap');
  if(!w)return null;
  let g=w.querySelector('.diceglow');
  if(!g){g=document.createElement('div');g.className='diceglow';w.insertBefore(g,w.firstChild);}
  return g;
}
function _applyDiceGlow(result){
  const g=_ensureDiceGlow();
  if(!g)return;
  g.className='diceglow';
  if(result==='win')g.classList.add('win');
  else if(result==='lose')g.classList.add('lose');
  else if(result==='tie')g.classList.add('tie');
}
function _clearDiceGlow(){
  const w=$('#dicewrap');
  if(!w)return;
  const g=w.querySelector('.diceglow');
  if(g)g.className='diceglow';
}

/* ===== Показ кубика с колбэком =====
   ↗️ skillToastOverDice — в: engine_state_toasts.js
   ↙️ Используется в: engine_story_special.js */
function showDie(v,cb,result,msg){
  buildDice();
  _ensureDiceGlow();
  const wrap=$('#dicewrap'),cube=$('#dice'),inner=$('#dicecube');
  const rot=DICE_ROT[v]||DICE_ROT[1];
  inner.style.transform='rotateX('+rot.x+'deg) rotateY('+rot.y+'deg)';
  cube.classList.remove('roll');
  void cube.offsetWidth;
  cube.classList.add('roll');
  wrap.classList.add('on');
  _clearDiceGlow();
  let toastEl=null;
  if(result){
    setTimeout(function(){
      _applyDiceGlow(result);
      if(msg)toastEl=skillToastOverDice(msg,result);
    },2000);
  }
  setTimeout(function(){
    wrap.classList.remove('on');
    _clearDiceGlow();
    if(toastEl&&toastEl.parentNode)toastEl.parentNode.removeChild(toastEl);
  },3800);
  setTimeout(function(){if(cb)cb();},4100);
}

/* ===== Показ кубика без скрытия ===== */
function showDieStay(v,cb,result,msg){
  buildDice();
  _ensureDiceGlow();
  const wrap=$('#dicewrap'),cube=$('#dice'),inner=$('#dicecube');
  const rot=DICE_ROT[v]||DICE_ROT[1];
  inner.style.transform='rotateX('+rot.x+'deg) rotateY('+rot.y+'deg)';
  cube.classList.remove('roll');
  void cube.offsetWidth;
  cube.classList.add('roll');
  wrap.classList.add('on');
  _clearDiceGlow();
  if(result)setTimeout(function(){
    _applyDiceGlow(result);
    if(msg)toastEl=skillToastOverDice(msg,result);
  },2000);
  if(cb)setTimeout(cb,3000);
}

/* ===== Скрыть кубик ===== */
function hideDice(){$('#dicewrap').classList.remove('on');_clearDiceGlow();$('#dicebtns').innerHTML='';}

/* ===== Первичная сборка кубика ===== */
buildDice();