// itemcards_export.js
// v1.0.0
// Проект: GameBook1
// Функция: сборка общего словаря артов предметов из шести файлов артов и экспорт его в window.ItemCards
// Изменение: файл создан — выделен из itemcards.js (экспорт ItemCards)

'use strict';

/* ===== Сборка общего ART из шести файлов артов =====
   ↗️ ART_ARTIFACTS, ART_WEAPONS, ART_FOOD, ART_TREASURES, ART_GEAR, ART_SCROLLS — в файлах itemcards_art_*.js
   ↙️ Используется в: engine_render_inventory.js (мешок), engine_render_quickbar.js (быстрая панель), engine_render_start_item.js (галерея стартовых) */
(function(){
const ART = Object.assign({},
  window.ART_ARTIFACTS||{},
  window.ART_WEAPONS||{},
  window.ART_FOOD||{},
  window.ART_TREASURES||{},
  window.ART_GEAR||{},
  window.ART_SCROLLS||{}
);
window.ItemCards={
  get:function(id){return ART[id]||null;},
  all:function(){return ART;}
};
})();