// PUL main app (vanilla JS) with PWA + Firebase Auth hooks.
// Theme: metallic gold on deep black. No leaderboards.
import { firebaseConfig } from './firebase.js';

// ---- Firebase Auth (modular) ----
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
         createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

const appFB = initializeApp(firebaseConfig);
const auth = getAuth(appFB);
const provider = new GoogleAuthProvider();

// ---- Simple local storage store ----
const store = {
  key: 'pul-v2',
  load(){
    try{ return JSON.parse(localStorage.getItem(this.key)) || {} }catch(e){ return {} }
  },
  save(data){ localStorage.setItem(this.key, JSON.stringify(data)) }
};

// ---- App State ----
const state = Object.assign({
  user: null,
  xp: 0,
  integrity: 100, // 0 - 100
  streak: 0,
  lockDays: [1,3,5], // 0-6 (Sun-Sat). User can edit in Settings.
  lastLogISO: null,
  titlesOwned: [],
  activeTitle: null,
  achievements: {} // id -> unlocked boolean
}, store.load());

// ---- Data-Driven Achievements & Titles ----
// NOTE: I don't have your exact previous counts here, so this is data-driven.
// Replace or expand these arrays with your prior lists; the UI adapts automatically.
const ACHIEVEMENTS = [
  { id:'log_1', name:'First Blood', desc:'Log any push-ups once.', xp:20 },
  { id:'log_3days', name:'Consistency I', desc:'Log on 3 locked days.', xp:50 },
  { id:'streak_3', name:'Heat Rising', desc:'3-day streak', xp:40 },
  { id:'streak_7', name:'Blazing', desc:'7-day streak', xp:120 },
  { id:'xp_1k', name:'XP Rookie', desc:'Reach 1,000 XP', xp:150 },
  { id:'integrity_90', name:'Honor Guard', desc:'Keep Integrity ≥ 90 for a week', xp:200 },
  { id:'log_1000', name:'Grinder', desc:'Log 1,000 total push-ups', xp:250 },
  { id:'streak_30', name:'Relentless', desc:'30-day streak', xp:500 }
];
const TITLES = [
  { id:'bronze_legend', name:'Bronze Legend', price:500, flair:'🥉' },
  { id:'iron_colossus', name:'Iron Colossus', price:1000, flair:'🛡️' },
  { id:'golden_myth', name:'Golden Myth', price:2000, flair:'👑' }
];

// ---- Helpers ----
const $ = (sel)=>document.querySelector(sel);
const $$ = (sel)=>Array.from(document.querySelectorAll(sel));
const todayDow = ()=> new Date().getDay();
const isLockedToday = ()=> state.lockDays.includes(todayDow());
const fmt = (n)=> new Intl.NumberFormat().format(n);

function toast(msg){
  const el = document.createElement('div');
  el.className='chip'; el.style.position='fixed'; el.style.bottom='16px'; el.style.right='16px'; el.style.zIndex='1000';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 2400);
}

function setIntegrity(by){
  state.integrity = Math.max(0, Math.min(100, state.integrity + by));
}

// Integrity penalty for suspicious logging (e.g., too frequent or large jumps)
function integrityGuard(loggedReps){
  const now = Date.now();
  const last = state.lastLogISO ? Date.parse(state.lastLogISO) : 0;
  const deltaMin = (now - last) / 60000;
  if (last && deltaMin < 5 && loggedReps > 50){
    setIntegrity(-10);
  } else {
    setIntegrity(+1); // reward normal behavior slowly
  }
}

// ---- XP & Logging ----
function grantXP(amount){
  state.xp += amount;
  $('#xp').textContent = fmt(state.xp);
  store.save(state);
}

function logPushups(count){
  if (!Number.isFinite(count) || count <= 0){ toast('Enter a valid number.'); return; }
  if (!isLockedToday()){
    toast('Today is not one of your locked days. No XP awarded.');
  } else {
    const base = Math.floor(Math.sqrt(count) * 10); // simple curve
    const integrityMultiplier = 0.5 + (state.integrity/100)*0.5; // 0.5x to 1x
    const xp = Math.round(base * integrityMultiplier);
    grantXP(xp);
    toast(`+${xp} XP • Integrity x${integrityMultiplier.toFixed(2)}`);
    bumpStreak();
    evaluateAchievements(count);
  }
  integrityGuard(count);
  state.lastLogISO = new Date().toISOString();
  store.save(state);
  render();
}

