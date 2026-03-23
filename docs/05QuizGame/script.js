/**
 * Brainrot Quiz — double meaning: Gen-Z slang for obsessive content + brain rotting from not studying
 * 11 categories x 5 Qs | Lifelines: 50/50, Skip, Double Dip | <33% = Mission Failed
 */
'use strict';

const Q = (cat,diff,q,a,c,h) => ({category:cat,difficulty:diff,q,answers:a,correct:c,hint:h});

const QUESTIONS = [
  // ASTRONOMY
  Q('Astronomy','easy','Which planet has the most extensive ring system?',['Jupiter','Saturn','Uranus','Neptune'],1,'Named after the Roman god of agriculture — rings made of ice and rock.'),
  Q('Astronomy','easy','A light-year measures what?',['Time','Distance','Mass','Speed'],1,'How far light travels in one Earth year — ~9.46 trillion km.'),
  Q('Astronomy','medium','Name of the galaxy containing our solar system?',['Andromeda','Triangulum','Milky Way','Whirlpool'],2,'Visible as a band of stars on clear nights — looks like spilled milk.'),
  Q('Astronomy','medium','What does the Hubble Space Telescope primarily observe?',['Radio waves','Cosmic rays','Optical & UV light','Gravitational waves'],2,'Named after Edwin Hubble — captures stunning visible-light images from orbit.'),
  Q('Astronomy','hard','Boundary around a black hole beyond which nothing escapes?',['Photon sphere','Singularity','Event horizon','Accretion disk'],2,'Once you cross this point, not even light can turn back.'),
  // SPACE TECH
  Q('Space Tech','easy','First reusable orbital rocket by SpaceX?',['Falcon Heavy','Starship','Falcon 9','Dragon'],2,'Its booster lands itself back on a drone ship after launch.'),
  Q('Space Tech','easy','What does GPS stand for?',['Global Positioning System','Geo Polar Satellite','Ground Proximity Sensor','General Pulse Signal'],0,'A network of satellites that triangulates your exact location on Earth.'),
  Q('Space Tech','medium','Space telescope launched Dec 2021 to succeed Hubble?',['Chandra','Spitzer','James Webb','Kepler'],2,"Named after NASA's second administrator — observes in infrared."),
  Q('Space Tech','medium','Technology that lets satellites maintain orientation in space?',['Reaction wheels','Jet skis','Parachutes','Turbines'],0,'Spinning flywheels that transfer angular momentum to control attitude.'),
  Q('Space Tech','hard','Propulsion concept using a stream of ions for thrust?',['Chemical propulsion','Ion drive','Nuclear pulse','Solar sail'],1,"Used by NASA's Dawn spacecraft — very efficient but low thrust."),
  // PHYSICS
  Q('Physics','easy','Law explaining why rockets push spacecraft forward?',["Ohm's law","Newton's third law","Einstein's relativity","Kepler's third law"],1,'For every action there is an equal and opposite reaction.'),
  Q('Physics','easy','Approximate speed of light in a vacuum?',['300,000 km/s','150,000 km/s','450,000 km/s','30,000 km/s'],0,'Denoted as "c" in E = mc².'),
  Q('Physics','medium','Particle that mediates the electromagnetic force?',['Photon','Gluon','Z boson','Graviton'],0,'No rest mass — always travels at the speed of light.'),
  Q('Physics','medium','What causes time to pass slower near massive objects?',['Quantum entanglement','Gravitational time dilation','Doppler effect','Redshift'],1,"Predicted by Einstein's General Theory of Relativity."),
  Q('Physics','hard','What is the Heisenberg Uncertainty Principle about?',['Speed of light limit','Position & momentum cannot both be precisely known','Energy conservation','Wave-particle duality'],1,'The more precisely you know position, the less you know momentum.'),
  // EXPLORATION
  Q('Exploration','easy','Mission that first landed humans on the Moon?',['Apollo 11','Apollo 13','Soyuz 1','Vostok 6'],0,'Neil Armstrong and Buzz Aldrin walked on the lunar surface in July 1969.'),
  Q('Exploration','easy','First artificial satellite launched into orbit?',['Explorer 1','Sputnik 1','Vostok 1','Luna 1'],1,'Launched by the Soviet Union in October 1957 — it beeped as it orbited Earth.'),
  Q('Exploration','medium','Rovers currently exploring Mars (as of 2024)?',['Opportunity & Spirit','Spirit & Curiosity','Curiosity & Perseverance','Sojourner & Opportunity'],2,'One landed in 2012, the other in 2021 — both still active.'),
  Q('Exploration','medium','Planet with highest known wind speeds in the solar system?',['Earth','Jupiter','Neptune','Mars'],2,'Named for the Roman god of the sea — winds exceed 2,100 km/h.'),
  Q('Exploration','hard','First spacecraft to reach interstellar space?',['Pioneer 10','New Horizons','Voyager 1','Cassini'],2,'Launched in 1977, it crossed the heliopause in 2012.'),
  // MYTHOLOGY
  Q('Mythology','easy','Roman deity NOT linked to a planet in our solar system?',['Janus','Mercury','Venus','Mars'],0,'Two-faced god of beginnings — no planet named after him.'),
  Q('Mythology','easy','"Planet" comes from which Greek word meaning "wanderer"?',['Kosmos','Planetes','Astron','Ouranos'],1,'Ancient Greeks noticed these objects moved against the fixed star background.'),
  Q('Mythology','medium','Titan god of astronomy in Greek mythology?',['Prometheus','Atlas','Cronus','Hyperion'],3,'His name starts with H — associated with heavenly light.'),
  Q('Mythology','medium','Greek god associated with the Sun?',['Helios','Ares','Poseidon','Hermes'],0,'He drove a golden chariot across the sky each day.'),
  Q('Mythology','hard','Which day of the week is named after the Norse god of thunder?',['Monday','Wednesday','Thursday','Friday'],2,"Thor's day — the fourth day of the week in English."),
  // BIOLOGY
  Q('Biology','easy','Powerhouse of the cell?',['Nucleus','Ribosome','Mitochondria','Golgi body'],2,'Produces ATP — the energy currency of the cell.'),
  Q('Biology','easy','How many chromosomes does a typical human cell have?',['23','44','46','48'],2,'They come in 23 pairs — one set from each parent.'),
  Q('Biology','medium','Process by which plants make food using sunlight?',['Respiration','Fermentation','Photosynthesis','Transpiration'],2,'CO₂ + H₂O + light → glucose + O₂. Happens in chloroplasts.'),
  Q('Biology','medium','Blood type known as the universal donor?',['AB+','O-','A+','B-'],1,'No A, B, or Rh antigens — compatible with all blood types.'),
  Q('Biology','hard','Enzyme that unzips DNA during replication?',['DNA polymerase','RNA polymerase','Helicase','Ligase'],2,'Breaks hydrogen bonds between base pairs to separate the two strands.'),
  // CHEMISTRY
  Q('Chemistry','easy','Chemical symbol for gold?',['Go','Gd','Au','Ag'],2,'From the Latin word "Aurum" — a precious yellow metal.'),
  Q('Chemistry','easy',"Most abundant gas in Earth's atmosphere?",['Oxygen','Carbon dioxide','Argon','Nitrogen'],3,'Makes up about 78% of the air we breathe.'),
  Q('Chemistry','medium','pH of a neutral solution at 25°C?',['0','7','10','14'],1,'Below this is acidic, above is basic — pure water sits right here.'),
  Q('Chemistry','medium','Element with atomic number 1?',['Helium','Lithium','Hydrogen','Carbon'],2,'The lightest and most abundant element in the universe.'),
  Q('Chemistry','hard','Bond type involving sharing of electron pairs between atoms?',['Ionic bond','Covalent bond','Metallic bond','Hydrogen bond'],1,'Water (H₂O) is held together by this type of bond.'),
  // HISTORY
  Q('History','easy','Year World War II ended?',['1943','1944','1945','1946'],2,'V-E Day was May 8 and V-J Day was September 2 of this year.'),
  Q('History','easy','First President of the United States?',['John Adams','Thomas Jefferson','Benjamin Franklin','George Washington'],3,'He is on the US one-dollar bill and the quarter coin.'),
  Q('History','medium','Ancient wonder of the world that still exists today?',['Hanging Gardens of Babylon','Colossus of Rhodes','Great Pyramid of Giza','Lighthouse of Alexandria'],2,'Located in Egypt — built as a tomb for a pharaoh around 2560 BC.'),
  Q('History','medium','The Renaissance period began in which country?',['France','England','Germany','Italy'],3,'Started in Florence in the 14th century — a rebirth of art and science.'),
  Q('History','hard','Name of the first programmable electronic computer?',['UNIVAC','ENIAC','Colossus','Z3'],1,'Built in 1945 at the University of Pennsylvania — it weighed 30 tons.'),
  // GEOGRAPHY
  Q('Geography','easy','Largest continent by area?',['Africa','North America','Europe','Asia'],3,'Covers about 44.6 million km² and contains the Himalayas.'),
  Q('Geography','easy','Longest river in the world?',['Amazon','Yangtze','Mississippi','Nile'],3,'Flows through northeastern Africa and empties into the Mediterranean Sea.'),
  Q('Geography','medium','Capital city of Australia?',['Sydney','Melbourne','Brisbane','Canberra'],3,'Not the largest city — purpose-built as a compromise between Sydney and Melbourne.'),
  Q('Geography','medium','Country with the most natural lakes in the world?',['Russia','USA','Brazil','Canada'],3,"Has over 60% of the world's lakes — think maple syrup and hockey."),
  Q('Geography','hard','Tectonic plate that most of India sits on?',['Eurasian Plate','Pacific Plate','Indo-Australian Plate','African Plate'],2,'Its collision with the Eurasian plate formed the Himalayas.'),
  // TECHNOLOGY
  Q('Technology','easy','What does "HTML" stand for?',['Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Link','Home Tool Markup Language'],0,'Standard language used to create web pages.'),
  Q('Technology','easy','Which company created Android?',['Apple','Microsoft','Google','Samsung'],2,'Acquired Android Inc. in 2005 — now on billions of devices.'),
  Q('Technology','medium','What does "CPU" stand for?',['Central Processing Unit','Computer Power Unit','Core Processing Utility','Central Program Uploader'],0,'The brain of the computer — executes instructions from programs.'),
  Q('Technology','medium','Primary language for front-end web development?',['Python','Java','JavaScript','C++'],2,'Runs natively in every browser and makes web pages interactive.'),
  Q('Technology','hard','Time complexity of binary search on a sorted array?',['O(n)','O(n²)','O(log n)','O(1)'],2,'Each step halves the search space — repeatedly splitting in half.'),
  // MATHEMATICS
  Q('Mathematics','easy','Value of π (pi) to two decimal places?',['3.12','3.14','3.16','3.18'],1,"Ratio of a circle's circumference to its diameter."),
  Q('Mathematics','easy','Square root of 144?',['11','12','13','14'],1,'12 × 12 = this number.'),
  Q('Mathematics','medium','Sum of angles in a triangle?',['90°','120°','180°','360°'],2,'True for any triangle in flat (Euclidean) geometry.'),
  Q('Mathematics','medium','What is the Fibonacci sequence?',['Each number is double the previous','Each number is the sum of the two before it','Each number is the square of its position','Each number is prime'],1,'Starts 0, 1, 1, 2, 3, 5, 8, 13... — found everywhere in nature.'),
  Q('Mathematics','hard',"What is Euler's identity often called?",['The most beautiful equation in mathematics','The fundamental theorem of calculus','The Pythagorean identity','The prime number theorem'],0,'Connects e, i, π, 1, and 0 in one equation: e^(iπ) + 1 = 0.')
];

