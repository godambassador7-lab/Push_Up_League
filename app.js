// PUL v3 — Metallic Blue theme, mini calendar, 500 achievements, 100 titles.
import { firebaseConfig } from './firebase.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
         createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

const appFB = initializeApp(firebaseConfig);
const auth = getAuth(appFB);
const provider = new GoogleAuthProvider();

const store = {
  key:'pul-v3',
  load(){ try{return JSON.parse(localStorage.getItem(this.key))||{}}catch(e){return{}} },
  save(d){ localStorage.setItem(this.key, JSON.stringify(d)) }
};

const state = Object.assign({
  user:null,
  xp:0,
  integrity:100,
  streak:0,
  lockDays:[1,3,5],
  lastLogISO:null,
  titlesOwned:[],
  activeTitle:null,
  achievements:{},
  typeTotals:{},
  totalReps:0
}, store.load());

const PUSH_TYPES = ['Standard','Wide','Diamond','Incline','Decline','Plyometric','Archer','Pike','Pseudo Planche','Handstand Assist'];
const ACHIEVEMENTS = generateAchievements();
const TITLES = generateTitles();

// ---- Helpers ----
const $ = (sel)=>document.querySelector(sel);
const $$ = (sel)=>Array.from(document.querySelectorAll(sel));
const fmt = (n)=> new Intl.NumberFormat().format(n);
const todayDow = ()=> new Date().getDay();
const isLockedToday = ()=> state.lockDays.includes(todayDow());

function toast(msg){
  const el=document.createElement('div');
  el.className='chip'; el.style.position='fixed'; el.style.bottom='16px'; el.style.right='16px'; el.style.zIndex='1000';
  el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2400);
}

function setIntegrity(by){ state.integrity = Math.max(0, Math.min(100, state.integrity + by)); }
function integrityGuard(loggedReps){
  const now=Date.now(); const last=state.lastLogISO?Date.parse(state.lastLogISO):0;
  const deltaMin=(now-last)/60000;
  if(last && deltaMin<5 && loggedReps>50){ setIntegrity(-10); } else { setIntegrity(+1); }
}

function grantXP(amount){ state.xp += amount; $('#xp').textContent=fmt(state.xp); store.save(state); }

function logPushups(count){
  const typeSel = document.getElementById('typeSelect'); const ptype = typeSel?typeSel.value:'Standard';
  if(!Number.isFinite(count)||count<=0){ toast('Enter a valid number.'); return; }
  if(!isLockedToday()){
    toast('Today is not locked. No XP awarded.');
  } else {
    const base = Math.floor(Math.sqrt(count) * 10);
    const integrityMultiplier = 0.5 + (state.integrity/100)*0.5;
    const xp = Math.round(base * integrityMultiplier);
    grantXP(xp);
    toast(`+${xp} XP • Integrity x${integrityMultiplier.toFixed(2)}`);
    bumpStreak();
    evaluateAchievements(count, ptype);
  }
  integrityGuard(count);
  state.lastLogISO = new Date().toISOString();
  store.save(state);
  render();
}

function bumpStreak(){
  const last = state.lastLogISO ? new Date(state.lastLogISO) : null;
  const today = new Date();
  if(!last){ state.streak = 1; return; }
  const daysBetween = Math.floor((today - new Date(last.toDateString()))/86400000);
  if(daysBetween === 1){ state.streak += 1; }
  else if(daysBetween > 1){ state.streak = 1; }
}

