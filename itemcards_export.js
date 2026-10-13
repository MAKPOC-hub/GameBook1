// itemcards_export.js
// v1.0.1 -> v1.0.2
// Проект: GameBook1
// Функция: сборка общего словаря артов предметов из семи файлов артов и экспорт его в window.ItemCards
// Изменение: восстановление после сбоя: дописан закрывающий IIFE

'use strict';

(function(){
const ART = Object.assign({},
  window.ART_ARTIFACTS||{},
  window.ART_WEAPONS||{},
  window.ART_FOOD||{},
  window.ART_TREASURES||{},
  window.ART_GEAR||{},
  window.ART_SCROLLS||{},
  window.ART_PUNCHES||{}
);
window.ItemCards={
  get:function(id){return ART[id]||null;},
  all:function(){return ART;}
};
})();