/* ── ACHIEVEMENTS ── */
const ACHIEVEMENT_DEFS = [
  { id:'first_correct', label:'🌟 First W',          desc:'Answer your first question correctly', check:s=>s.totalCorrect>=1 },
  { id:'streak_3',      label:'🔥 On a Roll',         desc:'3 correct in a row',                   check:s=>s.bestStreak>=3 },
  { id:'streak_5',      label:'⚡ Undefeated',        desc:'5 correct in a row',                   check:s=>s.bestStreak>=5 },
  { id:'streak_10',     label:'🌌 Goated',            desc:'10 correct in a row',                  check:s=>s.bestStreak>=10 },
  { id:'perfect',       label:'🏆 No Cap Perfect',    desc:'Answer all questions correctly',       check:s=>s.totalCorrect===s.total&&s.total>0 },
  { id:'score_300',     label:'🚀 Main Character',    desc:'Score 300+ points',                    check:s=>s.score>=300 },
  { id:'score_500',     label:'🌠 Slay Queen/King',   desc:'Score 500+ points',                    check:s=>s.score>=500 },
  { id:'score_700',     label:'👑 Lowkey a Genius',   desc:'Score 700+ points',                    check:s=>s.score>=700 },
  { id:'comeback',      label:'🆘 Safety Net',        desc:'Used a lifeline and still aced it',    check:s=>s.usedLifeline&&s.totalCorrect===s.total },
  { id:'new_record',    label:'📈 New Record',        desc:'Beat the previous high score',         check:(s,lb)=>lb.length>0&&s.score>(lb[0]?.score||0) }
];

