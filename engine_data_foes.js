// engine_data_foes.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: словарь врагов — название, ключ иконки, запас здоровья. Иконки рисуются из icons.js
// Изменение: добавлен Ордрик — финальный босс главы 3, 10 HP, иконка ordric

'use strict';

/* ===== Враги =====
   Поле i — ключ иконки в window.Icons (см. icons.js).
   Для рендера: (Icons[f.i]||function(){return '';})(44).
   ↙️ Используется в: engine_combat.js, engine_render_screen.js */
const FOES={
les:{n:'Лесовичок',i:'tree',h:2},
wolves:{n:'Волки',i:'wolf',h:2},
spider:{n:'Гигантский паук',i:'spider',h:3},
wolf:{n:'Оборотень',i:'wolf',h:3},
dragon:{n:'Двухголовый дракон',i:'dragon',h:5},
ordric:{n:'Жрец Ордрик',i:'ordric',h:10}
};