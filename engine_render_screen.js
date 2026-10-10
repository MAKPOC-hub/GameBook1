// engine_render_screen.js
// v1.0.15 -> v1.0.16
// Проект: GameBook1
// Функция: главный экран и экран боя — отрисовка текущего узла или текущего боя, автопрокрутка текста
// Изменение: длительность плавного движения внутри одного шага возвращена с 2000 на 1000 миллисекунд. Базовая длительность паузы между шагами остаётся удвоенной (1600 мс на строку)

'use strict';

let _autoRAF=null;
let _autoRunning=false;
let _autoBtn=null;
let _autoAccum=0;
let _autoPauseTimer=null;

(function _injectAutoBtnStyles(){
  if(document.getElementById('zl-auto-styles'))return;
  const st=document.createElement('style');
  st.id='zl-auto-styles';
  st.textContent=
  '.autoscroll-btn{position:absolute;top:0;right:0;z-index:8;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(20,28,16,.92);border:1px solid #8a6a44;color:#e8c76a;cursor:pointer;user-select:none;box-shadow:0 2px 6px rgba(0,0,0,.55);transition:background .15s,color .15s,border-color .15s}'
  +'.autoscroll-btn:hover{background:rgba(40,52,30,.95);color:#fff3cf;border-color:#b8d494}'
  +'.autoscroll-btn.off{color:#6a6a5a;background:rgba(20,28,16,.55);border-color:#4a4a3a}'
  +'.autoscroll-btn.off:hover{color:#a8a89a;border-color:#6a6a5a}'
  +'.autoscroll-btn svg{display:block}';
  document.head.appendChild(st);
})();

function _stopAuto(){
  _autoRunning=false;
  if(_autoRAF){cancelAnimationFrame(_autoRAF);_autoRAF=null;}
  if(_autoPauseTimer){clearTimeout(_autoPauseTimer);_autoPauseTimer=null;}
  if(_autoBtn)_autoBtn.classList.add('off');
}

/* ===== Создать новую кнопку автопрокрутки =====
   На каждом новом экране кнопка создаётся заново — так на ней не копятся
   старые обработчики нажатия. Если в текущей панели уже есть кнопка,
   старая удаляется.
   ↙️ Используется в: attachTxtScroll (в этом же файле) */
function _createAutoBtn(){
  const wrap=document.querySelector('#panel .txtscroll');
  if(!wrap)return null;
  const old=wrap.querySelector('.autoscroll-btn');
  if(old&&old.parentNode)old.parentNode.removeChild(old);
  const btn=document.createElement('div');
  btn.className='autoscroll-btn';
  btn.title='Автопрокрутка текста';
  btn.innerHTML='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3 L8 7 L12 3 M4 9 L8 13 L12 9"/></svg>';
  wrap.appendChild(btn);
  _autoBtn=btn;
  return btn;
}

function _getLineHeight(el){
  if(!el)return 24;
  const cs=getComputedStyle(el);
  const lh=cs.lineHeight;
  if(lh&&lh!=='normal'){
    const n=parseFloat(lh);
    if(!isNaN(n)&&n>0)return n;
  }
  const fs=parseFloat(cs.fontSize);
  if(!isNaN(fs)&&fs>0)return fs*1.55;
  return 24;
}

/* ===== Чтение настроек автопрокрутки с защитой от нечисловых значений =====
   Возвращает объект:
   enabled — включена ли автопрокрутка
   mode    — 0 плавный, 1 шаговый
   speed   — множитель скорости, гарантированно число от 0.05 до 10
   step    — количество строк, гарантированно целое от 1 до 5
   ↙️ Используется в: attachTxtScroll, smoothFrame, stepPausePhase (в этом же файле) */
