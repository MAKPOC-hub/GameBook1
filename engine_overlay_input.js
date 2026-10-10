// engine_overlay_input.js
// v1.0.0
// Проект: GameBook1
// Функция: обработчики ввода — кнопки HUD (мешок, персонаж, история), закрытие мешка по клику мимо, горячие клавиши
// Изменение: файл создан — выделен из engine4.js (обработчики кнопок HUD и клавиатура)

'use strict';

/* ===== Кнопки HUD =====
   ↗️ openInv, closeInv — в: engine_render_inventory.js
   ↗️ openChar — в: engine_render_char.js
   ↗️ openHistoryOverlay — в: engine_overlay_history.js
   ↙️ Загружается в конце, после того как DOM готов */
const bagBtn=$('#bagb');
if(bagBtn)bagBtn.addEventListener('click',function(){if($('#inv').classList.contains('hidden'))openInv();else closeInv();});
const statBtn=$('#statb');
if(statBtn)statBtn.addEventListener('click',openChar);
const histBtn=$('#histb');
if(histBtn)histBtn.addEventListener('click',function(){openHistoryOverlay();});
const invEl=$('#inv');
if(invEl)invEl.addEventListener('click',function(e){if(e.target===this)closeInv();});

/* ===== Клавиатура ===== */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeInv();return;}
  const k=e.key.toLowerCase();
  if(k==='i'||k==='ш'){if($('#inv').classList.contains('hidden'))openInv();else closeInv();return;}
  if(k==='h'||k==='р'){openHistoryOverlay();return;}
  const n=parseInt(e.key,10);
  if(n>=1&&n<=9){const cards=$('#cards').querySelectorAll('.cardwrap');if(cards[n-1])cards[n-1].click();}
});