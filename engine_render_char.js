// engine_render_char.js
// v1.0.0 -> v1.0.1
// Проект: GameBook1
// Функция: экран персонажа — открытие окна «Странник» с описанием, текущим здоровьем и стартовым предметом
// Изменение: восстановление после сбоя: дописана закрывающая скобка функции openChar()

'use strict';

/* ===== Экран персонажа =====
   ↗️ has — в: engine_state.js
   ↙️ Используется в: engine_overlay_input.js (кнопка HUD #statb) */
function openChar(){
  let ch=$('#char');
  if(!ch){
    ch=document.createElement('div');ch.className='ovl hidden';ch.id='char';
    const d=document.createElement('div');d.className='invbox charbox';d.id='charbox';
    ch.appendChild(d);document.body.appendChild(ch);
    ch.addEventListener('click',function(e){if(e.target===ch)ch.classList.add('hidden');});
  }
  let h='<h3>Странник</h3>';
  h+='<div class="detd">Дороги — твой дом: деревня за деревней, город за городом, случайные заработки. Ты нигде не задерживаешься дольше, чем нужно, и нигде не становишься своим. Сейчас ты идёшь по Сумрачному бору — проверить сказку о добрых духах, что слышал в детстве. Может быть, здесь ты наконец найдёшь место, где ты свой.</div>';
  h+='<div class="crow"><b>Здоровье:</b> '+S.hp+' из '+S.maxhp+' '+ico('heart',16)+'</div>';
  if(S.startItem&&ITEMS[S.startItem]){
    const id=S.startItem;
    const hasIt=has(id);
    h+='<div class="crow"><b>Ваш предмет:</b> '+ITEMS[id].n+' '+(hasIt?'<span style="color:#8fbf74">(в мешке)</span>':'<span style="color:#c96a5a">(утерян)</span>')+'</div>';
    h+='<div class="detd" style="opacity:.85;font-size:13px">'+ITEMS[id].d+'</div>';
  }
  h+='<div style="text-align:center;margin-top:12px"><button class="btn" id="charc">Закрыть</button></div>';
  $('#charbox').innerHTML=h;
  ch.classList.remove('hidden');
  $('#charc').addEventListener('click',function(){ch.classList.add('hidden');});
}