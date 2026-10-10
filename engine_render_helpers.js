// engine_render_helpers.js
// v1.0.2 -> v1.0.3
// Проект: GameBook1
// Функция: мелкие помощники отрисовки — хелпер «иконка + пробел», шевроны вверх/вниз, подсказки по предметам, правило броска, привязка скролла к тексту узла
// Изменение: в ITEM_HINT «Кинжал вора» заменён на «Бросок тени» — предмет был переименован

'use strict';

window.ico=function(name,size){
  if(window.Icons&&Icons[name])return Icons[name](size||16)+' ';
  return '';
};

const CHEV_DOWN='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6 L8 10 L12 6"/></svg>';
const CHEV_UP='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10 L8 6 L12 10"/></svg>';

const ITEM_HINT={
  compass:'Подсказка: с Компасом<div class="hgap"></div>— без броска кубика',
  horseshoe:'Подсказка: с Подковой<div class="hgap"></div>— удача в броске кубика',
  flash:'Подсказка: со Вспышкой<div class="hgap"></div>— пропустить бросок кубика',
  lute:'Подсказка: с Лютней<div class="hgap"></div>— вернуться к выбору',
  vory_knife:'Подсказка: с Броском тени<div class="hgap"></div>— удар без броска'
};

const ROLL_RULE='Бросок кубика:<div class="hgap"></div><b>1–2</b> — неудача (−1 сердце)<br><b>3–6</b> — успех';

function attachTxtScroll(){
  const ptxt=document.getElementById('ptxt');
  if(!ptxt)return;
  const hintTop=document.getElementById('scrollhint_top');
  const hintBot=document.getElementById('scrollhint_bottom');
  if(!hintTop||!hintBot)return;

  function update(){
    const st=ptxt.scrollTop;
    const ch=ptxt.clientHeight;
    const sh=ptxt.scrollHeight;
    hintTop.classList.toggle('on', st>4);
    hintBot.classList.toggle('on', st+ch < sh-4);
  }
  ptxt.addEventListener('scroll',update,{passive:true});
  hintTop.addEventListener('click',function(){
    ptxt.scrollBy({top:-Math.round(ptxt.clientHeight*0.8),behavior:'smooth'});
  });
  hintBot.addEventListener('click',function(){
    ptxt.scrollBy({top:Math.round(ptxt.clientHeight*0.8),behavior:'smooth'});
  });
  ptxt.scrollTop=0;
  requestAnimationFrame(update);
  window.addEventListener('resize',update);
}