function evaluateAchievements(repsJustLogged, ptype){
  state.totalReps = (state.totalReps||0) + repsJustLogged;
  state.typeTotals[ptype] = (state.typeTotals[ptype]||0) + repsJustLogged;
  const unlocked=[];

  const conds = {
    streak_3: state.streak>=3,
    streak_7: state.streak>=7,
    xp_1k: state.xp>=1000,
    integrity_90: state.integrity>=90
  };

  // Type-based checks: achievements named "<Type> <N>"
  ACHIEVEMENTS.forEach(a=>{
    const parts=a.name.split(' ');
    const maybeNum=parseInt(parts[parts.length-1],10);
    const maybeType=parts.slice(0,-1).join(' ');
    if(!Number.isNaN(maybeNum) && PUSH_TYPES.includes(maybeType)){
      const current = state.typeTotals[maybeType]||0;
      if(current >= maybeNum && !state.achievements[a.id]){
        state.achievements[a.id]=true; grantXP(a.xp); unlocked.push(a.name);
      }
    }
  });

  // Totals, streaks, weekly, etc. will be checked by name patterns too
  ACHIEVEMENTS.forEach(a=>{
    if(state.achievements[a.id]) return;
    if(a.name.startsWith('Total ')){
      const need = parseInt(a.name.split(' ')[1],10);
      if((state.totalReps||0) >= need){ state.achievements[a.id]=true; grantXP(a.xp); unlocked.push(a.name); }
    }
    if(a.name.startsWith('One-Set ')){
      const need = parseInt(a.name.split(' ')[1],10);
      if(repsJustLogged >= need){ state.achievements[a.id]=true; grantXP(a.xp); unlocked.push(a.name); }
    }
    if(a.name.startsWith('Streak ')){
      const need = parseInt(a.name.split(' ')[1],10);
      if(state.streak >= need){ state.achievements[a.id]=true; grantXP(a.xp); unlocked.push(a.name); }
    }
  });

  if(unlocked.length){ toast('Unlocked: ' + unlocked.slice(0,4).join(', ') + (unlocked.length>4?` +${unlocked.length-4} more`:'')); }
}

// Legendary Store
function buyTitle(id){
  const t=TITLES.find(x=>x.id===id); if(!t) return;
  if(state.titlesOwned.includes(id)){ state.activeTitle=id; toast('Title equipped.'); render(); store.save(state); return; }
  if(state.xp < t.price){ toast('Not enough XP'); return; }
  state.xp -= t.price; state.titlesOwned.push(id); state.activeTitle=id; toast(`Purchased ${t.name}`);
  store.save(state); render();
}

// Auth UI
function bindAuth(){
  onAuthStateChanged(auth, (user)=>{
    state.user=user;
    $('#userBox').textContent = user ? (user.displayName||user.email) : 'Guest';
    $('#signInBtn').classList.toggle('hidden', !!user);
    $('#signOutBtn').classList.toggle('hidden', !user);
  });
  $('#googleBtn').addEventListener('click', async()=>{ try{await signInWithPopup(auth, provider); toast('Signed in.');}catch(e){toast(e.message);} });
  $('#emailCreateBtn').addEventListener('click', async()=>{
    const email=prompt('Email?'); const pass=prompt('Password? (min 6)'); if(!email||!pass) return;
    try{await createUserWithEmailAndPassword(auth,email,pass); toast('Account created.');}catch(e){toast(e.message);}
  });
  $('#emailSignBtn').addEventListener('click', async()=>{
    const email=prompt('Email?'); const pass=prompt('Password?'); if(!email||!pass) return;
    try{await signInWithEmailAndPassword(auth,email,pass); toast('Signed in.');}catch(e){toast(e.message);}
  });
  $('#signOutBtn').addEventListener('click', async()=>{ try{await signOut(auth); toast('Signed out.');}catch(e){toast(e.message);} });
}

// Settings renderers
function renderLockDays(){
  const wrap=$('#lockDaysWrap'); wrap.innerHTML='';
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach((d,idx)=>{
    const btn=document.createElement('button');
    btn.className='btn ' + (state.lockDays.includes(idx)?'':'btn-ghost');
    btn.style.minWidth='64px'; btn.textContent=d;
    btn.addEventListener('click',()=>{
      if(state.lockDays.includes(idx)){ state.lockDays=state.lockDays.filter(x=>x!==idx); } else { state.lockDays.push(idx); }
      store.save(state); renderLockDays(); renderCalendar();
      const dowToday=new Date().getDay();
      $('#lockedFlag').textContent = state.lockDays.includes(dowToday)?'YES':'NO';
    });
    wrap.appendChild(btn);
  });
}