function _readAutoSafe(){
  let src={};
  try{
    if(typeof window.getAutoSettings==='function'){
      const r=window.getAutoSettings();
      if(r&&typeof r==='object')src=r;
    }
  }catch(e){}
  const enabled=(src.enabled===true);
  const mode=(src.mode===1)?1:0;
  let speed=parseFloat(src.speed);
  if(!isFinite(speed)||speed<=0)speed=0.5;
  if(speed<0.05)speed=0.05;
  if(speed>10)speed=10;
  let step=parseInt(src.step,10);
  if(!isFinite(step)||step<1)step=3;
  if(step>5)step=5;
  return {enabled:enabled,mode:mode,speed:speed,step:step};
}

/* ===== Пауза между шагами в миллисекундах =====
   Формула: базовая длительность на одну строку (1600 мс) умножается на число
   строк шага и делится на скорость.
   При скорости 1.0 и шаге 1 — 1.6 секунды. При скорости 0.1 и шаге 1 — 16 секунд.
   При скорости 0.1 и шаге 3 — 48 секунд. При скорости 3.0 и шаге 3 — 1.6 секунды.
   Ограничение снизу — 500 мс, сверху — 60000 мс.
   ↙️ Используется в: stepPausePhase (в этом же файле) */
function _stepPauseMs(auto){
  const perLineMs=1600;
  let ms=auto.step*perLineMs/auto.speed;
  if(!isFinite(ms)||ms<500)ms=500;
  if(ms>60000)ms=60000;
  return ms;
}