/* ── FUN FACTS ── */
const FUN_FACTS = [
  "Honey never spoils — archaeologists found 3000-year-old honey in Egyptian tombs that was still edible.",
  "A day on Venus is longer than a year on Venus.",
  "Octopuses have three hearts, blue blood, and nine brains (one central + one per arm).",
  "The Eiffel Tower grows about 15 cm taller in summer due to thermal expansion.",
  "Bananas are berries, but strawberries are not — botanically speaking.",
  "There are more possible chess games than atoms in the observable universe.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "A group of flamingos is called a 'flamboyance'.",
  "The human brain uses about 20% of the body's total energy despite being only 2% of its mass.",
  "Water can boil and freeze at the same time — it's called the triple point.",
  "Sharks are older than trees — sharks have existed for ~450 million years, trees for ~350 million.",
  "The shortest war in history lasted 38–45 minutes (Anglo-Zanzibar War, 1896).",
  "A bolt of lightning is 5× hotter than the surface of the Sun.",
  "Crows can recognize and remember human faces — and hold grudges.",
  "The word 'nerd' was first used by Dr. Seuss in 'If I Ran the Zoo' (1950).",
  "There are more stars in the universe than grains of sand on all of Earth's beaches.",
  "Wombat poop is cube-shaped — the only known animal to produce cubic feces.",
  "The inventor of the Pringles can was buried in one.",
  "Butterflies taste with their feet.",
  "A jiffy is an actual unit of time: 1/100th of a second."
];

