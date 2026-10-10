// itemcards_styles.js
// v1.0.0
// Проект: GameBook1
// Функция: стили галереи предметов и карточек в мешке — сетка, ячейка, карточка, название, подпись, счётчик
// Изменение: файл создан — выделен из itemcards.js (инжект CSS)

'use strict';

/* CSS галереи + карточек мешка. Инжектится СРАЗУ при загрузке файла,
   чтобы engine_render_inventory.js мог рисовать карточки в мешке до первого открытия галереи.
   ↗️ SECTIONS — в: itemcards_gallery.js
   ↗️ ART — в: itemcards_export.js
   ↙️ Используется в: engine_render_inventory.js (мешок), engine_render_quickbar.js (быстрая панель) */
(function(){
if(document.getElementById('itemcards-css'))return;
const CSS = '.gbgroup{margin-bottom:18px}'
+'.gbgroup h4{font-variant:small-caps;letter-spacing:2px;color:#f0e2c4;font-size:15px;margin:0 0 8px;padding-bottom:4px;border-bottom:1px solid rgba(122,90,56,.4);text-align:center;font-weight:400}'
+'.gbgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px}'
+'.gbcell{position:relative;cursor:pointer;transition:transform .15s}'
+'.gbcell:hover{transform:translateY(-4px)}'
+'.gbp{position:relative;width:100%;aspect-ratio:5/7.2;border-radius:12px;border:3px solid var(--cbr);background:var(--cbg);box-shadow:0 6px 14px rgba(0,0,0,.5),inset 0 0 0 2px rgba(0,0,0,.35);overflow:hidden;display:flex;align-items:center;justify-content:center}'
+'.gbp::before{content:"";position:absolute;inset:6px;border:1.5px solid rgba(255,255,255,.18);border-radius:8px;pointer-events:none;z-index:1}'
+'.gbp::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 55%,rgba(0,0,0,.30) 100%);z-index:1}'
+'.gbp-art{position:relative;width:82%;height:82%;display:flex;align-items:center;justify-content:center;z-index:2;filter:drop-shadow(0 2px 5px rgba(0,0,0,.6))}'
+'.gbp-art svg{width:100%;height:100%;display:block}'
+'.gbname{margin-top:6px;text-align:center;font-size:12px;color:#e8dcbe;text-shadow:0 1px 2px #000;line-height:1.25;opacity:.9}'
+'.bcell-card{position:relative;cursor:pointer;transition:transform .15s;text-align:center}'
+'.bcell-card:hover{transform:translateY(-3px)}'
+'.bcc-wrap{position:relative}'
+'.bcc-wrap .gbp{pointer-events:none}'
+'.bcc-wrap .cnt{position:absolute;bottom:5px;right:5px;z-index:3;font-size:13px;background:#20351b;border:1px solid #7a5a38;border-radius:8px;padding:0 5px;color:#e8dcbe;box-shadow:0 2px 4px rgba(0,0,0,.5)}'
+'.bcell-card .gbname{margin-top:4px;font-size:11px}'
+'.baggrid .bcell.empty,.baggrid .bcell.lock{aspect-ratio:5/7.2}'
+'.baggrid .bcell.lock{font-size:24px}'
+'@media(max-width:640px){.gbgrid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}.bcell-card .gbname{font-size:10px}}';
const st=document.createElement('style');
st.id='itemcards-css';
st.textContent=CSS;
document.head.appendChild(st);
})();