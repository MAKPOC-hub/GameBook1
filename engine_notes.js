// engine_notes.js
// v1.0.11 -> v1.0.12
// Проект: GameBook1
// Функция: берестяные заметки — хранилище записей игрока, оверлей просмотра с листанием стрелками, функции добавления и проверки записей
// Изменение: восстановление после сбоя: дописана закрывающая скобка IIFE

(function(){
'use strict';

/* ===== Стартовый набор записей ===== */
const DEFAULT_NOTES=[
  {
    id:'sign_push',
    title:'Круг с тремя точками',
    text:'Толкнуть.',
    svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="32" fill="none" stroke="#5a3a1a" stroke-width="4"/><circle cx="50" cy="34" r="4" fill="#5a3a1a"/><circle cx="36" cy="58" r="4" fill="#5a3a1a"/><circle cx="64" cy="58" r="4" fill="#5a3a1a"/></svg>'
  },
  {
    id:'sign_press',
    title:'Треугольник с точкой',
    text:'Нажать.',
    svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,18 82,78 18,78" fill="none" stroke="#5a3a1a" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="60" r="5" fill="#5a3a1a"/></svg>'
  },
  {
    id:'sign_touch',
    title:'Полукруг с чертой',
    text:'Коснуться ладонью.',
    svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M18 60 A32 32 0 0 1 82 60" fill="none" stroke="#5a3a1a" stroke-width="4"/><line x1="18" y1="60" x2="82" y2="60" stroke="#5a3a1a" stroke-width="4" stroke-linecap="round"/></svg>'
  },
  {
    id:'mystery_37',
    title:'Запись без пояснения',
    text:'«Три и семь. Где — не помню. Но помню, что важно».',
    svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="bold" fill="#5a3a1a">3</text><text x="50" y="82" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="bold" fill="#5a3a1a">7</text></svg>'
  }
];

/* Быстрый доступ к актуальной версии записи по id. */
function _defaultById(id){
  for(let i=0;i<DEFAULT_NOTES.length;i++){
    if(DEFAULT_NOTES[i].id===id)return DEFAULT_NOTES[i];
  }
  return null;
}

/* SVG-текстура фона карточки записки. */
const _NOTES_BG_URL='url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><defs><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' seed=\'7\'/><feColorMatrix values=\'0 0 0 0 0.4  0 0 0 0 0.28  0 0 0 0 0.12  0 0 0 0.18 0\'/></filter></defs><rect width=\'200\' height=\'200\' filter=\'url(%23n)\'/><g stroke=\'rgba(90,58,26,0.55)\' stroke-linecap=\'round\' fill=\'none\'><path d=\'M22 28 Q34 27 46 28\' stroke-width=\'1.2\'/><path d=\'M68 22 Q82 21 96 22\' stroke-width=\'1\'/><path d=\'M126 30 Q140 29 156 30\' stroke-width=\'1.4\'/><path d=\'M16 52 Q28 51 38 52\' stroke-width=\'1\'/><path d=\'M74 48 Q92 47 110 48\' stroke-width=\'1.6\'/><path d=\'M144 54 Q156 53 172 54\' stroke-width=\'1.2\'/><path d=\'M28 74 Q46 73 62 74\' stroke-width=\'1.4\'/><path d=\'M98 78 Q112 77 126 78\' stroke-width=\'1\'/><path d=\'M162 70 Q174 69 186 70\' stroke-width=\'1.2\'/><path d=\'M14 96 Q24 95 34 96\' stroke-width=\'1\'/><path d=\'M52 100 Q66 99 80 100\' stroke-width=\'1.6\'/><path d=\'M118 96 Q134 95 152 96\' stroke-width=\'1.4\'/><path d=\'M32 122 Q48 121 62 122\' stroke-width=\'1.2\'/><path d=\'M88 118 Q102 117 118 118\' stroke-width=\'1.4\'/><path d=\'M148 124 Q160 123 174 124\' stroke-width=\'1\'/><path d=\'M20 146 Q32 145 44 146\' stroke-width=\'1.2\'/><path d=\'M76 150 Q94 149 112 150\' stroke-width=\'1.6\'/><path d=\'M140 142 Q154 141 168 142\' stroke-width=\'1.2\'/></g><g fill=\'rgba(90,58,26,0.45)\'><circle cx=\'32\' cy=\'40\' r=\'1.2\'/><circle cx=\'58\' cy=\'34\' r=\'1\'/><circle cx=\'88\' cy=\'38\' r=\'1.4\'/><circle cx=\'124\' cy=\'42\' r=\'1\'/><circle cx=\'160\' cy=\'34\' r=\'1.2\'/><circle cx=\'46\' cy=\'60\' r=\'1.4\'/><circle cx=\'102\' cy=\'58\' r=\'1.2\'/><circle cx=\'152\' cy=\'62\' r=\'1\'/><circle cx=\'22\' cy=\'86\' r=\'1.2\'/><circle cx=\'72\' cy=\'88\' r=\'1.4\'/><circle cx=\'122\' cy=\'86\' r=\'1\'/><circle cx=\'174\' cy=\'82\' r=\'1.2\'/><circle cx=\'44\' cy=\'110\' r=\'1\'/><circle cx=\'94\' cy=\'108\' r=\'1.4\'/><circle cx=\'140\' cy=\'112\' r=\'1.2\'/><circle cx=\'26\' cy=\'134\' r=\'1.2\'/><circle cx=\'70\' cy=\'136\' r=\'1\'/><circle cx=\'116\' cy=\'134\' r=\'1.4\'/><circle cx=\'166\' cy=\'136\' r=\'1\'/><circle cx=\'48\' cy=\'160\' r=\'1.2\'/><circle cx=\'98\' cy=\'164\' r=\'1.4\'/><circle cx=\'148\' cy=\'158\' r=\'1.2\'/><circle cx=\'28\' cy=\'180\' r=\'1\'/><circle cx=\'102\' cy=\'182\' r=\'1.2\'/></g><g fill=\'rgba(255,247,220,0.55)\'><circle cx=\'40\' cy=\'48\' r=\'1.4\'/><circle cx=\'76\' cy=\'64\' r=\'1.2\'/><circle cx=\'130\' cy=\'52\' r=\'1.6\'/><circle cx=\'58\' cy=\'90\' r=\'1.2\'/><circle cx=\'110\' cy=\'100\' r=\'1.4\'/><circle cx=\'164\' cy=\'90\' r=\'1.2\'/><circle cx=\'38\' cy=\'142\' r=\'1.4\'/><circle cx=\'82\' cy=\'152\' r=\'1.2\'/></g></svg>")';

/* ===== Инжект стилей оверлея ===== */
(function _injectNotesStyles(){
  const old=document.getElementById('zl-notes-styles');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const st=document.createElement('style');
  st.id='zl-notes-styles';
  st.textContent=
  '#notesov{z-index:47}'
  +'.notesbox{width:100%;max-width:420px;height:min(90vh,620px);min-height:480px;display:flex;flex-direction:column;padding:14px 16px 14px}'
  +'.notes-top{flex:1;display:flex;align-items:center;justify-content:center;min-height:0}'
  +'.notes-top h3{margin:0}'
  +'.noteswrap{flex:0 0 auto;display:flex;align-items:center;justify-content:center;gap:12px;touch-action:pan-y;user-select:none}'
  +'.notes-bottom{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:0;gap:14px}'
  +'.notesslide{flex:1;min-width:0;background-color:#ecdfb8;background-image:'+_NOTES_BG_URL+',linear-gradient(140deg,#f2e6c8 0%,#ecdfb8 45%,#dccfa0 100%);background-size:200px 200px,100% 100%;background-repeat:repeat,no-repeat;border:2px solid #5b422a;border-radius:10px;padding:18px 16px 16px;box-shadow:inset 0 0 14px rgba(91,66,42,.45),inset 0 0 40px rgba(122,90,40,.22),0 4px 10px rgba(0,0,0,.35);color:#2f2417;position:relative;overflow:hidden;min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center}'
  +'.notesslide::before{content:"";position:absolute;inset:6px;border:1px dashed rgba(91,66,42,.35);border-radius:6px;pointer-events:none;z-index:1}'
  +'.notesslide::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(circle at 20% 15%, rgba(140,100,40,.14), transparent 35%),radial-gradient(circle at 80% 75%, rgba(140,100,40,.12), transparent 40%),radial-gradient(circle at 55% 45%, rgba(160,120,60,.08), transparent 50%),radial-gradient(circle at 8% 92%, rgba(120,85,30,.10), transparent 25%),radial-gradient(circle at 92% 8%, rgba(120,85,30,.10), transparent 25%)}'
  +'.notesart{width:110px;height:110px;margin:4px auto 14px;display:flex;align-items:center;justify-content:center;position:relative;z-index:2;flex:0 0 auto}'
  +'.notesart svg{width:100%;height:100%;display:block;filter:drop-shadow(0 1px 1px rgba(60,30,10,.3))}'
  +'.notestitle{position:relative;z-index:2;text-align:center;font-family:"Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;font-variant:small-caps;letter-spacing:3px;font-size:17px;color:#1a0e04;margin-bottom:10px;font-weight:700;font-synthesis:weight;-webkit-text-stroke:0.4px #1a0e04;text-shadow:0 1px 0 rgba(255,245,215,.9),0 0 2px rgba(60,30,10,.4)}'
  +'.notestext{position:relative;z-index:2;text-align:center;font-family:"Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;font-size:16px;line-height:1.65;color:#1a0e04;padding:2px 6px;font-weight:700;font-synthesis:weight;-webkit-text-stroke:0.4px #1a0e04;letter-spacing:.4px;text-shadow:0 1px 0 rgba(255,245,215,.9),0 0 2px rgba(60,30,10,.4)}'
  +'.notesarrow{flex:0 0 auto;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#f0e2c4;background:rgba(60,40,20,.85);border:2px solid #8a6a44;border-radius:50%;cursor:pointer;user-select:none;text-shadow:0 1px 2px #000;transition:transform .12s,background .15s}'
  +'.notesarrow:hover{background:rgba(80,55,30,.95)}'
  +'.notesarrow:active{transform:scale(.94)}'
  +'.notesarrow.off{opacity:.35;cursor:default;pointer-events:none}'
  +'.notescount{text-align:center;font-size:12px;opacity:.75;color:#e8dcbe;letter-spacing:2px;font-family:"Palatino Linotype","Book Antiqua",Georgia,serif;font-style:italic}'
  +'.notesempty{text-align:center;font-style:italic;opacity:.85;padding:40px 10px;font-size:15px;color:#e8dcbe;font-family:"Palatino Linotype","Book Antiqua",Georgia,serif;letter-spacing:1px}';
  document.head.appendChild(st);
})();

/* ===== Инициализация записей ===== */
function initBirchNotes(){
  if(!S)return;
  if(!Array.isArray(S.notes))S.notes=[];
  if(!has('birch_notes'))return;
  if(S.notes.length===0){
    DEFAULT_NOTES.forEach(function(n){
      S.notes.push({
        id:n.id,
        title:n.title,
        text:n.text,
        svg:n.svg
      });
    });
    save();
    return;
  }
  let changed=false;
  S.notes.forEach(function(note){
    const fresh=_defaultById(note.id);
    if(!fresh)return;
    if(note.title!==fresh.title||note.text!==fresh.text||note.svg!==fresh.svg){
      note.title=fresh.title;
      note.text=fresh.text;
      note.svg=fresh.svg;
      changed=true;
    }
  });
  if(changed)save();
}

/* ===== Добавить одну запись ===== */
function addNote(id,title,text,svg){
  if(!S)return false;
  if(!Array.isArray(S.notes))S.notes=[];
  for(let i=0;i<S.notes.length;i++){
    if(S.notes[i].id===id)return false;
  }
  S.notes.push({id:id,title:title,text:text,svg:svg||''});
  save();
  return true;
}
window.addNote=addNote;

/* ===== Проверка, есть ли запись ===== */
function hasNote(id){
  if(!S||!Array.isArray(S.notes))return false;
  for(let i=0;i<S.notes.length;i++){
    if(S.notes[i].id===id)return true;
  }
  return false;
}
window.hasNote=hasNote;

/* ===== Индекс текущей отображаемой записи ===== */
let _notesIdx=0;

/* ===== Открытие оверлея =====
   Разметка внутри окна заметок разбита на три зоны:
   notes-top — заголовок, центрируется в свободном пространстве сверху;
   noteswrap — карточка с записью, фиксированная высота;
   notes-bottom — счётчик и кнопка «Закрыть», центрируются в свободном
   пространстве снизу. */
function openNotes(){
  initBirchNotes();
  let ov=document.getElementById('notesov');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='notesov';
    ov.innerHTML='<div class="invbox detbox notesbox">'
      +'<div class="notes-top"><h3>Берестяные заметки</h3></div>'
      +'<div class="noteswrap" id="noteswrap">'
      +'<div class="notesarrow" id="notesprev">‹</div>'
      +'<div id="notesslidebox" style="flex:1;min-width:0"></div>'
      +'<div class="notesarrow" id="notesnext">›</div>'
      +'</div>'
      +'<div class="notes-bottom">'
      +'<div class="notescount" id="notescount"></div>'
      +'<button class="btn" id="notesclose">Закрыть</button>'
      +'</div>'
      +'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#notesclose').addEventListener('click',function(){ov.classList.add('hidden');});
    ov.querySelector('#notesprev').addEventListener('click',function(){notesPrev();});
    ov.querySelector('#notesnext').addEventListener('click',function(){notesNext();});
    let touchStartX=0;
    const area=ov.querySelector('#noteswrap');
    area.addEventListener('touchstart',function(e){touchStartX=e.changedTouches[0].screenX;},{passive:true});
    area.addEventListener('touchend',function(e){
      const dx=e.changedTouches[0].screenX-touchStartX;
      if(dx<-40)notesNext();
      else if(dx>40)notesPrev();
    },{passive:true});
  }
  _notesIdx=0;
  renderNotes();
  ov.classList.remove('hidden');
}
window.openNotes=openNotes;

