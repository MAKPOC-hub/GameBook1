// story_ch1_5.js
// v4.0.4 -> v5.0.0
// Проект: GameBook1
// Функция: глава 1 «Сумрачный бор» — часть 5. Запуск игры при загрузке.
// Изменение: убран перехват play — esc, die, to_ch2 теперь обрабатываются в engine3.js (doSpecial + play). Здесь остался только запуск игры: чтение zl_save, восстановление S, render()

/* =========================================================================
   ГЛАВА 1. СУМРАЧНЫЙ БОР — часть 5
   Запуск игры.

   ⚠️ Раньше здесь был перехват play() — обрабатывал esc, die, to_ch2.
   Теперь все эти ветки обрабатываются в engine3.js:
   - esc    → play() в engine3.js (ветка c.esc)
   - die    → удалён (death-узлов нет)
   - to_ch2 → doSpecial() в engine3.js (ветка to_ch2)
   - to_checkpoint → doSpecial() в engine3.js
   ========================================================================= */

/* ===== Запуск игры =====
   Читаем сохранение из localStorage. Если сохранение валидное и узел есть
   в NODES — загружаем его. Иначе — создаём новое состояние и рендерим узел 1.
   ↗️ Реализация newState в: engine2.js
   ↗️ Реализация render в: engine4.js */
(function(){
  try{
    const raw=localStorage.getItem('zl_save');
    if(raw){
      const p=JSON.parse(raw);
      if(p&&p.node&&NODES[p.node]){
        S=p;
        hasSave=true;
      }
    }
  }catch(e){}
  if(!S)S=newState();
  render();
})();