function renderAchievements(){
  const wrap=$('#achWrap'); wrap.innerHTML='';
  ACHIEVEMENTS.forEach(a=>{
    const got=!!state.achievements[a.id];
    const el=document.createElement('div');
    el.className='badge';
    el.innerHTML=`<strong>${a.name}</strong> — <span class="muted">${a.desc}</span> ${got?'✅':''}`;
    wrap.appendChild(el);
  });
}

function renderTitles(){
  const wrap=$('#titleShop'); wrap.innerHTML='';
  TITLES.forEach(t=>{
    const owned=state.titlesOwned.includes(t.id);
    const active=state.activeTitle===t.id;
    const row=document.createElement('div');
    row.className='title-shop item';
    row.innerHTML=`<div><div><strong>${t.name}</strong></div><div class="muted">${owned?(active?'Equipped':'Owned'):'Price: '+t.price+' XP'}</div></div>
                   <button>${owned?(active?'Equipped':'Equip'):'Buy'}</button>`;
    row.querySelector('button').addEventListener('click',()=>buyTitle(t.id));
    wrap.appendChild(row);
  });
}

function render(){
  $('#xp').textContent = fmt(state.xp);
  $('#streak').textContent = fmt(state.streak);
  $('#totalReps').textContent = fmt(state.totalReps||0);
  $('#integrityMeter').style.width = Math.max(2, Math.min(100, state.integrity)) + '%';
  renderLockDays();
  renderAchievements();
  renderTitles();
  store.save(state);
}

// UI bindings
function bindUI(){
  $('#logBtn').addEventListener('click', ()=>{
    const v=parseInt($('#reps').value,10); logPushups(v); $('#reps').value='';
  });
  // +/-
  const repsInput=$('#reps');
  $('#plusBtn').addEventListener('click', ()=>{ const v=parseInt(repsInput.value||'0',10); repsInput.value=(isNaN(v)?0:v)+5; });
  $('#minusBtn').addEventListener('click', ()=>{ const v=parseInt(repsInput.value||'0',10); repsInput.value=Math.max(0,(isNaN(v)?0:v)-5); });
  $('#installBtn').addEventListener('click', ()=>toast('To install: browser menu → Add to Home Screen'));
}

// PWA
if('serviceWorker' in navigator){ window.addEventListener('load', ()=>{ navigator.serviceWorker.register('./sw.js'); }); }

// Mini Calendar
let calRef=new Date();
function renderCalendar(){
  const grid=document.getElementById('calGrid'); const label=document.getElementById('calLabel'); if(!grid||!label)return;
  const y=calRef.getFullYear(), m=calRef.getMonth(); const first=new Date(y,m,1); const startDow=first.getDay(); const dim=new Date(y,m+1,0).getDate();
  label.textContent=first.toLocaleString(undefined,{month:'long',year:'numeric'}); grid.innerHTML='';
  for(let i=0;i<startDow;i++){ const d=document.createElement('div'); d.className='cal-cell'; grid.appendChild(d); }
  for(let day=1; day<=dim; day++){
    const dt=new Date(y,m,day); const dow=dt.getDay(); const cell=document.createElement('div'); cell.className='cal-cell'; cell.textContent=day;
    if(state.lockDays.includes(dow)) cell.classList.add('locked');
    const today=new Date(); if(dt.toDateString()===today.toDateString()) cell.classList.add('today');
    cell.addEventListener('click',()=>{
      if(state.lockDays.includes(dow)) state.lockDays=state.lockDays.filter(x=>x!==dow); else state.lockDays.push(dow);
      store.save(state); renderLockDays(); renderCalendar();
      const dowToday=new Date().getDay(); document.getElementById('lockedFlag').textContent = state.lockDays.includes(dowToday)?'YES':'NO';
    });
    grid.appendChild(cell);
  }
}
function bindCalendarNav(){
  $('#calPrev').addEventListener('click',()=>{ calRef=new Date(calRef.getFullYear(),calRef.getMonth()-1,1); renderCalendar(); });
  $('#calNext').addEventListener('click',()=>{ calRef=new Date(calRef.getFullYear(),calRef.getMonth()+1,1); renderCalendar(); });
}