/* ===== Перелистывание ===== */
function notesPrev(){
  const total=(S&&Array.isArray(S.notes))?S.notes.length:0;
  if(total<2)return;
  _notesIdx=(_notesIdx-1+total)%total;
  renderNotes();
}
function notesNext(){
  const total=(S&&Array.isArray(S.notes))?S.notes.length:0;
  if(total<2)return;
  _notesIdx=(_notesIdx+1)%total;
  renderNotes();
}

/* ===== Отрисовка текущей записи ===== */
function renderNotes(){
  const box=document.getElementById('notesslidebox');
  const count=document.getElementById('notescount');
  const prev=document.getElementById('notesprev');
  const next=document.getElementById('notesnext');
  if(!box||!count)return;
  const list=(S&&Array.isArray(S.notes))?S.notes:[];
  if(list.length===0){
    box.innerHTML='<div class="notesempty">Заметки пусты. Пока нечего показать.</div>';
    count.textContent='';
    if(prev)prev.classList.add('off');
    if(next)next.classList.add('off');
    return;
  }
  if(_notesIdx>=list.length)_notesIdx=0;
  const n=list[_notesIdx];
  let html='<div class="notesslide">';
  if(n.svg){
    html+='<div class="notesart">'+n.svg+'</div>';
  }
  html+='<div class="notestitle">'+n.title+'</div>';
  html+='<div class="notestext">'+n.text+'</div>';
  html+='</div>';
  box.innerHTML=html;
  if(list.length===1){
    count.textContent='Запись 1 из 1';
    if(prev)prev.classList.add('off');
    if(next)next.classList.add('off');
  }else{
    count.textContent='Запись '+(_notesIdx+1)+' из '+list.length;
    if(prev)prev.classList.remove('off');
    if(next)next.classList.remove('off');
  }
}

})();