function bumpStreak(){
  const last = state.lastLogISO ? new Date(state.lastLogISO) : null;
  const today = new Date();
  if (!last){ state.streak = 1; return; }
  const daysBetween = Math.floor((today - new Date(last.toDateString()))/86400000);
  if (daysBetween === 1){ state.streak += 1; }
  else if (daysBetween > 1){ state.streak = 1; }
}

function evaluateAchievements(repsJustLogged){
  const unlocked = [];
  const totalReps = (state.totalReps||0) + repsJustLogged;
  state.totalReps = totalReps;

  const conds = {
    log_1: totalReps >= 1,
    log_3days: (state.streak>=1 && state.lockDays.length>=1) ? (state.streak >= 3) : false,
    streak_3: state.streak >= 3,
    streak_7: state.streak >= 7,
    xp_1k: state.xp >= 1000,
    integrity_90: state.integrity >= 90, // simplified: check at log time
    log_1000: totalReps >= 1000,
    streak_30: state.streak >= 30
  };

  for (const a of ACHIEVEMENTS){
    if (!state.achievements[a.id] && conds[a.id]){
      state.achievements[a.id] = true;
      grantXP(a.xp);
      unlocked.push(a.name);
    }
  }
  if (unlocked.length){ toast('Unlocked: ' + unlocked.join(', ')); }
}

// ---- Titles Shop ----
function buyTitle(id){
  const t = TITLES.find(x=>x.id===id);
  if (!t) return;
  if (state.titlesOwned.includes(id)){ state.activeTitle = id; toast('Title equipped.'); render(); store.save(state); return; }
  if (state.xp < t.price){ toast('Not enough XP'); return; }
  state.xp -= t.price;
  state.titlesOwned.push(id);
  state.activeTitle = id;
  toast(`Purchased ${t.name}`);
  store.save(state);
  render();
}

// ---- Auth UI ----
function bindAuth(){
  onAuthStateChanged(auth, (user)=>{
    state.user = user;
    $('#userBox').textContent = user ? (user.displayName || user.email) : 'Guest';
    $('#signInBtn').classList.toggle('hidden', !!user);
    $('#signOutBtn').classList.toggle('hidden', !user);
  });

  $('#googleBtn').addEventListener('click', async()=>{
    try{ await signInWithPopup(auth, provider); toast('Signed in.'); }catch(e){ toast(e.message); }
  });
  $('#emailCreateBtn').addEventListener('click', async()=>{
    const email = prompt('Email?'); const pass = prompt('Password? (min 6)');
    if(!email || !pass) return;
    try{ await createUserWithEmailAndPassword(auth, email, pass); toast('Account created.'); }catch(e){ toast(e.message); }
  });
  $('#emailSignBtn').addEventListener('click', async()=>{
    const email = prompt('Email?'); const pass = prompt('Password?');
    if(!email || !pass) return;
    try{ await signInWithEmailAndPassword(auth, email, pass); toast('Signed in.'); }catch(e){ toast(e.message); }
  });
  $('#signOutBtn').addEventListener('click', async()=>{
    try{ await signOut(auth); toast('Signed out.'); }catch(e){ toast(e.message); }
  });
}

// ---- Settings ----
function renderLockDays(){
  const wrap = $('#lockDaysWrap');
  wrap.innerHTML = '';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach((d,idx)=>{
    const btn = document.createElement('button');
    btn.className = 'btn ' + (state.lockDays.includes(idx)?'':'btn-ghost');
    btn.style.minWidth='64px';
    btn.textContent = d;
    btn.addEventListener('click', ()=>{
      if (state.lockDays.includes(idx)){
        state.lockDays = state.lockDays.filter(x=>x!==idx);
      } else {
        state.lockDays.push(idx);
      }
      store.save(state); renderLockDays();
    });
    wrap.appendChild(btn);
  });
}

function renderAchievements(){
  const wrap = $('#achWrap');
  wrap.innerHTML='';
  ACHIEVEMENTS.forEach(a=>{
    const got = !!state.achievements[a.id];
    const el = document.createElement('div');
    el.className='badge';
    el.innerHTML = `<strong>${a.name}</strong> — <span class="muted">${a.desc}</span> ${got?'✅':''}`;
    wrap.appendChild(el);
  });
}