/* ── GRADE HELPER ── */
function getGrade(accuracy){
  if(accuracy>=90)return{letter:'A+',color:'#4fffaa',label:'Absolute W 🏆'};
  if(accuracy>=80)return{letter:'A',color:'#4fffaa',label:'Lowkey a Genius 🧠'};
  if(accuracy>=66)return{letter:'B',color:'#40f5ff',label:'Solid effort 💪'};
  if(accuracy>=50)return{letter:'C',color:'#ffaa33',label:'Mid but make it work 😐'};
  if(accuracy>=33)return{letter:'D',color:'#ff8844',label:'Barely survived 😬'};
  return{letter:'F',color:'#ff4466',label:'Brainrot confirmed 🫠'};
}

/* ── STATE ── */
const state = {
  category:'All', mode:'classic',
  score:0, streak:0, bestStreak:0,
  current:0, total:0, totalCorrect:0,
  timer:60, isActive:false, timerInterval:null,
  selectedQuestions:[],
  earnedAchievements:new Set(),
  usedLifeline:false,
  lifelines:{ fifty:false, change:false, doubledip:false },
  lifelinesUsed:0,
  doubleDipActive:false,   // true = player used double dip, first pick was wrong
  leaderboard:JSON.parse(localStorage.getItem('brainrot_lb')||'[]')
};

/* ── DOM ── */
const $=id=>document.getElementById(id);
const el={
  categorySelect:$('categorySelect'), modeSelect:$('modeSelect'), startBtn:$('startBtn'),
  score:$('score'), streak:$('streak'), timer:$('timer'),
  currentIndex:$('currentIndex'), totalQuestions:$('totalQuestions'),
  progressTrack:$('progressTrack'), progressFill:$('progressFill'),
  lifelinesBar:$('lifelinesBar'), lifelineInfo:$('lifelineInfo'),
  llFifty:$('ll-fifty'), llChange:$('ll-change'), llDoubleDip:$('ll-doubledip'),
  welcomeScreen:$('welcomeScreen'), questionCard:$('questionCard'),
  categoryBadge:$('categoryBadge'), diffBadge:$('diffBadge'), tagline:$('tagline'),
  questionText:$('questionText'), options:$('options'), hintText:$('hintText'),
  doubleDipNotice:$('doubleDipNotice'),
  achievementsList:$('achievementsList'), leaderboard:$('leaderboard'),
  completionModal:$('completionModal'), modalIcon:$('modalIcon'),
  modalTitle:$('modalTitle'), modalSummary:$('modalSummary'),
  finalScore:$('finalScore'), accuracy:$('accuracy'),
  bestStreak:$('bestStreak'), correctCount:$('correctCount'),
  gradeDisplay:$('gradeDisplay'),
  medalDisplay:$('medalDisplay'), retryBtn:$('retryBtn'),
  closeModalBtn:$('closeModalBtn'), confettiCanvas:$('confettiCanvas'),
  midGameWarning:$('midGameWarning'), mgwConfirm:$('mgwConfirm'), mgwCancel:$('mgwCancel'),
  welcomeStartBtn:$('welcomeStartBtn'),
  funFactBox:$('funFactBox'), funFactText:$('funFactText')
};

