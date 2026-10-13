// engine_render_helpers.js
// v1.0.6 -> v1.0.7
// Проект: GameBook1
// Функция: мелкие помощники отрисовки — хелпер «иконка + пробел», шевроны вверх/вниз, чёрточки для указателя в начале/конце текста, подсказки по предметам, правило броска
// Изменение: добавлены две новые константы — LINE_TOP и LINE_BOTTOM. Это тонкие горизонтальные чёрточки по центру блока 200×18. Появляются вместо стрелок, когда текст в самом начале (сверху) или в самом конце (снизу). Без анимации

'use strict';

window.ico=function(name,size){
  if(window.Icons&&Icons[name])return Icons[name](size||16)+' ';
  return '';
};

/* ===== Указатели прокрутки текста: две стрелки =====
   Вариант № 31 из галереи: очень тонкий шеврон на всю ширину блока 200×18.
   Толщина линии — 1 пиксель. Цвет — золотистый #e8c76a.
   ↗️ Используется в: engine_render_screen.js (attachTxtScroll при подмене SVG) */
const CHEV_DOWN='<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,4 100,14 180,4" fill="none" stroke="#e8c76a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEV_UP='<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><polyline points="20,14 100,4 180,14" fill="none" stroke="#e8c76a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ===== Указатели прокрутки текста: две чёрточки =====
   Тонкая горизонтальная линия по центру блока 200×18. Длина — от 20 до 180
   по X, как у шевронов. Толщина — 1 пиксель, цвет тот же. Без анимации.
   ↗️ Используется в: engine_render_screen.js (attachTxtScroll при подмене SVG) */
const LINE_TOP='<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="9" x2="180" y2="9" stroke="#e8c76a" stroke-width="1" stroke-linecap="round"/></svg>';
const LINE_BOTTOM='<svg viewBox="0 0 200 18" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="9" x2="180" y2="9" stroke="#e8c76a" stroke-width="1" stroke-linecap="round"/></svg>';

const ITEM_HINT={
  compass:'Подсказка: с Компасом<div class="hgap"></div>— без броска кубика',
  horseshoe:'Подсказка: с Подковой<div class="hgap"></div>— удача в броске кубика',
  flash:'Подсказка: со Вспышкой<div class="hgap"></div>— пропустить бросок кубика',
  lute:'Подсказка: с Лютней<div class="hgap"></div>— вернуться к выбору',
  vory_knife:'Подсказка: с Броском тени<div class="hgap"></div>— удар без броска'
};

const ROLL_RULE='Бросок кубика:<div class="hgap"></div><b>1–2</b> — неудача (−1 сердце)<br><b>3–6</b> — успех';