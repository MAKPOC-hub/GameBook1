// engine_overlay_input.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: обработчики ввода — кнопки HUD (история, шаг назад), закрытие мешка по клику мимо, горячие клавиши
// Изменение: добавлен обработчик кнопки «Шаг назад» (#backb). Он вызывает функцию goBack, которая живёт в engine_checkpoints_logic.js. Также добавлена горячая клавиша Z (русская Я) для шага назад

'use strict';

/* ===== Кнопки HUD =====
   ↗️ openInv, closeInv — в: engine_render_inventory.js
   ↗️ openChar — в: engine_render_char.js
   ↗️ openHistoryOverlay — в: engine_overlay_history.js
   ↗️ goBack — в: engine_checkpoints_logic.js
   ↘️ Обработчики валют (золото, осколки, знаки) — в: settings.js (initHudCurrencies)
   ↙️ Загружается в конце, после того как DOM готов */
const statBtn=$('#statb');
if(statBtn)statBtn.addEventListener('click',openChar);
const histBtn=$('#histb');
if(histBtn)histBtn.addEventListener('click',function(){openHistoryOverlay();});
const backBtn=$('#backb');
if(backBtn)backBtn.addEventListener('click',function(){
  if(typeof goBack==='function')goBack();
});
const invEl=$('#inv');
if(invEl)invEl.addEventListener('click',function(e){if(e.target===this)closeInv();});

/* ===== Клавиатура ===== */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeInv();return;}
  const k=e.key.toLowerCase();
  if(k==='h'||k==='р'){openHistoryOverlay();return;}
  if(k==='z'||k==='я'){if(typeof goBack==='function')goBack();return;}
  const n=parseInt(e.key,10);
  if(n>=1&&n<=9){const cards=$('#cards').querySelectorAll('.cardwrap');if(cards[n-1])cards[n-1].click();}
});