/* ── CONFETTI ── */
const confettiEngine=(()=>{
  let ctx=null,pieces=[],animId=null;
  function init(){
    const c=el.confettiCanvas;
    c.width=window.innerWidth;c.height=window.innerHeight;
    ctx=c.getContext('2d');
    window.addEventListener('resize',()=>{c.width=window.innerWidth;c.height=window.innerHeight;});
  }
  function launch(count=150){
    pieces=Array.from({length:count},()=>({
      x:Math.random()*window.innerWidth,y:-20-Math.random()*120,
      vx:(Math.random()-.5)*5,vy:2.5+Math.random()*4,
      size:5+Math.random()*7,color:`hsl(${Math.random()*360},100%,65%)`,
      rotation:Math.random()*Math.PI*2,vr:(Math.random()-.5)*.15,life:1
    }));
    if(animId)cancelAnimationFrame(animId);
    loop();
  }
  function loop(){
    if(!ctx||!pieces.length)return;
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    pieces=pieces.filter(p=>p.life>0);
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.rotation+=p.vr;p.vy+=.08;
      if(p.y>window.innerHeight+20)p.life=0;
      ctx.save();ctx.globalAlpha=p.life;
      ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
      ctx.fillStyle=p.color;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6);
      ctx.restore();
    });
    if(pieces.length)animId=requestAnimationFrame(loop);
    else ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  }
  return{init,launch};
})();

