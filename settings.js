// settings.js
// v2.1.15 -> v2.1.16
// Проект: GameBook1
// Функция: настройки игры (размер шрифта, размер карт, рубашки карт, знаки, осколки, рестарт) + профиль + иконки валют + диалоги осколков, золота, знаков + реклама-заглушка + автопрокрутка текста
// Изменение: ширина карты выбора теперь ограничена сверху половиной ширины экрана минус отступы. На телефоне это гарантирует, что в ряд помещается минимум две карты, даже если в настройках выбран большой размер карт (x1.5 или x2). На широких экранах ограничение не действует — карты остаются того размера, который выбран в настройках

(function(){
const FZ=[1,1.15,1.3,1.5,1.7];
const CZ=[1,1.5,2];
const ASPD_MIN=0.1;
const ASPD_MAX=3.0;
const ASPD_STEP=0.1;
const STEP_MIN=1;
const STEP_MAX=5;

let st={f:2,c:1,auto:1,aspd:0.4,mode:1,step:3};
try{
  const r=localStorage.getItem('zl_set');
  if(r){
    const p=JSON.parse(r);
    if(p&&typeof p.f==='number'&&typeof p.c==='number'&&p.f>=0&&p.f<FZ.length&&p.c>=0&&p.c<CZ.length){
      st=p;
    }
    if(typeof st.auto!=='number'||(st.auto!==0&&st.auto!==1))st.auto=1;
    if(typeof st.aspd!=='number'||st.aspd<ASPD_MIN||st.aspd>ASPD_MAX)st.aspd=0.4;
    st.aspd=Math.round(st.aspd*10)/10;
    if(typeof st.mode!=='number'||(st.mode!==0&&st.mode!==1))st.mode=1;
    if(typeof st.step!=='number'||st.step<STEP_MIN||st.step>STEP_MAX)st.step=3;
  }
}catch(e){}

let P={marks:0,skins:{},skin:'ag',markIcon:0,adcoins:1000};
try{
  const r=localStorage.getItem('zl_profile');
  if(r){
    const p=JSON.parse(r);
    if(p&&p.skins){
      P.marks=+p.marks||0;
      P.skins=p.skins;
      P.skin=p.skin||'ag';
      if(typeof p.markIcon==='number')P.markIcon=p.markIcon;
      P.adcoins=(typeof p.adcoins==='number')?p.adcoins:1000;
    }
  }
}catch(e){}

if(P.adcoins<1000){
  P.adcoins=1000;
  try{localStorage.setItem('zl_profile',JSON.stringify(P));}catch(e){}
}

function saveP(){try{localStorage.setItem('zl_profile',JSON.stringify(P));}catch(e){}}

let _iid=0;
function coinIconSVG(){
const k='adic'+(++_iid);
return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%">'
+'<defs>'
+'<linearGradient id="'+k+'m" x1="0" y1="0" x2=".25" y2="1">'
+'<stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8c76a"/><stop offset="1" stop-color="#5a3a08"/>'
+'</linearGradient>'
+'<radialGradient id="'+k+'hl" cx="35%" cy="25%" r="60%">'
+'<stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>'
+'</radialGradient>'
+'<filter id="'+k+'d" x="-35%" y="-35%" width="170%" height="170%">'
+'<feDropShadow dx="0" dy="1.2" stdDeviation=".8" flood-color="#000" flood-opacity=".85"/>'
+'</filter>'
+'<radialGradient id="'+k+'gem" cx="35%" cy="30%" r="72%">'
+'<stop offset="0" stop-color="#4ad878"/><stop offset=".55" stop-color="#1a7838"/><stop offset="1" stop-color="#0a3018"/>'
+'</radialGradient>'
+'</defs>'
+'<g filter="url(#'+k+'d)">'
+'<path d="M32 4 L60 32 L32 60 L4 32 Z" fill="url(#'+k+'m)" stroke="#2a1804" stroke-width=".8"/>'
+'<path d="M32 10 L54 32 L32 54 L10 32 Z" fill="#5a3a08"/>'
+'<path d="M32 14 L50 32 L32 50 L14 32 Z" fill="url(#'+k+'gem)" stroke="#0a3018" stroke-width=".6"/>'
+'<path d="M32 18 L44 32 L32 46 L20 32 Z" fill="#fff" opacity=".15"/>'
+'<circle cx="25" cy="24" r="1.4" fill="#fff"/><circle cx="41" cy="41" r="1.2" fill="#fff"/>'
+'<g stroke="#fff3b0" stroke-width="2" stroke-linecap="round" fill="none">'
+'<path d="M6 32 L12 32 M58 32 L52 32 M32 6 L32 12 M32 58 L32 52"/>'
+'</g>'
+'</g>'
+'</svg>';
}
function markIconSVG(){
const k='mkic'+(++_iid);
return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%">'
+'<defs>'
+'<linearGradient id="'+k+'m" x1="0" y1="0" x2=".25" y2="1">'
+'<stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8c76a"/><stop offset="1" stop-color="#5a3a08"/>'
+'</linearGradient>'
+'<radialGradient id="'+k+'disc" cx="40%" cy="30%" r="78%">'
+'<stop offset="0" stop-color="#1e3a6a"/><stop offset=".6" stop-color="#0e1e3e"/><stop offset="1" stop-color="#050b18"/>'
+'</radialGradient>'
+'<radialGradient id="'+k+'rim" cx="35%" cy="22%" r="82%">'
+'<stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e8c76a"/><stop offset="1" stop-color="#5a3a08"/>'
+'</radialGradient>'
+'<filter id="'+k+'d" x="-35%" y="-35%" width="170%" height="170%">'
+'<feDropShadow dx="0" dy="1.2" stdDeviation=".8" flood-color="#000" flood-opacity=".85"/>'
+'</filter>'
+'</defs>'
+'<circle cx="32" cy="32" r="30" fill="url(#'+k+'disc)"/>'
+'<circle cx="32" cy="32" r="30" fill="none" stroke="url(#'+k+'rim)" stroke-width="2.6"/>'
+'<g filter="url(#'+k+'d)">'
+'<circle cx="32" cy="32" r="20" fill="none" stroke="url(#'+k+'m)" stroke-width="3.4"/>'
+'<path d="M32 22 L34 30 L42 32 L34 34 L32 42 L30 34 L22 32 L30 30 Z" fill="#e8c76a" stroke="#fff3b0" stroke-width=".5"/>'
+'<circle cx="32" cy="32" r="2.4" fill="#4ad878"/>'
+'</g>'
+'</svg>';
}
function goldCoinSVG(sz){
const s=sz||22;
const k='gc'+(++_iid);
return '<svg viewBox="0 0 32 32" width="'+s+'" height="'+s+'" style="display:block" aria-hidden="true">'
+'<defs><radialGradient id="'+k+'g" cx="35%" cy="35%">'
+'<stop offset="0" stop-color="#ffe9a0"/><stop offset=".7" stop-color="#d9a636"/><stop offset="1" stop-color="#8a611a"/>'
+'</radialGradient></defs>'
+'<circle cx="16" cy="16" r="14" fill="url(#'+k+'g)" stroke="#6b4a12" stroke-width="2"/>'
+'<circle cx="16" cy="16" r="9.5" fill="none" stroke="#8a611a" stroke-width="1" opacity=".65"/>'
+'<path d="M16 10 L18 14.5 L23 15 L19.5 18.5 L20.5 23 L16 20.7 L11.5 23 L12.5 18.5 L9 15 L14 14.5 Z" fill="#8a611a" opacity=".8"/>'
+'</svg>';
}
function adIcon(sz){
return '<span style="display:inline-block;width:'+sz+'px;height:'+sz+'px;vertical-align:-.15em;line-height:0">'+coinIconSVG()+'</span>';
}
function markIcon(sz){
return '<span style="display:inline-block;width:'+sz+'px;height:'+sz+'px;vertical-align:-.15em;line-height:0">'+markIconSVG()+'</span>';
}
function goldIcon(sz){
return '<span style="display:inline-block;width:'+sz+'px;height:'+sz+'px;vertical-align:-.15em;line-height:0">'+goldCoinSVG(sz)+'</span>';
}
function getAdCoins(){return P.adcoins;}
function spendAdCoins(n){
if(P.adcoins<n)return false;
P.adcoins-=n;
saveP();
updateAdCoins();
return true;
}

const GL='radial-gradient(circle at 30% 15%,rgba(255,255,255,.10),transparent 45%)';
const PLP='linear-gradient(#f6ead0,#e6d2a8)';
const css=document.createElement('style');
css.textContent=':root{--fz:1;--cz:1}'
+'#panel .txt{font-size:calc(17px*var(--fz))!important}'
+'.para{font-size:calc(11px*var(--fz))!important}'
+'.title{font-size:calc(clamp(26px,6vw,44px)*var(--fz))!important}'
+'.foe .ico{font-size:calc(44px*var(--fz))!important}'
+'.foe .nm{font-size:calc(20px*var(--fz))!important}'
+'.frow{font-size:calc(20px*var(--fz))!important}'
+'.log{font-size:calc(14px*var(--fz))!important}'
+'#panel .foe div[style]{font-size:calc(13px*var(--fz))!important}'
+'.heart{font-size:calc(33px*var(--fz))!important}'
+'.badge{font-size:calc(13px*var(--fz))!important}'
+'.purse .pl1,.purse .pl2{font-size:calc(13px*var(--fz))!important}'
+'.gold{font-size:calc(15px*var(--fz))!important}'
+'.btn{font-size:calc(14px*var(--fz))!important}'
+'.toast{font-size:calc(14px*var(--fz))!important}'
+'.invbox h3{font-size:calc(18px*var(--fz))!important}'
+'.slot{font-size:calc(14px*var(--fz))!important}'
+'.slot .d{font-size:calc(12.5px*var(--fz))!important}'
+'.ct{display:flex;align-items:center;justify-content:center;text-align:center;min-height:calc(2.5em + 16px*var(--cz) + 4px)!important;background:var(--cplaq)!important;color:var(--cplaqi)!important;border-color:var(--cplaqb)!important;font-size:calc(clamp(12px,1.5vw,14.5px)*max(var(--fz),var(--cz)))!important;padding:calc(8px*var(--cz)) calc(7px*var(--cz))!important}'
+'.ct>span{display:inline;text-align:center;line-height:1.25}'
+'.cg{font-size:calc(10.5px*max(var(--fz),var(--cz)))!important;color:var(--ctag)!important}'
+'.cardwrap .cn{width:calc(26px*var(--cz))!important;height:calc(26px*var(--cz))!important;font-size:calc(15px*var(--cz))!important}'
/* ⚠️ Ширина карты ограничена сверху половиной ширины экрана минус отступы.
   Это гарантирует, что на телефоне в ряд помещается минимум две карты,
   даже если в настройках выбран большой размер карт (x1.5 или x2).
   На широких экранах ограничение не действует: min() возвращает первое
   выражение (базовую ширину с множителем), потому что оно меньше. */
+'.card{width:min(calc(clamp(115px,19.8vw,151px)*var(--cz)*1.1),calc((100vw - 50px)/2))!important;padding-bottom:calc(10px + 22px*var(--cz))!important;background:var(--cbg)!important;border-color:var(--cbr)!important}'
+'.card::before{border-color:var(--cb2)!important;background-image:radial-gradient(circle,var(--cdot) 1.4px,transparent 1.9px)!important;background-size:calc(13px*var(--cz))!important}'
+'.card::after{content:var(--cglyph)!important;color:var(--cglyc)!important;font-size:calc(var(--cgfs)*var(--cz))!important;top:var(--cgtop)!important;left:var(--cgleft)!important;right:var(--cgright)!important;transform:var(--cgtr)!important}'
+'#cards{gap:calc(14px*var(--cz))!important;min-height:calc(165px*var(--cz))!important}'
+'.srow{margin-bottom:12px;text-align:center}'
+'.srow b{display:block;margin-bottom:6px}'
+'.sbtns{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center}'
+'.sbtn.on{background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c}'
+'.sbtn-val{display:inline-flex;align-items:center;justify-content:center;min-width:44px;padding:5px 10px;font-size:14px;color:#e8c76a;font-weight:700}'
+'.marks{color:#e8c76a;font-weight:400}'
+'.hint{font-size:11.5px;opacity:.7;margin:-4px 0 8px}'
+'.srow.off{opacity:.35;pointer-events:none}'
+'.sgroup{border:2px solid rgba(122,90,56,.55);border-radius:12px;padding:10px 12px 6px;margin:0 auto 14px auto;background:rgba(0,0,0,.18);width:fit-content;max-width:100%}'
+'.sgroup-title{font-variant:small-caps;letter-spacing:2px;color:#f0e2c4;font-size:14px;text-align:center;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(122,90,56,.35)}'
+'.sgroup .srow{margin-bottom:10px}'
+'.sgroup .srow:last-child{margin-bottom:4px}'
+'.settitle{display:flex;align-items:center;justify-content:center;gap:12px;font-variant:small-caps;letter-spacing:2px;color:#f0e2c4;font-size:18px;margin-bottom:10px;text-align:center}'
+'.settitle svg{display:block;flex-shrink:0;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}'
+'@media(max-width:640px){#panel .txt{font-size:calc(15px*var(--fz))!important}.heart{font-size:calc(27px*var(--fz))!important}}';
const DG='--cbg:'+GL+',repeating-linear-gradient(45deg,#2e4d27 0 9px,#38582e 9px 18px),#2e4d27;--cbr:#5b422a;--cb2:rgba(122,90,56,.75);--cdot:rgba(15,32,12,.5);--cglyph:"❧";--cglyc:rgba(232,199,106,.75);--cplaq:'+PLP+';--cplaqi:#2f2417;--cplaqb:#5b422a;--ctag:#d9ecb8';
css.textContent+='body{'+DG+';--cgfs:14px;--cgtop:9px;--cgright:11px;--cgleft:auto;--cgtr:none}';
document.head.appendChild(css);

function apply(){
document.documentElement.style.setProperty('--fz',FZ[st.f]);
document.documentElement.style.setProperty('--cz',CZ[st.c]);
if(window.Cardbacks&&Cardbacks.SKINS){
const valid=Cardbacks.SKINS.some(function(sk){return sk.id===P.skin;});
if(!valid)P.skin=Cardbacks.SKINS[0].id;
Cardbacks.applySkin(P.skin);
}else{
document.body.setAttribute('data-skin',P.skin);
}
try{localStorage.setItem('zl_set',JSON.stringify(st));}catch(e){}
}

/* ===== Деревянная шестерёнка для заголовка окна настроек =====
   Форма — как у кнопки в верхней панели: восемь зубцов через 45 градусов,
   тело круглое, крупное отверстие в центре. Заливка — деревянный градиент
   от светлого тёплого коричневого сверху к тёмному снизу. Идентификатор
   градиента уникален (gearWoodHeadG), чтобы не столкнуться с градиентом
   шестерёнки в кнопке index.html.
   ↙️ Используется в: разметка окна настроек (в этом же файле) */
function headerGearSVG(size){
const s=size||24;
return '<svg viewBox="0 0 48 48" width="'+s+'" height="'+s+'" aria-hidden="true">'
+'<defs>'
+'<linearGradient id="gearWoodHeadG" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0" stop-color="#c9a06a"/>'
+'<stop offset="0.5" stop-color="#9a6a3a"/>'
+'<stop offset="1" stop-color="#6b4520"/>'
+'</linearGradient>'
+'</defs>'
+'<g fill="url(#gearWoodHeadG)" stroke="#3a2410" stroke-width="1.5" stroke-linejoin="round">'
+'<rect x="20" y="2" width="8" height="14" rx="1.5"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(45 24 24)"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(90 24 24)"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(135 24 24)"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(180 24 24)"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(225 24 24)"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(270 24 24)"/>'
+'<rect x="20" y="2" width="8" height="14" rx="1.5" transform="rotate(315 24 24)"/>'
+'<circle cx="24" cy="24" r="13"/>'
+'</g>'
+'<circle cx="24" cy="24" r="6" fill="#1a0e06" stroke="#000000" stroke-width="1"/>'
+'<path d="M17 19 Q24 15 31 19" fill="none" stroke="#e8c088" stroke-width="1.2" opacity=".5" stroke-linecap="round"/>'
+'</svg>';
}

/* Возвращает текущие настройки автопрокрутки.
   mode: 0 — плавный, 1 — шаговый.
   step: количество строк за один шаг (1–5).
   ↙️ Используется в: engine_render_screen.js */
window.getAutoSettings=function(){
  return {enabled:st.auto===1, speed:st.aspd, mode:st.mode, step:st.step};
};

function showAd(onDone){
let done=false;
const fin=function(){if(!done){done=true;onDone();}};
if(window.ysdk&&ysdk.adv&&ysdk.adv.showRewardedVideo){
try{
ysdk.adv.showRewardedVideo({callbacks:{
onOpen:function(){},
onRewarded:function(){fin();},
onClose:function(){fin();},
onError:function(){toast('Реклама недоступна — действие засчитано');fin();}
}});
return;
}catch(e){}
}
toast('Тест-режим: видео недоступно, действие засчитано');
setTimeout(fin,700);
}
window.showAdGame=showAd;

const ov=document.createElement('div');
ov.className='ovl hidden';ov.id='set';
ov.innerHTML='<div class="invbox"><div class="settitle">'+headerGearSVG(26)+'<span>Настройки</span>'+headerGearSVG(26)+'</div>'
+'<div class="srow"><b>Рубашка карт</b>'
+'<div class="sbtns"><button class="btn" id="skopenbtn">Рубашки карт</button></div></div>'
+'<div class="srow"><b>Размер шрифта</b><div class="sbtns" id="sfbox"></div></div>'
+'<div class="srow"><b>Размер карт</b><div class="sbtns" id="scbox"></div></div>'
+'<div class="sgroup">'
+'<div class="sgroup-title">Автопрокрутка текста</div>'
+'<div class="srow"><b>Включение</b>'
+'<div class="sbtns">'
+'<button class="btn sbtn" id="autoon">Включена</button>'
+'<button class="btn sbtn" id="autooff">Выключена</button>'
+'</div></div>'
+'<div class="srow"><b>Скорость</b>'
+'<div class="sbtns">'
+'<button class="btn sbtn" id="aspd_minus">−</button>'
+'<span class="sbtn-val" id="aspd_val">0,4</span>'
+'<button class="btn sbtn" id="aspd_plus">+</button>'
+'</div></div>'
+'<div class="srow"><b>Режим скролла</b>'
+'<div class="sbtns">'
+'<button class="btn sbtn" id="mode_smooth">Плавный</button>'
+'<button class="btn sbtn" id="mode_step">Шаговый</button>'
+'</div></div>'
+'<div class="srow" id="step_row"><b>Шаг скролла (строк)</b>'
+'<div class="sbtns">'
+'<button class="btn sbtn" id="step_minus">−</button>'
+'<span class="sbtn-val" id="step_val">3</span>'
+'<button class="btn sbtn" id="step_plus">+</button>'
+'</div></div>'
+'</div>'
+'<div class="srow"><b>Игра</b><div class="sbtns"><button class="btn" id="restartbtn">▶ Начать сначала</button></div></div>'
+'<div style="text-align:center;margin-top:10px"><button class="btn" id="setc">Закрыть</button></div>'
+(typeof window.openItemGallery==='function'?'<div style="text-align:center;margin-top:8px"><button class="btn" id="itgbtn">Предметы</button></div>':'')+'</div>';
document.body.appendChild(ov);

function updateMarks(){
const mb=document.querySelector('.marks-box');
if(mb)mb.innerHTML=markIcon(26)+' <span class="purse-n">'+P.marks+'</span>';
}
function updateAdCoins(){
const ab=document.querySelector('.adcoins-box');
if(ab)ab.innerHTML=adIcon(26)+' <span class="purse-n">'+P.adcoins+'</span>';
const n=document.getElementById('adcnum');
if(n)n.textContent=P.adcoins;
const gn=document.getElementById('goldcoins');
if(gn)gn.textContent=P.adcoins;
}

function openAdCoinDialog(){
const old=document.getElementById('adcoinov');
if(old&&old.parentNode)old.parentNode.removeChild(old);
const ov2=document.createElement('div');
ov2.className='ovl';ov2.id='adcoinov';
ov2.innerHTML='<div class="invbox detbox"><h3 style="display:flex;align-items:center;justify-content:center;gap:8px">Осколок '+adIcon(26)+' <b id="adcnum" class="purse-n">'+P.adcoins+'</b></h3>'
+'<div class="adchint">Тестовая версия:<div class="hgap"></div>при старте выдано 1000 осколков</div>'
+'<button class="btn adbtn" id="ad_get"><span>Реклама +1</span>'+adIcon(18)+'</button>'
+'<button class="btn adbtn" id="ad_close1">Закрыть</button>'
+'</div>';
document.body.appendChild(ov2);
ov2.querySelector('#ad_get').addEventListener('click',function(){
showAd(function(){P.adcoins+=1;saveP();updateAdCoins();toast('Получено: +1 осколок');});
});
ov2.querySelector('#ad_close1').addEventListener('click',function(){
if(ov2.parentNode)document.body.removeChild(ov2);
});
ov2.addEventListener('click',function(e){if(e.target===ov2&&ov2.parentNode)document.body.removeChild(ov2);});
}

function openGoldDialog(){
const old=document.getElementById('goldov');
if(old&&old.parentNode)old.parentNode.removeChild(old);
const ov3=document.createElement('div');
ov3.className='ovl';ov3.id='goldov';

function packBtn(goldAmt, coinCost){
  return '<button class="btn adbtn goldpack" data-gold="'+goldAmt+'" data-cost="'+coinCost+'">'
    +'<span>'+goldIcon(22)+' '+goldAmt+' = '+coinCost+' '+adIcon(18)+'</span>'
    +'</button>';
}

ov3.innerHTML='<div class="invbox detbox">'
  +'<h3 style="display:flex;align-items:center;justify-content:center;gap:8px">Ваше золото '+goldIcon(28)+' <b id="goldnum" class="purse-n">'+S.gold+'</b></h3>'
  +'<div class="adchint">Золото можно получить<br>в процессе прохождения игры.</div>'
  +'<div class="adchint" style="margin-top:-4px">Или получить за осколки:</div>'
  +packBtn(1,10)
  +packBtn(5,50)
  +packBtn(10,100)
  +'<div style="text-align:center;margin-top:8px"><button class="btn" id="gold_close">Закрыть</button></div>'
  +'</div>';

document.body.appendChild(ov3);

ov3.querySelectorAll('.goldpack').forEach(function(btn){
  btn.addEventListener('click',function(){
    const goldAmt=parseInt(btn.getAttribute('data-gold'),10);
    const cost=parseInt(btn.getAttribute('data-cost'),10);
    if(P.adcoins<cost){toast('Не хватает осколков: нужно '+cost+', у вас '+P.adcoins);return;}
    function doBuy(){
      if(typeof window.spendAdCoins!=='function'||!window.spendAdCoins(cost)){
        toast('Не удалось списать осколки');return;
      }
      S.gold+=goldAmt;
      save();
      const pn=document.querySelector('#invbox .pursewrap:not(.marks-box):not(.adcoins-box) .purse-n');
      if(pn)pn.textContent=S.gold;
      const gn=document.getElementById('goldnum');
      if(gn)gn.textContent=S.gold;
      toast('Обмен: '+cost+' осколков → '+goldAmt+' золота');
    }
    const name=goldAmt+' золота';
    if(typeof window.confirmBuy==='function'){
      window.confirmBuy(name, cost, doBuy);
    }else{
      doBuy();
    }
  });
});

ov3.querySelector('#gold_close').addEventListener('click',function(){
if(ov3.parentNode)document.body.removeChild(ov3);
});
ov3.addEventListener('click',function(e){if(e.target===ov3&&ov3.parentNode)document.body.removeChild(ov3);});
}

function openMarkDialog(){
const old=document.getElementById('markov');
if(old&&old.parentNode)old.parentNode.removeChild(old);
const ov4=document.createElement('div');
ov4.className='ovl';ov4.id='markov';
ov4.innerHTML='<div class="invbox detbox"><h3>Тайный символ</h3>'
+'<div style="text-align:center;margin:4px 0 10px">'+markIcon(56)+'</div>'
+'<div class="adchint">Можно получить только пройдя<div class="hgap"></div>ключевые сюжетные линии</div>'
+'<div style="text-align:center;margin-top:10px"><button class="btn" id="mark_close">Закрыть</button></div></div>';
document.body.appendChild(ov4);
ov4.querySelector('#mark_close').addEventListener('click',function(){
if(ov4.parentNode)document.body.removeChild(ov4);
});
ov4.addEventListener('click',function(e){if(e.target===ov4&&ov4.parentNode)document.body.removeChild(ov4);});
}

const mo=new MutationObserver(function(){
const invbox=document.getElementById('invbox');
if(invbox&&!invbox.querySelector('.marks-box')){
const head=invbox.querySelector('.invhead');
const adbox=document.createElement('div');
adbox.className='adcoins-box pursewrap';
adbox.title='Осколки: тест-версия, 1000 при старте';
adbox.innerHTML=adIcon(26)+' <span class="purse-n">'+P.adcoins+'</span>';
adbox.addEventListener('click',openAdCoinDialog);
const mbox=document.createElement('div');
mbox.className='marks-box pursewrap';
mbox.innerHTML=markIcon(26)+' <span class="purse-n">'+P.marks+'</span>';
mbox.addEventListener('click',openMarkDialog);
const purse=head?head.querySelector('.pursewrap:not(.marks-box):not(.adcoins-box)'):null;
if(purse)purse.addEventListener('click',openGoldDialog);
if(head&&purse&&purse.parentNode){
purse.parentNode.insertBefore(mbox,purse.nextSibling);
purse.parentNode.insertBefore(adbox,mbox);
}else if(head){
head.appendChild(adbox);
head.appendChild(mbox);
}else{
const bag=invbox.querySelector('.invh-bag')||invbox.querySelector('.pursewrap');
if(bag&&bag.parentNode){
bag.parentNode.insertBefore(mbox,bag.nextSibling);
bag.parentNode.insertBefore(adbox,mbox);
}
}
}
});
mo.observe(document.body,{childList:true,subtree:true});

function fmtAspd(v){
return v.toFixed(1).replace('.',',');
}

function build(){
const sf=ov.querySelector('#sfbox');sf.innerHTML='';
FZ.forEach(function(v,i){
const b=document.createElement('button');
b.className='btn sbtn'+(i===st.f?' on':'');
b.textContent=(i+1).toString();
b.addEventListener('click',function(){st.f=i;apply();build();});
sf.appendChild(b);
});
const sc=ov.querySelector('#scbox');sc.innerHTML='';
CZ.forEach(function(v,i){
const b=document.createElement('button');
b.className='btn sbtn'+(i===st.c?' on':'');
b.textContent='x'+v;
b.addEventListener('click',function(){st.c=i;apply();build();});
sc.appendChild(b);
});
const ao=ov.querySelector('#autoon');
const af=ov.querySelector('#autooff');
if(ao)ao.classList.toggle('on',st.auto===1);
if(af)af.classList.toggle('on',st.auto===0);
const aspd=ov.querySelector('#aspd_val');
if(aspd)aspd.textContent=fmtAspd(st.aspd);
const ms=ov.querySelector('#mode_smooth');
const mt=ov.querySelector('#mode_step');
if(ms)ms.classList.toggle('on',st.mode===0);
if(mt)mt.classList.toggle('on',st.mode===1);
const sr=ov.querySelector('#step_row');
if(sr)sr.classList.toggle('off',st.mode!==1);
const sv=ov.querySelector('#step_val');
if(sv)sv.textContent=st.step.toString();
}

document.getElementById('setb').addEventListener('click',function(){build();ov.classList.remove('hidden');});
ov.querySelector('#setc').addEventListener('click',function(){ov.classList.add('hidden');});
ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
ov.querySelector('#skopenbtn').addEventListener('click',function(){
if(window.Cardbacks)Cardbacks.openSkinSelect(P,saveP,toast);
});
ov.querySelector('#restartbtn').addEventListener('click',function(){
showAd(function(){
try{localStorage.removeItem('zl_save');}catch(e){}
hasSave=false;
S=newState();
go(1);
ov.classList.add('hidden');
toast('Игра начата сначала');
});
});

ov.querySelector('#autoon').addEventListener('click',function(){
st.auto=1;apply();build();
});
ov.querySelector('#autooff').addEventListener('click',function(){
st.auto=0;apply();build();
});
ov.querySelector('#aspd_minus').addEventListener('click',function(){
let v=st.aspd-ASPD_STEP;
v=Math.round(v*10)/10;
if(v<ASPD_MIN)v=ASPD_MIN;
st.aspd=v;apply();build();
});
ov.querySelector('#aspd_plus').addEventListener('click',function(){
let v=st.aspd+ASPD_STEP;
v=Math.round(v*10)/10;
if(v>ASPD_MAX)v=ASPD_MAX;
st.aspd=v;apply();build();
});
ov.querySelector('#mode_smooth').addEventListener('click',function(){
st.mode=0;apply();build();
});
ov.querySelector('#mode_step').addEventListener('click',function(){
st.mode=1;apply();build();
});
ov.querySelector('#step_minus').addEventListener('click',function(){
let v=st.step-1;
if(v<STEP_MIN)v=STEP_MIN;
st.step=v;apply();build();
});
ov.querySelector('#step_plus').addEventListener('click',function(){
let v=st.step+1;
if(v>STEP_MAX)v=STEP_MAX;
st.step=v;apply();build();
});

const itg=ov.querySelector('#itgbtn');
if(itg){
itg.addEventListener('click',function(){
if(typeof window.openItemGallery==='function'){window.openItemGallery();}
});
}

window.markIcon=markIcon;
window.adIcon=adIcon;
window.goldIcon=goldIcon;
window.updateMarks=updateMarks;
window.updateAdCoins=updateAdCoins;
window.getAdCoins=getAdCoins;
window.spendAdCoins=spendAdCoins;

apply();
})();