function renderTitles(){
  const wrap = $('#titleShop');
  wrap.innerHTML='';
  TITLES.forEach(t=>{
    const owned = state.titlesOwned.includes(t.id);
    const active = state.activeTitle === t.id;
    const row = document.createElement('div');
    row.className='title-shop item';
    row.innerHTML = `
      <div>
        <div><strong>${t.name}</strong> ${t.flair||''}</div>
        <div class="muted">${owned? (active?'Equipped':'Owned'): ('Price: '+t.price+' XP')}</div>
      </div>
      <button>${owned? (active?'Equipped':'Equip'): 'Buy'}</button>
    `;
    row.querySelector('button').addEventListener('click', ()=> buyTitle(t.id));
    wrap.appendChild(row);
  });
}

function render(){
  $('#xp').textContent = fmt(state.xp);
  $('#streak').textContent = fmt(state.streak);
  const trEl=$('#totalReps'); if(trEl){ trEl.textContent = fmt(state.totalReps||0); }
  $('#integrityMeter').style.width = Math.max(2, Math.min(100, state.integrity)) + '%';
  renderLockDays();
  renderAchievements();
  renderTitles();
  store.save(state);
}

// ---- Events ----
function bindUI(){
  $('#logBtn').addEventListener('click', ()=>{
    const v = parseInt($('#reps').value,10);
    logPushups(v);
    $('#reps').value = '';
  });
  $('#installBtn').addEventListener('click', ()=>{
    // Placeholder; modern browsers show install prompt automatically after PWA criteria.
    toast('To install: use browser menu • "Add to Home screen".');
  });
}

// ---- PWA registration ----
if ('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}

// ---- Defer init until DOM ready ----
window.addEventListener('DOMContentLoaded', ()=>{
  bindUI();
  bindAuth();
  render();
});


// ---- Mini Calendar ----
let calRef = new Date();
function renderCalendar(){
  const grid = document.getElementById('calGrid');
  const label = document.getElementById('calLabel');
  if (!grid || !label) return;
  const year = calRef.getFullYear();
  const month = calRef.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  label.textContent = first.toLocaleString(undefined, { month:'long', year:'numeric' });
  grid.innerHTML = '';
  for (let i=0;i<startDow;i++){ const d=document.createElement('div'); d.className='cal-cell'; grid.appendChild(d); }
  for (let day=1; day<=daysInMonth; day++){
    const date=new Date(year,month,day); const dow=date.getDay();
    const cell=document.createElement('div'); cell.className='cal-cell'; cell.textContent=day;
    if (state.lockDays.includes(dow)) cell.classList.add('locked');
    const today=new Date(); if (date.toDateString()===today.toDateString()) cell.classList.add('today');
    cell.addEventListener('click', ()=>{
      if (state.lockDays.includes(dow)) state.lockDays = state.lockDays.filter(x=>x!==dow);
      else state.lockDays.push(dow);
      store.save(state); renderLockDays(); renderCalendar();
      const dowToday=new Date().getDay();
      document.getElementById('lockedFlag').textContent = state.lockDays.includes(dowToday) ? 'YES' : 'NO';
    });
    grid.appendChild(cell);
  }
}
function bindCalendarNav(){
  const prev=document.getElementById('calPrev');
  const next=document.getElementById('calNext');
  if(prev) prev.addEventListener('click', ()=>{ calRef=new Date(calRef.getFullYear(), calRef.getMonth()-1, 1); renderCalendar(); });
  if(next) next.addEventListener('click', ()=>{ calRef=new Date(calRef.getFullYear(), calRef.getMonth()+1, 1); renderCalendar(); });
}

// ---- Plus/Minus buttons ----
function bindQtyControls(){
  const repsInput = document.getElementById('reps');
  const plus = document.getElementById('plusBtn');
  const minus = document.getElementById('minusBtn');
  if(plus) plus.addEventListener('click', ()=>{
    const v = parseInt(repsInput.value || '0', 10);
    repsInput.value = (isNaN(v) ? 0 : v) + 5;
  });
  if(minus) minus.addEventListener('click', ()=>{
    const v = parseInt(repsInput.value || '0', 10);
    repsInput.value = Math.max(0, (isNaN(v) ? 0 : v) - 5);
  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  renderCalendar();
  bindCalendarNav();
  bindQtyControls();
});