/* ── UTILS ── */
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function bumpEl(e){e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump');}
function scorePopup(pts,x,y){
  const p=document.createElement('div');
  p.className='score-popup';p.textContent=`+${pts}`;
  p.style.cssText=`left:${x}px;top:${y}px;transform:translateX(-50%)`;
  document.body.appendChild(p);setTimeout(()=>p.remove(),1300);
}

/* ── INIT ── */
function initDropdowns(){
  const cats=['All',...new Set(QUESTIONS.map(q=>q.category))];
  cats.forEach(cat=>{
    const o=document.createElement('option');
    o.value=cat;o.textContent=cat==='All'?'All Categories (20 Qs)':cat;
    el.categorySelect.appendChild(o);
  });
  el.categorySelect.addEventListener('change',e=>{state.category=e.target.value;});
  el.modeSelect.addEventListener('change',e=>{state.mode=e.target.value;});
}

/* ── LIFELINE HELPERS ── */
const lifelinesOn=()=>state.mode==='timed'||state.mode==='survival';
const maxLL=()=>state.category==='All'?3:1;

function resetLifelines(){
  state.lifelines={fifty:false,change:false,doubledip:false};
  state.lifelinesUsed=0;state.usedLifeline=false;state.doubleDipActive=false;
  el.llFifty.classList.remove('used');
  el.llChange.classList.remove('used');
  el.llDoubleDip.classList.remove('used');
  updateLLUI();
}

function updateLLUI(){
  if(!lifelinesOn()){el.lifelinesBar.classList.add('hidden');return;}
  el.lifelinesBar.classList.remove('hidden');
  const max=maxLL(),rem=max-state.lifelinesUsed;
  el.lifelineInfo.textContent=`${rem} of ${max} remaining`;
  const out=state.lifelinesUsed>=max;
  el.llFifty.disabled    = state.lifelines.fifty    ||out||!state.isActive;
  el.llChange.disabled   = state.lifelines.change   ||out||!state.isActive;
  el.llDoubleDip.disabled= state.lifelines.doubledip||out||!state.isActive||state.doubleDipActive;
}

/* ── LIFELINE: 50/50 ── */
function useLL_Fifty(){
  if(state.lifelines.fifty||state.lifelinesUsed>=maxLL()||!state.isActive)return;
  const q=state.selectedQuestions[state.current];
  const wrong=Array.from(el.options.children).filter(b=>parseInt(b.dataset.answerIdx)!==q.correct);
  shuffle(wrong).slice(0,2).forEach(b=>b.classList.add('eliminated','disabled'));
  state.lifelines.fifty=true;state.lifelinesUsed++;state.usedLifeline=true;
  el.llFifty.classList.add('used');updateLLUI();
}

/* ── LIFELINE: SKIP ── */
function useLL_Change(){
  if(state.lifelines.change||state.lifelinesUsed>=maxLL()||!state.isActive)return;
  const pool=(state.category==='All'?QUESTIONS:QUESTIONS.filter(q=>q.category===state.category));
  const available=pool.filter(q=>!state.selectedQuestions.includes(q));
  if(available.length>0) state.selectedQuestions[state.current]=shuffle(available)[0];
  state.lifelines.change=true;state.lifelinesUsed++;state.usedLifeline=true;
  el.llChange.classList.add('used');updateLLUI();
  renderQuestion();
}

/* ── LIFELINE: DOUBLE DIP ── */
function useLL_DoubleDip(){
  if(state.lifelines.doubledip||state.lifelinesUsed>=maxLL()||!state.isActive||state.doubleDipActive)return;
  state.lifelines.doubledip=true;state.lifelinesUsed++;state.usedLifeline=true;
  state.doubleDipActive=true;
  el.llDoubleDip.classList.add('used');
  el.doubleDipNotice.classList.remove('hidden');
  el.doubleDipNotice.textContent='🎯 Double Dip ready — you get 2 attempts on this question!';
  updateLLUI();
}

/* ── START GAME ── */
function startGame(){
  clearInterval(state.timerInterval);
  Object.assign(state,{
    score:0,streak:0,bestStreak:0,current:0,
    totalCorrect:0,isActive:true,earnedAchievements:new Set(),doubleDipActive:false
  });
  resetLifelines();

  const isAll=state.category==='All';
  const pool=isAll?QUESTIONS:QUESTIONS.filter(q=>q.category===state.category);
  state.selectedQuestions=shuffle(pool).slice(0,isAll?20:5);
  state.total=state.selectedQuestions.length;

  el.totalQuestions.textContent=state.total;
  el.currentIndex.textContent=1;
  el.completionModal.classList.add('hidden');
  el.welcomeScreen.classList.add('hidden');
  el.questionCard.classList.remove('hidden');
  el.progressTrack.style.display='block';

  if(state.mode==='timed'){
    state.timer=60;el.timer.textContent='60s';el.timer.className='hud-value';startTimer();
  } else if(state.mode==='survival'){
    state.timer=30;el.timer.textContent='30s';el.timer.className='hud-value';startTimer();
  } else {
    el.timer.textContent='∞';el.timer.className='hud-value';
  }
  updateLLUI();updateHUD();renderQuestion();renderAchievements();
}

/* ── TIMER ── */
function startTimer(){
  clearInterval(state.timerInterval);
  state.timerInterval=setInterval(()=>{
    state.timer-=1;
    el.timer.textContent=`${state.timer}s`;
    if(state.timer<=10)el.timer.className='hud-value timer-danger';
    else if(state.timer<=20)el.timer.className='hud-value timer-warning';
    if(state.timer<=0){
      clearInterval(state.timerInterval);
      finishGame(state.mode==='timed'?'timeout':'survival-timeout');
    }
  },1000);
}

/* ── RENDER QUESTION ── */
function renderQuestion(){
  const q=state.selectedQuestions[state.current];
  if(!q){finishGame('complete');return;}

  el.categoryBadge.textContent=q.category;
  el.diffBadge.textContent=q.difficulty.charAt(0).toUpperCase()+q.difficulty.slice(1);
  el.diffBadge.className=`diff-badge ${q.difficulty}`;
  el.questionText.textContent=q.q;
  el.hintText.textContent=q.hint;
  el.currentIndex.textContent=state.current+1;
  el.progressFill.style.width=`${(state.current/state.total)*100}%`;
  el.doubleDipNotice.classList.add('hidden');
  el.funFactBox.classList.add('hidden');

  el.options.innerHTML='';
  const letters=['A','B','C','D'];
  shuffle(q.answers.map((text,idx)=>({text,idx}))).forEach(({text,idx},pos)=>{
    const btn=document.createElement('button');
    btn.className='option-btn';
    btn.dataset.answerIdx=idx;
    btn.innerHTML=`<span class="opt-letter">${letters[pos]}</span><span>${text}</span>`;
    btn.addEventListener('click',()=>handleAnswer(idx,btn));
    el.options.appendChild(btn);
  });

  updateLLUI();
  el.questionCard.style.animation='none';
  void el.questionCard.offsetWidth;
  el.questionCard.style.animation='fadeInUp .35s ease';
}

/* ── HANDLE ANSWER ── */
function handleAnswer(answerIdx,clickedBtn){
  if(!state.isActive)return;
  const q=state.selectedQuestions[state.current];
  const isCorrect=answerIdx===q.correct;

  if(!isCorrect && state.doubleDipActive){
    // First wrong pick with Double Dip — mark wrong, let them try again
    state.doubleDipActive=false;
    clickedBtn.classList.add('wrong','disabled');
    el.doubleDipNotice.textContent='🎯 First pick was wrong — one more chance!';
    el.doubleDipNotice.classList.remove('hidden');
    // Disable only this button, others stay active
    return;
  }

  // Lock all options
  Array.from(el.options.children).forEach(b=>b.classList.add('disabled'));
  // Always show correct
  Array.from(el.options.children).forEach(b=>{
    if(parseInt(b.dataset.answerIdx)===q.correct)b.classList.add('correct');
  });
  el.doubleDipNotice.classList.add('hidden');

  if(isCorrect){
    const pts=(state.streak+1)*15;
    state.score+=pts;state.streak+=1;
    state.bestStreak=Math.max(state.bestStreak,state.streak);
    state.totalCorrect+=1;
    const r=clickedBtn.getBoundingClientRect();
    scorePopup(pts,r.left+r.width/2,r.top);
    if(state.mode==='survival'){state.timer=30;el.timer.textContent='30s';el.timer.className='hud-value';}
    // Show fun fact
    const fact=FUN_FACTS[Math.floor(Math.random()*FUN_FACTS.length)];
    el.funFactText.textContent=fact;
    el.funFactBox.classList.remove('hidden');
  } else {
    clickedBtn.classList.add('wrong');
    state.streak=0;
    if(state.mode==='survival'){
      updateHUD();checkAchievements();
      setTimeout(()=>finishGame('survival-wrong'),1200);
      return;
    }
  }

  updateHUD();checkAchievements();
  setTimeout(()=>{
    state.current+=1;
    if(state.current>=state.total)finishGame('complete');
    else renderQuestion();
  },1100);
}

/* ── FINISH GAME ── */
function finishGame(reason){
  state.isActive=false;
  clearInterval(state.timerInterval);
  el.progressFill.style.width='100%';
  [el.llFifty,el.llChange,el.llDoubleDip].forEach(b=>b.disabled=true);

  const accuracy=state.total>0?Math.round((state.totalCorrect/state.total)*100):0;
  const failed=accuracy<33;

  el.finalScore.textContent=state.score;
  el.accuracy.textContent=`${accuracy}%`;
  el.bestStreak.textContent=state.bestStreak;
  el.correctCount.textContent=`${state.totalCorrect}/${state.total}`;

  // Stat box highlight on fail
  document.querySelectorAll('.stat-box').forEach(b=>b.classList.remove('fail-stat'));
  if(failed) document.querySelector('.stat-box:nth-child(2)').classList.add('fail-stat');

  // Title & icon
  if(failed){
    el.modalTitle.textContent='Mission Failed';
    el.modalTitle.className='modal-title failed';
    el.modalIcon.textContent='💀';
  } else {
    el.modalTitle.textContent='Results';
    el.modalTitle.className='modal-title';
    el.modalIcon.textContent=accuracy===100?'🏆':'🫠';
  }

  // Summary messages
  const msgs={
    complete: failed
      ? `${accuracy}% accuracy — that's below 33%. Brainrot confirmed. Study up.`
      : accuracy===100?'Literally perfect. No cap, you ate that.':'You ate that fr fr. Mission complete.',
    timeout: failed
      ? "Time's up and the score didn't hit 33%. Brainrot is real."
      : "Time's up bestie — but you gave it your all.",
    'survival-wrong': 'One wrong move and it\'s gg. That\'s the vibe.',
    'survival-timeout': 'Clock said no. Train harder, come back stronger.'
  };
  el.modalSummary.textContent=msgs[reason]||msgs.complete;

  // Grade display
  const grade=getGrade(accuracy);
  el.gradeDisplay.innerHTML=`
    <div class="grade-letter" style="color:${grade.color};text-shadow:0 0 1.5rem ${grade.color}88">${grade.letter}</div>
    <div class="grade-label">${grade.label}</div>
  `;
  el.gradeDisplay.classList.remove('hidden');

  // Medals (only on pass)
  el.medalDisplay.innerHTML='';
  if(!failed){
    [[700,'👑 Lowkey a Genius'],[500,'🌠 Slay Queen/King'],[300,'🚀 Main Character']].forEach(([t,l])=>{
      if(state.score>=t){const s=document.createElement('span');s.className='medal-tag';s.textContent=l;el.medalDisplay.appendChild(s);}
    });
    if(accuracy===100){const s=document.createElement('span');s.className='medal-tag';s.textContent='🎯 No Cap Perfect';el.medalDisplay.appendChild(s);}
  }

  // Save leaderboard
  state.leaderboard=[...state.leaderboard,{
    score:state.score,accuracy:`${accuracy}%`,mode:state.mode,
    date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
  }].sort((a,b)=>b.score-a.score).slice(0,5);
  localStorage.setItem('brainrot_lb',JSON.stringify(state.leaderboard));

  renderLeaderboard();renderAchievements();
  el.completionModal.classList.remove('hidden');
  if(!failed&&state.score>=200)confettiEngine.launch(state.score>=500?250:150);
}

/* ── HUD ── */
function updateHUD(){
  const prev=parseInt(el.score.textContent)||0;
  el.score.textContent=state.score;
  el.streak.textContent=state.streak>0?`${state.streak} 🔥`:'0';
  if(state.score!==prev)bumpEl(el.score);
  if(state.streak>0)bumpEl(el.streak);
}

/* ── ACHIEVEMENTS ── */
function checkAchievements(){
  ACHIEVEMENT_DEFS.forEach(def=>{
    if(!state.earnedAchievements.has(def.id)&&def.check(state,state.leaderboard))
      state.earnedAchievements.add(def.id);
  });
  renderAchievements();
}
function renderAchievements(){
  el.achievementsList.innerHTML='';
  if(!state.earnedAchievements.size){
    const li=document.createElement('li');li.className='empty-msg';
    li.textContent='Slay a round to unlock achievements.';
    el.achievementsList.appendChild(li);return;
  }
  state.earnedAchievements.forEach(id=>{
    const def=ACHIEVEMENT_DEFS.find(d=>d.id===id);if(!def)return;
    const li=document.createElement('li');
    li.textContent=`${def.label} — ${def.desc}`;
    el.achievementsList.appendChild(li);
  });
}

/* ── LEADERBOARD ── */
function renderLeaderboard(){
  el.leaderboard.innerHTML='';
  if(!state.leaderboard.length){
    const li=document.createElement('li');li.className='empty-msg';
    li.textContent='No scores yet. Be the first.';
    el.leaderboard.appendChild(li);return;
  }
  state.leaderboard.forEach(e=>{
    const li=document.createElement('li');
    li.textContent=`${e.score} pts · ${e.accuracy} · ${e.mode} · ${e.date}`;
    el.leaderboard.appendChild(li);
  });
}

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener('keydown',e=>{
  if(!state.isActive)return;
  const map={'1':0,'2':1,'3':2,'4':3};
  if(map[e.key]!==undefined){
    const btns=Array.from(el.options.children).filter(b=>!b.classList.contains('disabled')&&!b.classList.contains('eliminated'));
    if(btns[map[e.key]])btns[map[e.key]].click();
  }
});

/* ── EVENTS ── */
function tryStartGame(){
  if(state.isActive){
    el.midGameWarning.classList.remove('hidden');
  } else {
    startGame();
  }
}

el.startBtn.addEventListener('click',tryStartGame);
el.welcomeStartBtn.addEventListener('click',tryStartGame);
el.mgwConfirm.addEventListener('click',()=>{
  el.midGameWarning.classList.add('hidden');
  startGame();
});
el.mgwCancel.addEventListener('click',()=>{
  el.midGameWarning.classList.add('hidden');
});
el.retryBtn.addEventListener('click',startGame);
el.closeModalBtn.addEventListener('click',()=>{
  el.completionModal.classList.add('hidden');
  el.midGameWarning.classList.add('hidden');
  el.welcomeScreen.classList.remove('hidden');
  el.questionCard.classList.add('hidden');
  el.progressTrack.style.display='none';
  el.lifelinesBar.classList.add('hidden');
});
el.completionModal.addEventListener('click',e=>{
  if(e.target===el.completionModal)el.completionModal.classList.add('hidden');
});
el.llFifty.addEventListener('click',useLL_Fifty);
el.llChange.addEventListener('click',useLL_Change);
el.llDoubleDip.addEventListener('click',useLL_DoubleDip);

/* ── BOOT ── */
window.addEventListener('DOMContentLoaded',()=>{
  initDropdowns();renderLeaderboard();confettiEngine.init();
});
