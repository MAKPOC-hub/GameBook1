// engine_data_core.js
// v1.0.0
// Проект: GameBook1
// Функция: базовые данные движка — быстрый поиск элементов, генератор случайных чисел, символы граней кубика, бросок кубика с учётом Подковы удачи, обёртки на два и один кубик, определение названия локации по номеру узла
// Изменение: файл создан — выделен из engine1.js (данные) и engine2.js (кубик, локация)

'use strict';
const $=s=>document.querySelector(s);
const rnd=n=>Math.floor(Math.random()*n)+1;

const DICEF=['','⚀','⚁','⚂','⚃','⚄','⚅'];

/* ===== Бросок кубика с учётом Подковы удачи ===== */
function diceRoll(withLuck){
  if(!withLuck)return rnd(6);
  const r=Math.random()*100;
  if(r<25)return 5;
  if(r<50)return 6;
  if(r<58.33)return 1;
  if(r<66.66)return 2;
  if(r<83.33)return 3;
  return 4;
}

/* ===== Кубик с Подковой — обёртки =====
   ↙️ Используется в: engine_combat.js, engine_story_special.js */
function roll2(withLuck){
  const a=diceRoll(withLuck);
  const b=diceRoll(withLuck);
  return {a:a,b:b,sum:a+b};
}
function rollOne(withLuck){return diceRoll(withLuck);}

/* ===== Название локации по узлу =====
   ↙️ Используется в: engine_state_hud.js */
function getLocationName(node){
  const n=parseInt(node,10);
  if(isNaN(n))return '—';
  if(n>=1&&n<=214)return 'Сумрачный бор';
  if(n===900)return 'Тьма';
  if(n>=500&&n<=699)return 'Шахты Предтеч';
  if(n>=700&&n<=899)return 'Путь к Ордрику';
  return '—';
}