function attachTxtScroll(){
  const ptxt=document.getElementById('ptxt');
  if(!ptxt)return;
  const hintTop=document.getElementById('scrollhint_top');
  const hintBot=document.getElementById('scrollhint_bottom');
  if(!hintTop||!hintBot)return;

  if(_autoRAF){cancelAnimationFrame(_autoRAF);_autoRAF=null;}
  if(_autoPauseTimer){clearTimeout(_autoPauseTimer);_autoPauseTimer=null;}
  _autoRunning=false;
  _autoAccum=0;

  function update(){
    const st=ptxt.scrollTop;
    const ch=ptxt.clientHeight;
    const sh=ptxt.scrollHeight;
    hintTop.classList.toggle('on', st>4);
    hintBot.classList.toggle('on', st+ch < sh-4);
  }
  ptxt.addEventListener('scroll',update,{passive:true});
  hintTop.addEventListener('click',function(){
    _stopAuto();
    ptxt.scrollBy({top:-Math.round(ptxt.clientHeight*0.8),behavior:'smooth'});
  });
  hintBot.addEventListener('click',function(){
    _stopAuto();
    ptxt.scrollBy({top:Math.round(ptxt.clientHeight*0.8),behavior:'smooth'});
  });
  ptxt.scrollTop=0;
  requestAnimationFrame(update);
  window.addEventListener('resize',update);

  const hasScroll=ptxt.scrollHeight > ptxt.clientHeight+4;
  const auto=_readAutoSafe();

  try{
    console.log('[autoscroll] enabled='+auto.enabled+' mode='+auto.mode+' speed='+auto.speed+' step='+auto.step+' hasScroll='+hasScroll+' scrollH='+ptxt.scrollHeight+' clientH='+ptxt.clientHeight);
  }catch(e){}

  if(!auto.enabled||!hasScroll){
    if(_autoBtn&&_autoBtn.parentNode){_autoBtn.parentNode.removeChild(_autoBtn);_autoBtn=null;}
    return;
  }

  const btn=_createAutoBtn();
  if(!btn)return;

  _autoRunning=true;
  btn.classList.remove('off');

  /* ===== Плавный режим ===== */
  function smoothFrame(){
    if(!_autoRunning)return;
    const a=_readAutoSafe();
    if(!a.enabled){_stopAuto();return;}
    if(a.mode===1){
      _autoAccum=0;
      stepPausePhase();
      return;
    }
    _autoAccum+=a.speed*0.5;
    const move=Math.floor(_autoAccum);
    if(move>0){
      ptxt.scrollTop+=move;
      _autoAccum-=move;
    }
    if(ptxt.scrollTop+ptxt.clientHeight>=ptxt.scrollHeight-1){
      _stopAuto();
      return;
    }
    _autoRAF=requestAnimationFrame(smoothFrame);
  }

  /* ===== Шаговый режим =====
     Один цикл: пауза → плавное движение за 1 секунду → пауза → плавное движение...
     Пауза вычисляется функцией _stepPauseMs (базовая длительность на строку — 1600 мс,
     поделённая на скорость из настроек), длительность движения — константа
     MOVE_MS (1000 миллисекунд). Во время движения текст поднимается постепенно,
     покадрово, а не мгновенным скачком — чтобы глаз не терял место чтения.
     ↙️ Используется в: smoothFrame, кнопка, начальный автозапуск */
  const MOVE_MS=1000;
  function stepPausePhase(){
    if(!_autoRunning){
      try{console.log('[step] not running, exit');}catch(e){}
      return;
    }
    const max=ptxt.scrollHeight-ptxt.clientHeight;
    if(ptxt.scrollTop>=max-1){
      try{console.log('[step] at end, stop');}catch(e){}
      _stopAuto();return;
    }
    const a=_readAutoSafe();
    if(!a.enabled){_stopAuto();return;}
    if(a.mode!==1){
      _autoRAF=requestAnimationFrame(smoothFrame);
      return;
    }
    const pauseMs=_stepPauseMs(a);
    try{
      console.log('[step] waiting '+pauseMs+'ms (speed='+a.speed+', step='+a.step+')');
    }catch(e){}
    _autoPauseTimer=setTimeout(function(){
      _autoPauseTimer=null;
      stepMovePhase();
    }, pauseMs);
  }

  function stepMovePhase(){
    if(!_autoRunning)return;
    const maxNow=ptxt.scrollHeight-ptxt.clientHeight;
    if(ptxt.scrollTop>=maxNow-1){
      _stopAuto();return;
    }
    const aNow=_readAutoSafe();
    if(!aNow.enabled){_stopAuto();return;}
    if(aNow.mode!==1){
      _autoRAF=requestAnimationFrame(smoothFrame);
      return;
    }
    const lineH=_getLineHeight(ptxt);
    const stepPx=aNow.step*lineH;
    const from=ptxt.scrollTop;
    const to=Math.min(from+stepPx, maxNow);
    const startT=performance.now();
    try{
      console.log('[step] move from='+from.toFixed(1)+' to='+to.toFixed(1)+' max='+maxNow.toFixed(1)+' stepPx='+stepPx.toFixed(1)+' lineH='+lineH.toFixed(1)+' dur='+MOVE_MS+'ms');
    }catch(e){}
    function frame(){
      if(!_autoRunning)return;
      const elapsed=performance.now()-startT;
      let k=elapsed/MOVE_MS;
      if(k>1)k=1;
      if(k<0)k=0;
      ptxt.scrollTop=from+(to-from)*k;
      if(k<1){
        _autoRAF=requestAnimationFrame(frame);
      }else{
        _autoRAF=null;
        stepPausePhase();
      }
    }
    _autoRAF=requestAnimationFrame(frame);
  }

  if(auto.mode===1){
    stepPausePhase();
  }else{
    _autoRAF=requestAnimationFrame(smoothFrame);
  }

  ptxt.addEventListener('touchstart',function(){_stopAuto();},{passive:true});
  ptxt.addEventListener('mousedown',function(){_stopAuto();});
  ptxt.addEventListener('wheel',function(){_stopAuto();},{passive:true});

  btn.addEventListener('click',function(){
    if(_autoRunning){
      _stopAuto();
    }else{
      if(ptxt.scrollTop+ptxt.clientHeight>=ptxt.scrollHeight-1){
        ptxt.scrollTop=0;
      }
      _autoAccum=0;
      _autoRunning=true;
      btn.classList.remove('off');
      const a=_readAutoSafe();
      if(a.mode===1){
        stepPausePhase();
      }else{
        _autoRAF=requestAnimationFrame(smoothFrame);
      }
    }
  });
}