// Data generators
function generateAchievements(){
  const list=[]; let i=1; const add=(o)=>list.push(Object.assign({id:'a'+(i++)},o));
  const totals=[50,100,150,200,300,400,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2500,3000,3500,4000,4500,5000,
    6000,7000,8000,9000,10000,12000,14000,16000,18000,20000,22500,25000,27500,30000,35000,40000,45000,50000,
    60000,70000,80000,90000,100000,120000,140000,160000,180000,200000,225000,250000,275000,300000,325000,350000,375000,400000];
  totals.slice(0,60).forEach(n=>add({name:`Total ${n}`,desc:`Accumulate ${n} push-ups.`,xp:Math.min(500,Math.round(n/40))}));
  const streaks=[3,5,7,10,14,21,30,45,60,75,90,100,120,150,180,210,240,270,300,330,360,400,450,500,550,600,650,700,750,800,850,900,950,1000,1050,1100,1150,1200,1250,1300];
  streaks.forEach(n=>add({name:`Streak ${n}`,desc:`Maintain a ${n}-day streak.`,xp:Math.min(600,30+Math.floor(n/2))}));
  [80,85,90,95,100].forEach(l=>add({name:`Integrity ${l}`,desc:`Keep integrity ≥ ${l} for 7 days.`,xp:120+l}));
  [5,10,20,30,40,50,60,70,80,90,100,120,150,180,210,240,270,300].forEach(days=>add({name:`Honor ${days}`,desc:`No integrity penalties for ${days} days.`,xp:100+Math.floor(days/2)}));
  [1,2,3,4,5,6,7].forEach(k=>add({name:`Locked ${k}`,desc:`Keep ${k} days locked for 30 days.`,xp:80+k*15}));
  [4,8,12,16,20,24,28,32,36,40,44,48,52].forEach(w=>add({name:`Commit ${w}`,desc:`Log on lock-days for ${w} weeks total.`,xp:100+w*5}));
  [10,15,20,25,30,35,40,45,50,60,70,80,90,100,120,140,160,180,200,250,300,350,400,450,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2200,2400,2600,2800,3000]
    .forEach(n=>add({name:`One-Set ${n}`,desc:`Log ${n} push-ups in a single day.`,xp:50+Math.floor(n/10)}));
  [100,150,200,250,300,350,400,450,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2200,2400,2600,2800,3000,3200,3400,3600,3800,4000,4500,5000,5500,6000,6500,7000,7500,8000,8500,9000,10000]
    .forEach(n=>add({name:`Weekly ${n}`,desc:`Reach ${n} push-ups in any week.`,xp:80+Math.floor(n/20)}));
  const typeTiers=[25,50,100,200,300,500,750,1000,1500,2000];
  PUSH_TYPES.forEach(t=> typeTiers.forEach(n=>add({name:`${t} ${n}`,desc:`Do ${n} ${t} push-ups total.`,xp:80+Math.floor(n/5)})));
  for(let m=1;m<=60;m++){ add({name:`Consistency ${m}`,desc:`Log on ≥3 locked days for ${m} months total.`,xp:120+m*3}); }
  for(let k=1;k<=60;k++){ add({name:`Milestone #${k}`,desc:`Complete special challenge #${k}.`,xp:150+k*2}); }
  return list.slice(0,500);
}

function generateTitles(){
  const names=[]; const A=['Bronze','Iron','Steel','Cobalt','Titan','Mythic','Onyx','Sapphire','Platinum','Aether'];
  const B=['Warrior','Juggernaut','Guardian','Vanguard','Champion','Overlord','Sentinel','Monarch','Paragon','Myth'];
  outer: for(const a of A){ for(const b of B){ names.push(`${a} ${b}`); if(names.length>=100) break outer; } }
  return names.map((n,i)=>({ id:`t${i+1}`, name:n, price:400+i*40, flair:'' }));
}

// Bootstrap
window.addEventListener('DOMContentLoaded', ()=>{
  bindUI(); bindAuth(); render(); renderCalendar(); bindCalendarNav();
});
