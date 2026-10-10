// cardbacks.js
// v1.1.4 -> v1.1.5
// Проект: GameBook1
// Функция: хранение 15 рубашек карт и галерея выбора/покупки рубашек
// Изменение: обновлена подсказка в галерее рубашек. Раньше было «Знаки выдаются за прохождение главы (4 знака)» — это устарело, потому что знаков теперь шесть и выдаются они за разные достижения. Теперь перечислены все условия получения знаков

(function(){
'use strict';

const GL='radial-gradient(circle at 30% 15%,rgba(255,255,255,.10),transparent 45%)';
const AG='radial-gradient(circle at 25% 20%,rgba(0,0,0,.35),transparent 45%),radial-gradient(circle at 75% 80%,rgba(0,0,0,.40),transparent 50%),repeating-linear-gradient(38deg,rgba(0,0,0,.14) 0 2px,transparent 2px 7px),repeating-linear-gradient(-52deg,rgba(255,255,255,.05) 0 2px,transparent 2px 8px)';
const PLP='linear-gradient(#f6ead0,#e6d2a8)';
const PLA='linear-gradient(#e8d5a8,#cdb27e)';

const SKINS=[
{id:'ag',n:'Древний лес',lock:0,bg:AG+',repeating-linear-gradient(45deg,#2a4023 0 9px,#33502a 9px 18px),#243a1e',br:'#b89b5e',cb2:'#c9a24a',cdot:'rgba(201,162,74,.30)',gl:'❦',glc:'#d9bd7a',big:0,plaq:PLA,plaqi:'#33260f',plaqb:'#7a5f2a',tag:'#e8d9a8'},
{id:'ay',n:'Древнее золото',lock:0,bg:AG+',repeating-linear-gradient(45deg,#7a5f1c 0 9px,#8f7024 9px 18px),#6e5418',br:'#d9bd7a',cb2:'#e0c887',cdot:'rgba(90,64,16,.40)',gl:'❦',glc:'#f0dca0',big:0,plaq:PLA,plaqi:'#33260f',plaqb:'#7a5f2a',tag:'#f2e2b0'},
{id:'ab',n:'Древняя лазурь',lock:0,bg:AG+',repeating-linear-gradient(45deg,#22365c 0 9px,#2a4069 9px 18px),#1c2e50',br:'#c9a24a',cb2:'#d9b25a',cdot:'rgba(160,190,230,.22)',gl:'❦',glc:'#d9bd7a',big:0,plaq:PLA,plaqi:'#33260f',plaqb:'#7a5f2a',tag:'#dce4f2'},
{id:'fn1',n:'Древо жизни',lock:5,cur:'ad',gl:'',bg:'radial-gradient(circle at 50% 35%, rgba(120,200,100,.16), transparent 60%),'+AG+',repeating-linear-gradient(45deg,#1f3a1c 0 9px,#264821 9px 18px), #1a2e18',br:'#a8862a',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="70" r="44" fill="none" stroke="#d4b060" stroke-width="2" opacity=".8"/><circle cx="50" cy="70" r="40" fill="none" stroke="#d4b060" stroke-width=".8" opacity=".5"/><g stroke="#5b3a20" fill="none" stroke-linecap="round"><path d="M50 104 L50 66" stroke-width="5"/><path d="M50 78 Q40 72 34 62" stroke-width="3"/><path d="M50 78 Q60 72 66 62" stroke-width="3"/><path d="M50 88 Q42 84 36 78" stroke-width="2.5"/><path d="M50 88 Q58 84 64 78" stroke-width="2.5"/><path d="M50 104 Q40 100 34 104" stroke-width="2.5"/><path d="M50 104 Q60 100 66 104" stroke-width="2.5"/></g><g fill="#4a8a3a"><circle cx="50" cy="52" r="12"/><circle cx="38" cy="58" r="9"/><circle cx="62" cy="58" r="9"/><circle cx="32" cy="66" r="7"/><circle cx="68" cy="66" r="7"/><circle cx="44" cy="44" r="8"/><circle cx="56" cy="44" r="8"/></g><g fill="#6ab04c" opacity=".7"><circle cx="46" cy="48" r="6"/><circle cx="56" cy="52" r="5"/><circle cx="38" cy="60" r="4"/></g><g fill="#d4b060"><circle cx="42" cy="50" r="1.5"/><circle cx="58" cy="46" r="1.5"/><circle cx="50" cy="58" r="1.5"/><circle cx="64" cy="60" r="1.5"/><circle cx="36" cy="62" r="1.5"/></g></svg>`},
{id:'fr4',n:'Ледник',lock:5,cur:'ad',gl:'',bg:'radial-gradient(circle at 50% 30%, rgba(200,240,255,.14), transparent 58%),'+AG+',repeating-linear-gradient(45deg,#132a38 0 9px,#183545 9px 18px), #0e202c',br:'#9fd0e8',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="36" r="14" fill="#dff0fa" opacity=".85"/><circle cx="50" cy="36" r="20" fill="none" stroke="#9fd0e8" stroke-width="1" opacity=".6"/><g stroke="#4a7a90" stroke-width="1.5"><path d="M8 96 L30 48 L44 74 L52 60 L70 96 Z" fill="#9fd0e8"/><path d="M52 96 L66 66 L92 96 Z" fill="#7fb0c8"/><path d="M30 48 L38 62 L30 66 L22 62 Z" fill="#fff"/><path d="M52 60 L58 70 L52 74 L46 70 Z" fill="#fff" opacity=".9"/><path d="M66 66 L71 75 L66 78 L61 75 Z" fill="#fff" opacity=".85"/></g><rect x="4" y="94" width="92" height="34" rx="4" fill="#3a6a80"/><path d="M4 100 Q20 96 34 100 Q50 104 66 100 Q82 96 96 100 L96 128 L4 128 Z" fill="#5a90a8" opacity=".7"/><g stroke="#bfe3f2" stroke-width="1.2" opacity=".7" fill="none"><path d="M14 108 L26 108 M40 114 L58 114 M68 106 L84 106 M22 120 L40 120"/></g><g fill="#dff0fa"><path d="M20 40 L21 43 L24 44 L21 45 L20 48 L19 45 L16 44 L19 43 Z"/><path d="M80 32 L81 35 L84 36 L81 37 L80 40 L79 37 L76 36 L79 35 Z"/></g></svg>`},
{id:'ar2',n:'Кристалл силы',lock:5,cur:'ad',gl:'',bg:'radial-gradient(circle at 30% 22%, rgba(180,140,255,.16), transparent 58%),'+AG+',repeating-linear-gradient(45deg,#2b1e48 0 9px,#352359 9px 18px), #221838',br:'#b08ae0',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="66" r="26" fill="#8a5aaa" opacity=".9"/><circle cx="50" cy="66" r="26" fill="none" stroke="#d8c8f0" stroke-width="2"/><circle cx="50" cy="66" r="20" fill="none" stroke="#fff" stroke-width="1" opacity=".5"/><circle cx="42" cy="56" r="6" fill="#e8dcfa" opacity=".8"/><g fill="none" stroke="#b08ae0" stroke-width="2.5"><ellipse cx="50" cy="66" rx="40" ry="12" transform="rotate(-20 50 66)"/><ellipse cx="50" cy="66" rx="40" ry="12" transform="rotate(20 50 66)" opacity=".6"/></g><g fill="#d8c8f0"><path d="M14 40 L16 44 L14 48 L12 44 Z"/><path d="M86 84 L88 88 L86 92 L84 88 Z"/><path d="M84 36 L86 40 L84 44 L82 40 Z"/></g><g stroke="#8a5aaa" stroke-width="3" stroke-linecap="round" fill="none"><path d="M50 100 L50 118"/><path d="M42 104 L42 114 M58 104 L58 114" opacity=".7"/></g><ellipse cx="50" cy="122" rx="22" ry="5" fill="#4a2a6a" opacity=".6"/><g fill="#fff" opacity=".85"><path d="M50 14 L52 19 L57 21 L52 23 L50 28 L48 23 L43 21 L48 19 Z"/></g></svg>`},
{id:'ru2',n:'Круг камней',lock:5,cur:'ad',gl:'',bg:'radial-gradient(circle at 30% 20%, rgba(140,160,220,.14), transparent 55%),'+AG+',repeating-linear-gradient(45deg,#212e48 0 9px,#28385a 9px 18px), #1a2438',br:'#8a96b0',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="72" cy="24" r="12" fill="#e8e4d0" opacity=".85"/><circle cx="76" cy="21" r="10" fill="#1a2438"/><rect x="20" y="60" width="12" height="50" rx="3" fill="#4a5468" stroke="#2a3444" stroke-width="1.5"/><rect x="44" y="52" width="12" height="58" rx="3" fill="#545e72" stroke="#2a3444" stroke-width="1.5"/><rect x="68" y="60" width="12" height="50" rx="3" fill="#4a5468" stroke="#2a3444" stroke-width="1.5"/><rect x="17" y="54" width="66" height="8" rx="3" fill="#5a6478" stroke="#2a3444" stroke-width="1.5"/><rect x="32" y="84" width="10" height="30" rx="3" fill="#3e4858" stroke="#2a3444" stroke-width="1.2" opacity=".9"/><rect x="58" y="84" width="10" height="30" rx="3" fill="#3e4858" stroke="#2a3444" stroke-width="1.2" opacity=".9"/><path d="M14 116 Q50 108 86 116" stroke="#2a3a4a" stroke-width="4" fill="none"/><g fill="#c0d0e8" opacity=".8"><circle cx="18" cy="26" r="1.4"/><circle cx="30" cy="16" r="1.2"/><circle cx="44" cy="22" r="1.5"/><circle cx="58" cy="14" r="1.2"/><circle cx="88" cy="44" r="1.3"/><circle cx="10" cy="52" r="1.2"/></g></svg>`},
{id:'kd2',n:'Замок',lock:7,cur:'ad',gl:'',bg:'radial-gradient(circle at 30% 20%, rgba(140,170,220,.14), transparent 55%),'+AG+',repeating-linear-gradient(45deg,#2c3b5c 0 9px,#344670 9px 18px), #24304a',br:'#8ab0d0',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="76" cy="24" r="11" fill="#e8e4d0" opacity=".85"/><path d="M20 116 L20 76 L28 76 L28 64 L34 64 L34 76 L44 76 L44 56 L50 48 L56 56 L56 76 L66 76 L66 64 L72 64 L72 76 L80 76 L80 116 Z" fill="#3e4a60" stroke="#1e2a3c" stroke-width="2"/><g fill="#1e2a3c"><rect x="30" y="90" width="6" height="10" rx="3"/><rect x="46" y="86" width="8" height="14" rx="4"/><rect x="64" y="90" width="6" height="10" rx="3"/></g><g fill="#ffd23f" opacity=".9"><rect x="31" y="92" width="4" height="6" rx="2"/><rect x="65" y="92" width="4" height="6" rx="2"/></g><path d="M50 48 L50 36 L60 40 L50 44" fill="#b03030" stroke="#7a1818" stroke-width="1"/><path d="M28 64 L28 54 L36 57 L28 60" fill="#b03030" stroke="#7a1818" stroke-width="1"/><path d="M12 118 Q50 110 88 118" stroke="#2a3a4a" stroke-width="4" fill="none"/><g fill="#c0d0e8" opacity=".8"><circle cx="16" cy="30" r="1.3"/><circle cx="28" cy="20" r="1.2"/><circle cx="40" cy="28" r="1.4"/><circle cx="88" cy="48" r="1.2"/></g></svg>`},
{id:'li5',n:'Ореол',lock:7,cur:'ad',gl:'',bg:'radial-gradient(circle at 50% 40%, rgba(255,240,190,.22), transparent 60%),'+AG+',repeating-linear-gradient(45deg,#4a3e26 0 9px,#584a2f 9px 18px), #3c321e',br:'#f0d070',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><g stroke="#ffd23f" stroke-width="2.4" stroke-linecap="round"><path d="M50 14 L50 30 M50 110 L50 126 M14 70 L30 70 M70 70 L86 70"/><path d="M25 45 L36 56 M75 45 L64 56 M25 95 L36 84 M75 95 L64 84" opacity=".85"/></g><circle cx="50" cy="70" r="30" fill="none" stroke="#d4b060" stroke-width="3"/><circle cx="50" cy="70" r="24" fill="none" stroke="#fff3cf" stroke-width="1.6" opacity=".9"/><circle cx="50" cy="70" r="18" fill="#fff3cf" opacity=".25"/><g fill="#ffd23f"><path d="M50 56 L53 66 L63 70 L53 74 L50 84 L47 74 L37 70 L47 66 Z"/></g><circle cx="50" cy="70" r="4" fill="#fff"/><g fill="#fff3cf" opacity=".9"><circle cx="50" cy="34" r="2.4"/><circle cx="50" cy="106" r="2.4"/><circle cx="82" cy="38" r="1.8"/><circle cx="18" cy="102" r="1.8"/></g></svg>`},
{id:'ru4',n:'Рунная печать',lock:10,cur:'ad',gl:'',bg:'radial-gradient(circle at 30% 20%, rgba(180,140,255,.14), transparent 55%),'+AG+',repeating-linear-gradient(45deg,#342c48 0 9px,#3e3458 9px 18px), #2a2438',br:'#b08ae0',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="70" r="42" fill="none" stroke="#8a76b0" stroke-width="2.5"/><circle cx="50" cy="70" r="36" fill="none" stroke="#b08ae0" stroke-width="1.2" opacity=".7"/><g stroke="#b08ae0" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M50 30 L50 40 M46 34 L54 34"/><path d="M82 54 L74 58 M80 48 L76 56"/><path d="M82 86 L74 82 M80 92 L76 84"/><path d="M50 110 L50 100 M46 106 L54 106"/><path d="M18 86 L26 82 M20 92 L24 84"/><path d="M18 54 L26 58 M20 48 L24 56"/></g><g stroke="#e8dcfa" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M42 58 L42 82 M42 64 L52 74 M42 76 L52 66"/><path d="M58 56 L58 84"/></g><circle cx="50" cy="70" r="20" fill="none" stroke="#e8dcfa" stroke-width="1" opacity=".5"/><g fill="#b08ae0" opacity=".85"><circle cx="50" cy="46" r="1.6"/><circle cx="50" cy="94" r="1.6"/><circle cx="74" cy="70" r="1.6"/><circle cx="26" cy="70" r="1.6"/></g></svg>`},
{id:'sh1',n:'Кинжалы',lock:10,cur:'ad',gl:'',bg:'radial-gradient(circle at 50% 35%, rgba(120,200,120,.10), transparent 55%),'+AG+',repeating-linear-gradient(45deg,#191613 0 9px,#22201c 9px 18px), #100e0c',br:'#7a9a6a',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><g transform="rotate(35 50 70)"><path d="M50 16 L55 30 L55 72 L50 82 L45 72 L45 30 Z" fill="#c8ccd4" stroke="#6a7078" stroke-width="1"/><path d="M50 20 L50 76" stroke="#8a9098" stroke-width="1"/><rect x="38" y="80" width="24" height="5" rx="2" fill="#3a5a3a" stroke="#1a2a1a" stroke-width="1"/><rect x="47" y="85" width="6" height="16" fill="#2a2028" stroke="#1a1018" stroke-width="1"/><circle cx="50" cy="104" r="3.5" fill="#3a5a3a" stroke="#1a2a1a" stroke-width="1"/></g><g transform="rotate(-35 50 70)"><path d="M50 16 L55 30 L55 72 L50 82 L45 72 L45 30 Z" fill="#c8ccd4" stroke="#6a7078" stroke-width="1"/><path d="M50 20 L50 76" stroke="#8a9098" stroke-width="1"/><rect x="38" y="80" width="24" height="5" rx="2" fill="#3a5a3a" stroke="#1a2a1a" stroke-width="1"/><rect x="47" y="85" width="6" height="16" fill="#2a2028" stroke="#1a1018" stroke-width="1"/><circle cx="50" cy="104" r="3.5" fill="#3a5a3a" stroke="#1a2a1a" stroke-width="1"/></g><g fill="#6ab04c" opacity=".8"><path d="M50 108 L52 112 L56 114 L52 116 L50 120 L48 116 L44 114 L48 112 Z"/></g><g stroke="#4a6a4a" stroke-width="1.4" fill="none" opacity=".7"><path d="M24 40 Q30 46 26 54 M76 40 Q70 46 74 54"/></g></svg>`},
{id:'dr2',n:'Пламя',lock:1,cur:'mark',gl:'',bg:'radial-gradient(circle at 50% 42%, rgba(255,160,60,.20), transparent 62%),'+AG+',repeating-linear-gradient(45deg,#3d1a0d 0 9px,#4a2110 9px 18px), #30140a',br:'#e8a04a',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><circle cx="50" cy="72" r="38" fill="none" stroke="#e8a04a" stroke-width="2" opacity=".7"/><circle cx="50" cy="72" r="42" fill="none" stroke="#e8a04a" stroke-width=".8" opacity=".4"/><g fill="#e86a2a"><path d="M50 24 Q66 44 62 62 Q70 58 72 48 Q80 62 74 80 Q68 98 50 104 Q32 98 26 80 Q20 62 28 48 Q30 58 38 62 Q34 44 50 24 Z"/></g><g fill="#ffd23f"><path d="M50 40 Q60 54 57 68 Q62 66 64 60 Q68 72 62 84 Q57 93 50 95 Q43 93 38 84 Q32 72 36 60 Q38 66 43 68 Q40 54 50 40 Z"/></g><g fill="#fff3cf"><path d="M50 58 Q55 66 53 74 Q56 73 57 70 Q59 78 54 84 Q52 87 50 88 Q48 87 46 84 Q41 78 43 70 Q44 73 47 74 Q45 66 50 58 Z"/></g><g fill="#ff9a3a" opacity=".8"><path d="M24 96 L26 100 L30 101 L26 102 L24 106 L22 102 L18 101 L22 100 Z"/><path d="M76 96 L78 100 L82 101 L78 102 L76 106 L74 102 L70 101 L74 100 Z"/></g></svg>`},
{id:'li1',n:'Клинок света',lock:1,cur:'mark',gl:'',bg:'radial-gradient(circle at 50% 36%, rgba(255,240,190,.22), transparent 62%),'+AG+',repeating-linear-gradient(45deg,#4a3e2a 0 9px,#584b34 9px 18px), #3a3020',br:'#f0d070',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><path d="M50 8 L58 26 L58 80 L50 96 L42 80 L42 26 Z" fill="#fff3cf" opacity=".35"/><path d="M50 12 L56 26 L56 82 L50 94 L44 82 L44 26 Z" fill="#f7ead0" stroke="#d4b060" stroke-width="1.5"/><path d="M50 16 L50 90" stroke="#fff" stroke-width="2"/><path d="M50 20 L53 28 L53 78 L50 86 L47 78 L47 28 Z" fill="#fff" opacity=".65"/><rect x="30" y="92" width="40" height="7" rx="3" fill="#d4b060" stroke="#8a6a20" stroke-width="1.5"/><g fill="#fff3cf"><path d="M32 95 L24 92 L26 96 L24 100 Z"/><path d="M68 95 L76 92 L74 96 L76 100 Z"/></g><rect x="46" y="99" width="8" height="18" fill="#8a6a20" stroke="#5b3a20" stroke-width="1"/><g stroke="#5b3a20" stroke-width="1"><path d="M46 103 L54 105 M46 109 L54 111"/></g><circle cx="50" cy="121" r="5" fill="#d4b060" stroke="#8a6a20" stroke-width="1.5"/><circle cx="50" cy="121" r="2" fill="#fff3cf"/><g fill="#fff3cf" opacity=".9"><path d="M22 30 L24 35 L29 37 L24 39 L22 44 L20 39 L15 37 L20 35 Z"/><path d="M78 30 L80 35 L85 37 L80 39 L78 44 L76 39 L71 37 L76 35 Z"/></g></svg>`},
{id:'kd3',n:'Гербовый щит',lock:2,cur:'mark',gl:'',bg:'radial-gradient(circle at 30% 20%, rgba(255,215,120,.14), transparent 55%),'+AG+',repeating-linear-gradient(45deg,#4a2e52 0 9px,#5a3864 9px 18px), #3a2440',br:'#c9a24a',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><path d="M50 22 L80 32 L80 72 Q80 100 50 118 Q20 100 20 72 L20 32 Z" fill="#6a2a3a" stroke="#c9a24a" stroke-width="3"/><path d="M50 30 L74 38 L74 72 Q74 94 50 110 Q26 94 26 72 L26 38 Z" fill="none" stroke="#e8c76a" stroke-width="1.2" opacity=".6"/><path d="M50 22 L50 118 M20 60 L80 60" stroke="#e8c76a" stroke-width="1.4" opacity=".5"/><path d="M42 44 L46 52 L54 52 L48 58 L50 66 L42 61 L34 66 L36 58 L30 52 L38 52 Z" fill="#ffd23f" stroke="#8a6a20" stroke-width="1.2"/><path d="M50 76 Q58 80 58 88 Q58 96 50 100 Q42 96 42 88 Q42 80 50 76 Z" fill="#e8c76a" stroke="#8a6a20" stroke-width="1.2"/><circle cx="50" cy="88" r="3" fill="#b03030" stroke="#7a1818" stroke-width="1"/></svg>`},
{id:'kd1',n:'Корона',lock:2,cur:'mark',gl:'',bg:'radial-gradient(circle at 30% 20%, rgba(255,215,120,.16), transparent 55%),'+AG+',repeating-linear-gradient(45deg,#5c2830 0 9px,#6e323b 9px 18px), #4a1e24',br:'#e8c76a',cb2:'rgba(255,255,255,.18)',cdot:'rgba(0,0,0,.30)',plaq:PLP,plaqi:'#2f2417',plaqb:'#5b422a',tag:'#d9ecb8',big:0,
art:`<svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"><g fill="none" stroke="#ffd23f" stroke-width="1.4" opacity=".7"><path d="M50 18 L50 26 M30 26 L34 32 M70 26 L66 32"/></g><path d="M26 92 L22 52 L38 68 L50 44 L62 68 L78 52 L74 92 Z" fill="#e8c76a" stroke="#8a6a20" stroke-width="2.5"/><rect x="24" y="92" width="52" height="16" rx="4" fill="#d4b060" stroke="#8a6a20" stroke-width="2"/><g fill="#b03030" stroke="#7a1818" stroke-width="1"><circle cx="50" cy="100" r="4.5"/><circle cx="34" cy="100" r="3"/><circle cx="66" cy="100" r="3"/></g><g fill="#3a6ab0" stroke="#1a3a70" stroke-width="1"><circle cx="42" cy="100" r="2.4"/><circle cx="58" cy="100" r="2.4"/></g><circle cx="22" cy="50" r="3" fill="#ffd23f" stroke="#8a6a20" stroke-width="1"/><circle cx="78" cy="50" r="3" fill="#ffd23f" stroke="#8a6a20" stroke-width="1"/><circle cx="50" cy="42" r="3.4" fill="#ffd23f" stroke="#8a6a20" stroke-width="1"/><path d="M30 60 L34 64 M70 60 L66 64" stroke="#fff3cf" stroke-width="1.4" opacity=".7"/></svg>`}
];

const CSS_SKINS = '.skgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:12px;margin-top:4px}'
+'.skcell{position:relative;display:block;cursor:pointer;transition:transform .15s}'
+'.skcell:hover{transform:translateY(-3px)}'
+'.skcell .card{width:100%!important;height:auto!important;aspect-ratio:5/7.2!important;pointer-events:none;cursor:pointer;position:relative}'
+'.sklock{position:absolute;top:0;left:0;right:0;bottom:0;border-radius:12px;background:rgba(5,8,4,.55);display:flex;align-items:center;justify-content:center;gap:8px;color:#ffd97a;font-weight:bold;font-size:30px;pointer-events:none;text-shadow:0 2px 4px #000;box-shadow:inset 0 0 12px rgba(0,0,0,.6);z-index:3}'
+'.sklock svg{filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))}'
+'.skcur{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:4}'
+'.skcur span{background:rgba(20,40,16,.92);border:1px solid #b8d494;border-radius:8px;padding:3px 10px;font-size:12px;color:#e9ffcf;text-shadow:0 1px 2px #000;box-shadow:0 2px 6px rgba(0,0,0,.6)}'
+'.card-svgart{position:relative;z-index:2;width:82%;height:82%;margin:auto;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 5px rgba(0,0,0,.5))}'
+'.card-svgart svg{width:100%;height:100%;display:block}'
+'.card-art-bg{position:absolute;top:calc(45% - 11px*var(--cz));left:50%;transform:translate(-50%,-50%);width:calc((100% - 20px)*.82);height:calc((100% - 20px - 22px*var(--cz))*.82);z-index:1;pointer-events:none;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 5px rgba(0,0,0,.5))}'
+'.card-art-bg svg{width:100%;height:100%;display:block}'
+'#skinprev .card{width:200px;aspect-ratio:5/7.2;pointer-events:none;flex-shrink:0}'
+'#sp-area{display:flex;align-items:center;justify-content:center;gap:16px;min-height:300px;touch-action:pan-y;user-select:none}'
+'.sp-arrow{width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;color:#f0e2c4;background:rgba(60,40,20,.85);border:2px solid #8a6a44;border-radius:50%;text-shadow:0 1px 2px #000;user-select:none}'
+'.sp-arrow:active{transform:scale(.95)}';

const style=document.createElement('style');
style.textContent=CSS_SKINS;
document.head.appendChild(style);

function buildSkinCSS(){
  let css='';
  SKINS.forEach(function(s){
    const big=s.big?'--cgfs:30px;--cgtop:8px;--cgleft:50%;--cgright:auto;--cgtr:translateX(-50%)':'--cgfs:14px;--cgtop:9px;--cgright:11px;--cgleft:auto;--cgtr:none';
    const gl=(s.gl!==undefined)?s.gl:'✦';
    const glc=s.glc||'rgba(232,199,106,.75)';
    const cb2=s.cb2||'rgba(255,255,255,.18)';
    const cdot=s.cdot||'rgba(0,0,0,.30)';
    const plaq=s.plaq||PLP;
    const plaqi=s.plaqi||'#2f2417';
    const plaqb=s.plaqb||'#5b422a';
    const tag=s.tag||'#d9ecb8';
    css+='body[data-skin='+s.id+']{--cbg:'+s.bg+';--cbr:'+s.br+';--cb2:'+cb2+';--cdot:'+cdot+';--cglyph:"'+gl+'";--cglyc:'+glc+';--cplaq:'+plaq+';--cplaqi:'+plaqi+';--cplaqb:'+plaqb+';--ctag:'+tag+';'+big+'}';
  });
  const st=document.createElement('style');
  st.textContent=css;
  document.head.appendChild(st);
}
buildSkinCSS();

function cardStyle(s){
  const big=s.big?'--cgfs:30px;--cgtop:8px;--cgleft:50%;--cgright:auto;--cgtr:translateX(-50%)':'--cgfs:14px;--cgtop:9px;--cgright:11px;--cgleft:auto;--cgtr:none';
  const gl=(s.gl!==undefined)?s.gl:'✦';
  const glc=s.glc||'rgba(232,199,106,.75)';
  const cb2=s.cb2||'rgba(255,255,255,.18)';
  const cdot=s.cdot||'rgba(0,0,0,.30)';
  const plaq=s.plaq||PLP;
  const plaqi=s.plaqi||'#2f2417';
  const plaqb=s.plaqb||'#5b422a';
  const tag=s.tag||'#d9ecb8';
  return '--cbg:'+s.bg+';--cbr:'+s.br+';--cb2:'+cb2+';--cdot:'+cdot+';--cglyph:\''+gl+'\';--cglyc:'+glc+';--cplaq:'+plaq+';--cplaqi:'+plaqi+';--cplaqb:'+plaqb+';--ctag:'+tag+';'+big;
}
function cardHTML(s){
  let inner='';
  if(s.art)inner='<div class="card-svgart">'+s.art+'</div>';
  return '<div class="card" style="'+cardStyle(s)+'">'+inner+'</div>';
}

function applySkin(skinId){
  document.body.setAttribute('data-skin',skinId);
}

function getArt(skinId){
  for(let i=0;i<SKINS.length;i++){
    if(SKINS[i].id===skinId)return SKINS[i].art||'';
  }
  return '';
}
function getCurrentSkin(){
  return document.body.getAttribute('data-skin')||'ag';
}

function openSkinSelect(P,onSave,onToast){
  let skov=document.getElementById('skinselect');
  if(!skov){
    skov=document.createElement('div');
    skov.className='ovl hidden';skov.id='skinselect';
    skov.innerHTML='<div class="invbox" style="max-width:520px"><h3>Рубашки карт</h3>'
+'<div class="hint">Знаки ✦ даются за шесть ключевых достижений:<br>за три главы, за правду травнице, за победу над пауком и за отдачу ядра старцам.<br><br>Древние и тематические рубашки открываются за осколки и знаки.</div>'
+'<div class="skgrid" id="skgrid"></div>'
+'<div style="text-align:center;margin-top:14px"><button class="btn" id="skclose">Закрыть</button></div></div>';
    document.body.appendChild(skov);
    skov.addEventListener('click',function(e){if(e.target===skov)skov.classList.add('hidden');});
    skov.querySelector('#skclose').addEventListener('click',function(){skov.classList.add('hidden');});
  }
  buildSkinsGrid(P,onSave,onToast,skov);
  skov.classList.remove('hidden');
}

function priceLabelHTML(s,markIconFn,adIconFn){
  if(s.cur==='ad')return adIconFn(36)+'<span>'+s.lock+'</span>';
  return markIconFn(36)+'<span>'+s.lock+'</span>';
}

function buildSkinsGrid(P,onSave,onToast,skov){
  const g=skov.querySelector('#skgrid');
  if(!g)return;
  g.innerHTML='';
  const markIconFn=window.markIcon||function(){return '';};
  const adIconFn=window.adIcon||function(){return '';};
  SKINS.forEach(function(s,idx){
    const owned=!!P.skins[s.id];
    const cur=P.skin===s.id;
    const available=owned||s.lock===0;
    const cell=document.createElement('div');
    cell.className='skcell';
    cell.innerHTML=cardHTML(s);
    if(!available){
      const lock=document.createElement('div');
      lock.className='sklock';
      lock.innerHTML=priceLabelHTML(s,markIconFn,adIconFn);
      cell.appendChild(lock);
    }
    if(cur){
      const badge=document.createElement('div');
      badge.className='skcur';
      badge.innerHTML='<span>выбрана</span>';
      cell.appendChild(badge);
    }
    cell.addEventListener('click',function(){openSkinPreview(idx,P,onSave,onToast,skov);});
    g.appendChild(cell);
  });
}

function openSkinPreview(idx,P,onSave,onToast,skov){
  let ov=document.getElementById('skinprev');
  if(!ov){
    ov=document.createElement('div');
    ov.className='ovl hidden';ov.id='skinprev';
    ov.innerHTML='<div class="invbox detbox" style="max-width:400px;padding:20px;position:relative;">'
+'<div id="sp-area">'
+'<div class="sp-arrow" id="sp-left">&lt;</div>'
+'<div id="sp-cardwrap"></div>'
+'<div class="sp-arrow" id="sp-right">&gt;</div>'
+'</div>'
+'<div style="text-align:center;margin-top:16px;" id="sp-btn-area"></div>'
+'<div style="text-align:center;margin-top:12px;"><button class="btn" id="sp-close">Закрыть</button></div>'
+'</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.add('hidden');});
    ov.querySelector('#sp-close').addEventListener('click',function(){ov.classList.add('hidden');});
    ov.querySelector('#sp-left').addEventListener('click',function(){changePreviewIdx(-1,P,onSave,onToast,skov);});
    ov.querySelector('#sp-right').addEventListener('click',function(){changePreviewIdx(1,P,onSave,onToast,skov);});
    let touchStartX=0;
    const area=ov.querySelector('#sp-area');
    area.addEventListener('touchstart',function(e){touchStartX=e.changedTouches[0].screenX;},{passive:true});
    area.addEventListener('touchend',function(e){
      const touchEndX=e.changedTouches[0].screenX;
      if(touchStartX-touchEndX>50)changePreviewIdx(1,P,onSave,onToast,skov);
      if(touchEndX-touchStartX>50)changePreviewIdx(-1,P,onSave,onToast,skov);
    },{passive:true});
  }
  window._spIdx=idx;
  renderSkinPreview(P,onSave,onToast,skov);
  ov.classList.remove('hidden');
}

function changePreviewIdx(dir,P,onSave,onToast,skov){
  let newIdx=window._spIdx+dir;
  if(newIdx<0)newIdx=SKINS.length-1;
  if(newIdx>=SKINS.length)newIdx=0;
  window._spIdx=newIdx;
  renderSkinPreview(P,onSave,onToast,skov);
}

/* ===== Покупка рубашки (с подтверждением) ===== */
function renderSkinPreview(P,onSave,onToast,skov){
  const idx=window._spIdx;
  const s=SKINS[idx];
  const cardwrap=document.getElementById('sp-cardwrap');
  cardwrap.innerHTML=cardHTML(s);
  const btnArea=document.getElementById('sp-btn-area');
  const owned=!!P.skins[s.id];
  const cur=P.skin===s.id;
  const markIconFn=window.markIcon||function(){return '';};
  const adIconFn=window.adIcon||function(){return '';};
  let btnHtml='';
  if(cur){
    btnHtml='<button class="btn" disabled style="opacity:0.6;cursor:default;">✓ Выбрана</button>';
  }else if(owned||s.lock===0){
    btnHtml='<button class="btn" id="sp-action" style="background:linear-gradient(#8fae62,#6d8c4a);border-color:#b8d494;color:#10160c;">Выбрать</button>';
  }else{
    if(s.cur==='ad'){
      btnHtml='<button class="btn" id="sp-action">Купить за '+adIconFn(16)+' '+s.lock+'</button>';
    }else{
      btnHtml='<button class="btn" id="sp-action">Купить за '+markIconFn(16)+' '+s.lock+'</button>';
    }
  }
  btnArea.innerHTML=btnHtml;
  const actionBtn=document.getElementById('sp-action');
  if(actionBtn){
    actionBtn.addEventListener('click',function(){
      if(owned||s.lock===0){
        P.skin=s.id;
        onSave();
        applySkin(P.skin);
        buildSkinsGrid(P,onSave,onToast,skov);
        document.getElementById('skinprev').classList.add('hidden');
        if(typeof render==='function')render();
        onToast('Рубашка выбрана!');
        return;
      }
      /* === Покупка === */
      const isAd=s.cur==='ad';
      const price=s.lock;
      const name='рубашка «'+s.n+'»';
      function doBuy(){
        if(isAd){
          if(P.adcoins>=price){
            P.adcoins-=price;
            P.skins[s.id]=1;
            P.skin=s.id;
            onSave();
            applySkin(P.skin);
            buildSkinsGrid(P,onSave,onToast,skov);
            if(window.updateAdCoins)window.updateAdCoins();
            document.getElementById('skinprev').classList.add('hidden');
            if(typeof render==='function')render();
            onToast('Куплено и выбрано!');
          }else{onToast('Не хватает осколков: нужно '+price+', у вас '+P.adcoins);}
        }else{
          if(P.marks>=price){
            P.marks-=price;
            P.skins[s.id]=1;
            P.skin=s.id;
            onSave();
            applySkin(P.skin);
            buildSkinsGrid(P,onSave,onToast,skov);
            if(window.updateMarks)window.updateMarks();
            document.getElementById('skinprev').classList.add('hidden');
            if(typeof render==='function')render();
            onToast('Куплено и выбрано!');
          }else{onToast('Не хватает знаков: нужно '+price+', у вас '+P.marks);}
        }
      }
      /* Проверки хватает ли валюты ДО подтверждения — чтобы не спрашивать зря */
      if(isAd){
        if(P.adcoins<price){onToast('Не хватает осколков: нужно '+price+', у вас '+P.adcoins);return;}
      }else{
        if(P.marks<price){onToast('Не хватает знаков: нужно '+price+', у вас '+P.marks);return;}
      }
      if(typeof window.confirmBuy==='function'){
        const curName=isAd?('осколков'):('знаков');
        window.confirmBuy(name+' ('+price+' '+curName+')', price, doBuy);
      }else{
        doBuy();
      }
    });
  }
}

window.Cardbacks={SKINS:SKINS,openSkinSelect:openSkinSelect,applySkin:applySkin,cardHTML:cardHTML,getArt:getArt,getCurrentSkin:getCurrentSkin};
})();