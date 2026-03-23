/**
 * Duel — Rock Paper Scissors vs AI
 * Double meaning: a duel (1v1 fight) + you're dueling an AI that reads you
 */
'use strict';

const MOVES      = { rock:'🪨', paper:'📄', scissors:'✂️' };
const MOVE_NAMES = { rock:'Rock', paper:'Paper', scissors:'Scissors' };
const BEATS      = { rock:'scissors', scissors:'paper', paper:'rock' };

const ACHIEVEMENT_DEFS = [
  { id:'first_win',      label:'🌟 First Blood',      desc:'Win your first round' },
  { id:'streak3',        label:'🔥 Hat Trick',         desc:'Win 3 rounds in a row' },
  { id:'streak5',        label:'⚡ Unstoppable',       desc:'Win 5 rounds in a row' },
  { id:'perfect_match',  label:'🏆 Flawless Victory',  desc:'Win a match without losing a round' },
  { id:'comeback',       label:'🆘 Clutch King',       desc:'Win after trailing 0-2' },
  { id:'rock_lover',     label:'🪨 Rock Solid',        desc:'Play Rock 5 times in one match' },
  { id:'paper_lover',    label:'📄 Paper Trail',       desc:'Play Paper 5 times in one match' },
  { id:'scissors_lover', label:'✂️ Scissor Happy',    desc:'Play Scissors 5 times in one match' },
  { id:'draw_master',    label:'🤝 Stalemate King',    desc:'Draw 3 rounds in one match' },
  { id:'ai_slayer',      label:'🤖 AI Slayer',         desc:'Beat Hard or Unbeatable AI' },
  { id:'century',        label:'💯 Century',           desc:'Play 100 total rounds all-time' },
];

const GRADE_TABLE = [
  { min:90, letter:'S', color:'#ffd93d', label:'unreal behavior 👑' },
  { min:75, letter:'A', color:'#b8ff00', label:'ate fr no crumbs 🏆' },
  { min:60, letter:'B', color:'#00f5ff', label:'solid run ngl 💪' },
  { min:45, letter:'C', color:'#ffaa33', label:'mid arc but okay 😐' },
  { min:0,  letter:'D', color:'#ff2d78', label:'skill issue detected 💀' },
];

const TAUNTS = {
  win:  ['ate and left no crumbs 🍽️', 'not even close bestie', 'ratio + W', 'touch grass after this L', 'main character behavior fr'],
  lose: ['skill issue ngl 💀', 'the AI said nah', 'L + ratio + cry about it', 'bro got cooked 🔥', 'maybe try easy mode?'],
  draw: ['same braincell detected', 'we are so alike it\'s scary', 'jinx you owe me a soda', 'parallel universe behavior', 'boring but okay'],
};

const state = {
  diff:'medium', maxWins:3, totalRounds:5,
  p1Score:0, p2Score:0, draws:0, roundNum:1, active:false,
  history:[], roundStreak:0, bestStreak:0,
  moveCount:{rock:0,paper:0,scissors:0}, matchDraws:0,
  earnedAchievements:new Set(),
  allTimeRounds:parseInt(localStorage.getItem('yolo_rounds')||'0'),
  allTimeAchievements:new Set(JSON.parse(localStorage.getItem('yolo_ach')||'[]')),
};