/* ===== Главный экран ===== */
function render(){
  if(!S)return;
  hud();
  if(S.combat){renderCombat();return;}
  const n=NODES[S.node];
  if(!n)return;
  $('#bg').innerHTML=BGS[n.bg]();
  const t=(typeof n.t==='function')?n.t(S):n.t;
  $('#panel').innerHTML='<div class="para">§'+S.node+'</div>'
    +'<div class="txt"><div class="txtscroll">'
    +'<div class="scrollhint top" id="scrollhint_top" title="Прокрутить вверх">'+CHEV_UP+'</div>'
    +'<div id="ptxt">'+t.replace(/\n\n/g,'<br>')+'</div>'
    +'<div class="scrollhint bottom" id="scrollhint_bottom" title="Прокрутить вниз">'+CHEV_DOWN+'</div>'
    +'</div></div>';
  attachTxtScroll();
  let cs=(typeof n.c==='function')?n.c(S):(n.c||[]);
  cs=cs.filter(function(c){return !c.req||c.req(S);});
  const box=$('#cards');box.innerHTML='';
  const skinArt=(window.Cardbacks&&typeof window.Cardbacks.getArt==='function')?window.Cardbacks.getArt(window.Cardbacks.getCurrentSkin()):'';
  const artHTML=skinArt?'<div class="card-art-bg">'+skinArt+'</div>':'';
  cs.forEach(function(c,i){box.appendChild(buildCard(c,i,artHTML));});
  renderQuickbar();
}

/* ===== Экран боя ===== */
function renderCombat(){
  const cb=S.combat,f=FOES[cb.id];
  const n=NODES[S.node];
  $('#bg').innerHTML=BGS[n.bg]();
  _stopAuto();
  if(_autoBtn&&_autoBtn.parentNode){_autoBtn.parentNode.removeChild(_autoBtn);_autoBtn=null;}
  let hearts='';for(let i=0;i<f.h;i++)hearts+='<span class="heart'+(i<cb.hp?' on':'')+'">'+ico('heart',22)+'</span>';
  let log='';cb.log.slice(-6).forEach(function(l){log+='<div>'+l+'</div>';});
  const foeIcon=(window.Icons&&Icons[f.i])?Icons[f.i](44):'';
  $('#panel').innerHTML='<div class="para">§'+S.node+' · бой</div><div class="txt no-clamp"><div class="foe"><div class="ico">'+foeIcon+'</div><div><div class="nm">'+f.n+'</div><div class="frow">'+hearts+'</div><div style="font-size:13px;opacity:.7">Оба бросают по 2 кубика. Кто больше — тот ранит.</div></div></div><div class="log">'+log+'</div></div>';
  let acts=[];
  if(cb.flashChoose){
    acts.push({t:ico('run')+'Сбежать',ca:'flash_escape'});
    acts.push({t:'Продолжить',ca:'flash_continue'});
  }else{
    acts.push({t:ico('sword')+'Атаковать',ca:'atk'});
    if(has('vory_knife')&&!cb.knifeUsed&&isReady('vory_knife'))acts.push({t:ico('sword')+'Бросок тени',ca:'knife'});
    if(has('flash')&&!cb.flashUsed&&isReady('flash'))acts.push({t:ico('flash')+'Вспышка',ca:'flash'});
    if(has('scroll_fire'))acts.push({t:ico('fire')+'Огненный шар',ca:'fire'});
    if(cb.flee)acts.push({t:ico('run')+'Бежать',ca:'flee'});
  }
  const box=$('#cards');box.innerHTML='';
  const skinArt=(window.Cardbacks&&typeof window.Cardbacks.getArt==='function')?window.Cardbacks.getArt(window.Cardbacks.getCurrentSkin()):'';
  const artHTML=skinArt?'<div class="card-art-bg">'+skinArt+'</div>':'';
  acts.forEach(function(c,i){box.appendChild(buildCard(c,i,artHTML));});
  renderQuickbar();
}