const $ = id => document.getElementById(id);
const el = {
  diffSelect:$('diffSelect'), roundsSelect:$('roundsSelect'), newGameBtn:$('newGameBtn'),
  p1Score:$('p1Score'), p2Score:$('p2Score'), youHp:$('youHp'), aiHp:$('aiHp'),
  roundNum:$('roundNum'), seriesPill:$('seriesPill'),
  welcomeScreen:$('welcomeScreen'), welcomeStartBtn:$('welcomeStartBtn'),
  battleScreen:$('battleScreen'),
  mrRock:$('mrRock'), mrPaper:$('mrPaper'), mrScissors:$('mrScissors'),
  mrRockPct:$('mrRockPct'), mrPaperPct:$('mrPaperPct'), mrScissorsPct:$('mrScissorsPct'),
  yourCard:$('yourCard'), aiCard:$('aiCard'),
  yourSymbol:$('yourSymbol'), aiSymbol:$('aiSymbol'),
  yourName:$('yourName'), aiName:$('aiName'),
  clashBurst:$('clashBurst'), roundResult:$('roundResult'),
  throwZone:$('throwZone'),
  streakVal:$('streakVal'), streakFire:$('streakFire'),
  historyList:$('historyList'), achievementsList:$('achievementsList'),
  statWins:$('statWins'), statLosses:$('statLosses'), statDraws:$('statDraws'),
  statWinRate:$('statWinRate'), statStreak:$('statStreak'), statFav:$('statFav'),
  matchModal:$('matchModal'), matchIcon:$('matchIcon'),
  matchTitle:$('matchTitle'), matchSummary:$('matchSummary'),
  mP1:$('mP1'), mP2:$('mP2'), mDraws:$('mDraws'), mRounds:$('mRounds'),
  matchGrade:$('matchGrade'), rematchBtn:$('rematchBtn'), closeMatchBtn:$('closeMatchBtn'),
  confettiCanvas:$('confettiCanvas'),
};

/* ── CONFETTI ── */
const confetti = (() => {
  let ctx=null,pieces=[],animId=null;
  function init(){ const c=el.confettiCanvas; c.width=window.innerWidth; c.height=window.innerHeight; ctx=c.getContext('2d'); window.addEventListener('resize',()=>{c.width=window.innerWidth;c.height=window.innerHeight;}); }
  function launch(n=160){ pieces=Array.from({length:n},()=>({x:Math.random()*window.innerWidth,y:-20-Math.random()*100,vx:(Math.random()-.5)*5,vy:2.5+Math.random()*4,size:5+Math.random()*7,color:`hsl(${Math.random()*360},100%,65%)`,rotation:Math.random()*Math.PI*2,vr:(Math.random()-.5)*.15,life:1})); if(animId)cancelAnimationFrame(animId); loop(); }
  function loop(){ if(!ctx||!pieces.length)return; ctx.clearRect(0,0,window.innerWidth,window.innerHeight); pieces=pieces.filter(p=>p.life>0); pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rotation+=p.vr;p.vy+=.08;if(p.y>window.innerHeight+20)p.life=0;ctx.save();ctx.globalAlpha=p.life;ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6);ctx.restore();}); if(pieces.length)animId=requestAnimationFrame(loop); else ctx.clearRect(0,0,window.innerWidth,window.innerHeight); }
  return{init,launch};
})();

/* ── UTILS ── */
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function bumpEl(e){ e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
function setThrowsDisabled(d){ el.throwZone.querySelectorAll('.throw-btn').forEach(b=>b.disabled=d); }

/* ── AI BRAIN ── */
function aiPick(diff, history){
  const moves = Object.keys(MOVES);
  if(diff==='easy') return rand(moves);

  if(diff==='medium'){
    if(Math.random()<0.6) return rand(moves);
    const last=history.slice(-1)[0];
    if(!last) return rand(moves);
    return Object.keys(BEATS).find(k=>BEATS[k]===last.p1)||rand(moves);
  }

  if(diff==='hard'){
    const freq={rock:0,paper:0,scissors:0};
    history.forEach(h=>{ if(h.p1) freq[h.p1]++; });
    if(Object.values(freq).every(v=>v===0)) return rand(moves);
    const mostUsed=Object.keys(freq).reduce((a,b)=>freq[a]>=freq[b]?a:b);
    return Object.keys(BEATS).find(k=>BEATS[k]===mostUsed)||rand(moves);
  }

  if(diff==='unbeatable'){
    const freq={rock:0,paper:0,scissors:0};
    history.forEach(h=>{ if(h.p1) freq[h.p1]++; });
    const last=history.slice(-1)[0];
    if(!last||Object.values(freq).every(v=>v===0)) return rand(moves);
    const mostUsed=Object.keys(freq).reduce((a,b)=>freq[a]>=freq[b]?a:b);
    const lastMove=last.p1;
    const counterMost=Object.keys(BEATS).find(k=>BEATS[k]===mostUsed);
    const counterLast=Object.keys(BEATS).find(k=>BEATS[k]===lastMove);
    return Math.random()<0.72 ? counterMost : counterLast;
  }
  return rand(moves);
}

/* ── MIND-READ PREDICTION BAR ── */
function updateMindRead(){
  const freq={rock:0,paper:0,scissors:0};
  state.history.forEach(h=>{ if(h.p1) freq[h.p1]++; });
  const total=Object.values(freq).reduce((a,b)=>a+b,0);

  let pcts;
  if(total===0){
    pcts={rock:33,paper:33,scissors:34};
  } else {
    // AI's prediction of what you'll throw = your frequency distribution
    pcts={
      rock:  Math.round((freq.rock/total)*100),
      paper: Math.round((freq.paper/total)*100),
      scissors: 100-Math.round((freq.rock/total)*100)-Math.round((freq.paper/total)*100),
    };
  }

  el.mrRockPct.textContent=`${pcts.rock}%`;
  el.mrPaperPct.textContent=`${pcts.paper}%`;
  el.mrScissorsPct.textContent=`${pcts.scissors}%`;

  // Highlight the hottest prediction
  const hotMove=Object.keys(pcts).reduce((a,b)=>pcts[a]>=pcts[b]?a:b);
  el.mrRock.classList.toggle('hot', hotMove==='rock');
  el.mrPaper.classList.toggle('hot', hotMove==='paper');
  el.mrScissors.classList.toggle('hot', hotMove==='scissors');
}

/* ── HP BARS ── */
function updateHpBars(){
  const maxWins = state.maxWins===Infinity ? 10 : state.maxWins;
  const youPct  = Math.max(0, Math.round(((maxWins-state.p2Score)/maxWins)*100));
  const aiPct   = Math.max(0, Math.round(((maxWins-state.p1Score)/maxWins)*100));
  el.youHp.style.width = `${youPct}%`;
  el.aiHp.style.width  = `${aiPct}%`;
}

/* ── START GAME ── */
function startGame(){
  state.diff = el.diffSelect.value;
  const r = parseInt(el.roundsSelect.value);
  state.totalRounds = r;
  state.maxWins = r===0 ? Infinity : Math.ceil(r/2);

  state.p1Score=0; state.p2Score=0; state.draws=0;
  state.roundNum=1; state.active=true;
  state.history=[]; state.roundStreak=0; state.bestStreak=0;
  state.moveCount={rock:0,paper:0,scissors:0};
  state.matchDraws=0; state.earnedAchievements=new Set();

  el.seriesPill.textContent = r===0 ? '∞ Endless' : `Best of ${r}`;
  el.welcomeScreen.classList.add('hidden');
  el.battleScreen.classList.remove('hidden');
  el.matchModal.classList.add('hidden');

  updateScoreboard();
  updateHpBars();
  updateMindRead();
  resetRound();
  renderHistory();
  renderAchievements();
  renderStats();
}

/* ── RESET ROUND ── */
function resetRound(){
  el.yourSymbol.textContent='?'; el.yourName.textContent='—';
  el.aiSymbol.textContent='?';   el.aiName.textContent='—';
  el.yourCard.className='clash-card'; el.aiCard.className='clash-card';
  el.roundResult.className='round-result hidden'; el.roundResult.textContent='';
  el.clashBurst.textContent='💥'; el.clashBurst.classList.remove('active');
  setThrowsDisabled(false);
  el.roundNum.textContent=state.roundNum;
}

/* ── HANDLE MOVE — zero delay AI ── */
function handleMove(move){
  if(!state.active) return;
  setThrowsDisabled(true);

  // AI picks instantly — same synchronous call
  const aiMove = aiPick(state.diff, state.history);

  // Show player pick
  el.yourSymbol.textContent=MOVES[move]; el.yourName.textContent=MOVE_NAMES[move];
  el.yourSymbol.classList.remove('pop'); void el.yourSymbol.offsetWidth; el.yourSymbol.classList.add('pop');

  // Show AI pick simultaneously
  el.aiSymbol.textContent=MOVES[aiMove]; el.aiName.textContent=MOVE_NAMES[aiMove];
  el.aiSymbol.classList.remove('pop'); void el.aiSymbol.offsetWidth; el.aiSymbol.classList.add('pop');

  resolveRound(move, aiMove);
}

/* ── RESOLVE ROUND ── */
function resolveRound(p1, p2){
  const result = p1===p2 ? 'draw' : BEATS[p1]===p2 ? 'p1' : 'p2';

  el.clashBurst.classList.add('active');
  state.moveCount[p1]++;
  state.history.push({round:state.roundNum, p1, p2, result});
  state.allTimeRounds++;
  localStorage.setItem('yolo_rounds', state.allTimeRounds);

  let cardCls='', aiCardCls='', resultCls='', resultMsg='';

  if(result==='draw'){
    state.draws++; state.matchDraws++; state.roundStreak=0;
    cardCls='draw'; aiCardCls='draw'; resultCls='draw';
    resultMsg=`🤝 Draw — ${rand(TAUNTS.draw)}`;
  } else if(result==='p1'){
    state.p1Score++;
    state.roundStreak++; state.bestStreak=Math.max(state.bestStreak,state.roundStreak);
    cardCls='win'; aiCardCls='lose'; resultCls='win';
    resultMsg=`✅ You win — ${rand(TAUNTS.win)}`;
    bumpEl(el.p1Score);
  } else {
    state.p2Score++; state.roundStreak=0;
    cardCls='lose'; aiCardCls='win'; resultCls='lose';
    resultMsg=`❌ AI wins — ${rand(TAUNTS.lose)}`;
    bumpEl(el.p2Score);
  }

  el.yourCard.className=`clash-card ${cardCls}`;
  el.aiCard.className=`clash-card ${aiCardCls}`;
  el.roundResult.className=`round-result ${resultCls}`;
  el.roundResult.textContent=resultMsg;
  el.roundResult.classList.remove('hidden');

  // Streak display
  el.streakVal.textContent=state.roundStreak;
  el.streakFire.textContent=state.roundStreak>=3?'🔥':state.roundStreak>=5?'⚡':'';

  updateScoreboard();
  updateHpBars();
  updateMindRead();
  checkAchievements();
  renderHistory();
  renderStats();

  const matchOver = state.maxWins!==Infinity && (state.p1Score>=state.maxWins||state.p2Score>=state.maxWins);
  const exhausted  = state.totalRounds!==0 && (state.p1Score+state.p2Score+state.draws)>=state.totalRounds;

  if(matchOver||exhausted){
    setTimeout(finishMatch, 1200);
  } else {
    state.roundNum++;
    setTimeout(resetRound, 1200);
  }
}

/* ── FINISH MATCH ── */
function finishMatch(){
  state.active=false;
  const total=state.p1Score+state.p2Score+state.draws;
  const wr=total>0?Math.round((state.p1Score/total)*100):0;
  const winner=state.p1Score>state.p2Score?'p1':state.p2Score>state.p1Score?'p2':'draw';

  el.matchIcon.textContent=winner==='p1'?'🏆':winner==='p2'?'💀':'🤝';
  el.matchTitle.textContent=winner==='p1'?'You Win!':winner==='p2'?'AI Wins!':'It\'s a Draw!';
  el.matchTitle.className=`modal-title ${winner==='p1'?'win':winner==='p2'?'lose':''}`;
  el.matchSummary.textContent=rand(winner==='p1'?TAUNTS.win:winner==='p2'?TAUNTS.lose:TAUNTS.draw);
  el.mP1.textContent=state.p1Score; el.mP2.textContent=state.p2Score;
  el.mDraws.textContent=state.draws; el.mRounds.textContent=total;

  const grade=GRADE_TABLE.find(g=>wr>=g.min);
  el.matchGrade.innerHTML=`<div class="grade-letter" style="color:${grade.color};text-shadow:0 0 1.5rem ${grade.color}88">${grade.letter}</div><div class="grade-label">${grade.label}</div>`;

  el.matchModal.classList.remove('hidden');
  if(winner==='p1') confetti.launch(200);
}

/* ── SCOREBOARD ── */
function updateScoreboard(){
  el.p1Score.textContent=state.p1Score;
  el.p2Score.textContent=state.p2Score;
  el.roundNum.textContent=state.roundNum;
}

/* ── HISTORY ── */
function renderHistory(){
  el.historyList.innerHTML='';
  if(!state.history.length){ el.historyList.innerHTML='<p class="empty-msg">No rounds yet.</p>'; return; }
  [...state.history].reverse().forEach(h=>{
    const cls=h.result==='draw'?'draw':h.result==='p1'?'win':'lose';
    const lbl=h.result==='draw'?'Draw':h.result==='p1'?'Win':'Loss';
    const d=document.createElement('div');
    d.className=`history-item ${cls}`;
    d.innerHTML=`<span class="h-round">R${h.round}</span><span class="h-moves">${MOVES[h.p1]} vs ${MOVES[h.p2]}</span><span class="h-result ${cls}">${lbl}</span>`;
    el.historyList.appendChild(d);
  });
}

/* ── STATS ── */
function renderStats(){
  const total=state.p1Score+state.p2Score+state.draws;
  const wr=total>0?Math.round((state.p1Score/total)*100):0;
  el.statWins.textContent=state.p1Score;
  el.statLosses.textContent=state.p2Score;
  el.statDraws.textContent=state.draws;
  el.statWinRate.textContent=`${wr}%`;
  el.statStreak.textContent=state.bestStreak;
  const fav=Object.keys(state.moveCount).reduce((a,b)=>state.moveCount[a]>=state.moveCount[b]?a:b,'rock');
  el.statFav.textContent=state.moveCount[fav]>0?`${MOVES[fav]}`:'—';
}

/* ── ACHIEVEMENTS ── */
function checkAchievements(){
  const add=id=>{
    if(!state.earnedAchievements.has(id)){
      state.earnedAchievements.add(id);
      state.allTimeAchievements.add(id);
      localStorage.setItem('yolo_ach',JSON.stringify([...state.allTimeAchievements]));
    }
  };
  if(state.p1Score>=1) add('first_win');
  if(state.roundStreak>=3) add('streak3');
  if(state.roundStreak>=5) add('streak5');
  if(state.p1Score>=state.maxWins&&state.p2Score===0) add('perfect_match');
  if(state.history.filter(h=>h.result==='p2').length>=2&&state.p1Score>state.p2Score) add('comeback');
  if(state.moveCount.rock>=5) add('rock_lover');
  if(state.moveCount.paper>=5) add('paper_lover');
  if(state.moveCount.scissors>=5) add('scissors_lover');
  if(state.matchDraws>=3) add('draw_master');
  if((state.diff==='hard'||state.diff==='unbeatable')&&state.p1Score>state.p2Score) add('ai_slayer');
  if(state.allTimeRounds>=100) add('century');
  renderAchievements();
}

function renderAchievements(){
  el.achievementsList.innerHTML='';
  const all=new Set([...state.earnedAchievements,...state.allTimeAchievements]);
  if(!all.size){ el.achievementsList.innerHTML='<li class="empty-msg">Win rounds to unlock.</li>'; return; }
  ACHIEVEMENT_DEFS.forEach(def=>{
    const li=document.createElement('li');
    if(all.has(def.id)){ li.className='unlocked'; li.textContent=`${def.label} — ${def.desc}`; }
    else { li.textContent=`🔒 ${def.desc}`; }
    el.achievementsList.appendChild(li);
  });
}

/* ── KEYBOARD ── */
document.addEventListener('keydown',e=>{
  if(!state.active) return;
  const map={'1':'rock','2':'paper','3':'scissors'};
  if(map[e.key]) handleMove(map[e.key]);
});

/* ── EVENTS ── */
el.newGameBtn.addEventListener('click',startGame);
el.welcomeStartBtn.addEventListener('click',startGame);
el.throwZone.addEventListener('click',e=>{
  const btn=e.target.closest('.throw-btn');
  if(btn&&!btn.disabled) handleMove(btn.dataset.move);
});
el.rematchBtn.addEventListener('click',()=>{ el.matchModal.classList.add('hidden'); startGame(); });
el.closeMatchBtn.addEventListener('click',()=>{
  el.matchModal.classList.add('hidden');
  el.battleScreen.classList.add('hidden');
  el.welcomeScreen.classList.remove('hidden');
  state.active=false;
});
el.matchModal.addEventListener('click',e=>{ if(e.target===el.matchModal) el.matchModal.classList.add('hidden'); });

/* ── BOOT ── */
window.addEventListener('DOMContentLoaded',()=>{
  confetti.init();
  renderAchievements();
  renderStats();
});
