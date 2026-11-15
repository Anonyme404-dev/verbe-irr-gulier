
/* ============================================================
   Verbes irréguliers : logique de l'application
   (les verbes sont dans verbs.js, le style dans style.css)
   ============================================================ */
'use strict';

const keys = ['base', 'preterit', 'participle', 'french'];
const meta = { base: 'Base Verbale', preterit: 'Prétérit', participle: 'Participe Passé', french: 'Traduction' };
const short = { base: 'Base', preterit: 'Prétérit', participle: 'Participe', french: 'Traduction' };

/* ---------- Sauvegarde locale (progression, paramètres, listes) ---------- */
// Si le navigateur refuse localStorage (navigation privée...), les données restent en mémoire pour la session.
const mem = {};
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); if (v !== null) return JSON.parse(v); } catch {} return k in mem ? mem[k] : d; },
  set(k, v){ mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k){ delete mem[k]; try { localStorage.removeItem(k); } catch {} }
};
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
store.del('missed'); store.del('verbPatches');   // anciennes clés d'une version précédente

const savedCols = store.get('hiddenCols', []);
let hiddenCols = keys.map((_, i) => Array.isArray(savedCols) && savedCols[i] === true);

// Version 2 des réglages : nouveaux défauts (bouton 🔊 désactivé, voix britannique), appliqués une seule fois.
let savedSettings = store.get('settings', {});
if (!isObj(savedSettings)) savedSettings = {};
if (savedSettings.v !== 2){ delete savedSettings.speech; delete savedSettings.accent; savedSettings.v = 2; store.set('settings', savedSettings); }
let settings = Object.assign({ speech: false, listenAll: false, letters: false, accent: 'uk', theme: 'auto' }, savedSettings);
for (const k of ['speech', 'listenAll', 'letters']) settings[k] = settings[k] === true;
if (!['auto', 'us', 'uk'].includes(settings.accent)) settings.accent = 'uk';
if (!['auto', 'light', 'dark'].includes(settings.theme)) settings.theme = 'auto';

/* ---------- Paramètres ---------- */
const canSpeak = 'speechSynthesis' in window;
const syncSeg = (id, val) => document.querySelectorAll('#' + id + ' button').forEach(b => {
  const on = b.dataset.v === val;
  b.classList.toggle('active', on);
  b.setAttribute('aria-pressed', on);
});
function applySettings(){
  document.body.classList.toggle('no-speech', !settings.speech || !canSpeak);
  document.body.classList.toggle('no-listenall', !settings.listenAll);
  document.body.classList.toggle('no-letters', !settings.letters);
  if (settings.theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = settings.theme;
  syncSeg('theme-seg', settings.theme);
  syncSeg('accent-seg', settings.accent);
}
function setSetting(k, v){ settings[k] = v; store.set('settings', settings); if (k === 'accent') pickVoice(); applySettings(); }
function openSettings(){
  const sp = document.getElementById('set-speech'), la = document.getElementById('set-listenall');
  sp.checked = settings.speech && canSpeak; sp.disabled = !canSpeak;
  la.checked = settings.listenAll; la.disabled = !canSpeak;
  document.getElementById('set-letters').checked = settings.letters;
  document.getElementById('speech-note').textContent = canSpeak ? 'Prononciation en anglais' : 'Non disponible sur ce navigateur';
  pickVoice();
  document.getElementById('settings').showModal();
}
document.getElementById('settings').addEventListener('click', e => { if (e.target.id === 'settings') e.target.close(); });

/* ---------- Prononciation (anglais) ---------- */
let enVoice = null, voiceLang = 'en-US';
const ACCENTS = { auto: ['en-US','en-GB'], us: ['en-US'], uk: ['en-GB'] };
function pickVoice(){
  if (!canSpeak) return;
  const code = l => l.replace('_','-').toLowerCase();
  const vs = speechSynthesis.getVoices().filter(v => code(v.lang).startsWith('en'));
  const prefs = ACCENTS[settings.accent] || ACCENTS.auto;
  enVoice = null;
  for (const p of prefs){
    const m = vs.filter(v => code(v.lang) === p.toLowerCase());
    if (m.length){ enVoice = m.find(v => v.localService) || m[0]; break; }
  }
  if (!enVoice) enVoice = vs[0] || null;
  voiceLang = enVoice ? enVoice.lang.replace('_','-') : prefs[0];
  const info = document.getElementById('voice-info');
  if (info) info.textContent = enVoice ? `Voix utilisée : ${enVoice.name} (${enVoice.lang})` : "Aucune voix anglaise détectée : l'appareil choisira la sienne.";
}
if (canSpeak){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(text){
  if (!canSpeak || !settings.speech) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\//g, ', '));
  u.lang = voiceLang;
  if (enVoice) u.voice = enVoice;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}
const testVoice = () => speak('Hello! Be, was, been.');

/* ---------- Comparaison tolérante ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/\(.*?\)/g,'').replace(/\s+/g,' ').trim();
const accepted = val => { const n = norm(val); return [n, ...n.split(/[\/,]/).map(x => x.trim())].filter(Boolean); };
const isCorrect = (input, expected) => accepted(expected).includes(norm(input));

/* ---------- Répétition espacée (boîtes de Leitner) ---------- */
const DAY = 864e5;
const GAPS = [0, 1, 3, 7, 14];
let srs = store.get('srs', {});
if (!isObj(srs)) srs = {};
const entry = v => {
  const e = srs[v.base];
  if (!isObj(e) || !Number.isFinite(e.box) || !Number.isFinite(e.due)) return { box: 0, due: 0 };
  const box = Math.min(Math.max(Math.round(e.box), 0), GAPS.length - 1);
  // horloge de l'appareil reculée : une échéance trop lointaine est ramenée à « maintenant »
  return { box, due: e.due > Date.now() + (GAPS[GAPS.length - 1] + 1) * DAY ? 0 : e.due };
};
let lists = store.get('lists', []);
lists = (Array.isArray(lists) ? lists : [])
  .filter(l => isObj(l) && /^[\w-]{1,30}$/.test(l.id) && typeof l.name === 'string' && Array.isArray(l.bases))
  .map(l => ({
    id: l.id,
    name: l.name.slice(0, 60),
    bases: l.bases.filter(b => typeof b === 'string'),
    tableaux: Array.isArray(l.tableaux) ? l.tableaux.filter(Number.isFinite) : []
  }));
let quizList = 'all', viewList = 'all';
const listById = id => lists.find(l => l.id === id);
function poolVerbs(){ const l = listById(quizList); return l ? verbsData.filter(v => l.bases.includes(v.base)) : verbsData; }
const dueList = () => poolVerbs().filter(v => entry(v).due <= Date.now());

let mode = 'srs', current = null, givenKey = 'base', tab = 'quiz';
let score = 0, total = 0, streak = 0, answered = false, retry = [];
let lastRetry = false;

function pickNext(){
  const r = lastRetry ? -1 : retry.findIndex(x => x.at <= total);
  if (r >= 0){
    lastRetry = true;
    const b = retry.splice(r, 1)[0].base;
    return verbsData.find(v => v.base === b);
  }
  lastRetry = false;
  let list = mode === 'srs' ? dueList() : poolVerbs();
  if (!list.length) list = [...poolVerbs()].sort((a,b) => entry(a).due - entry(b).due).slice(0, 5);
  const others = list.filter(v => !current || v.base !== current.base);
  if (others.length) list = others;
  const weights = list.map(v => mode === 'srs' ? 5 - entry(v).box : 1);
  let n = Math.random() * weights.reduce((a,b) => a + b, 0);
  for (let i = 0; i < list.length; i++){ n -= weights[i]; if (n <= 0) return list[i]; }
  return list[list.length - 1];
}

function record(ok){
  const e = entry(current);
  const box = ok ? Math.min(e.box + 1, GAPS.length - 1) : 0;
  srs[current.base] = { box, due: Date.now() + GAPS[box] * DAY };
  store.set('srs', srs);
  if (!ok && !retry.some(x => x.base === current.base)) retry.push({ base: current.base, at: total + 3 });
}

/* ---------- Session (le quiz reprend où on l'a laissé) ---------- */
const getVals = () => Object.fromEntries([...document.querySelectorAll('.quiz-target-input')].map(i => [i.dataset.key, i.value]));
function saveSession(){
  if (!current) return;
  store.set('session', { mode, score, total, streak, retry, cur: current.base, givenKey, answered, vals: getVals(), tab, quizList });
}
function restoreSession(){
  const s = store.get('session', null);
  if (!isObj(s)) return initQuiz();
  const v = verbsData.find(x => x.base === s.cur);
  if (!v || !keys.includes(s.givenKey)) return initQuiz();
  mode = s.mode === 'all' ? 'all' : 'srs';
  quizList = listById(s.quizList) ? s.quizList : 'all';
  syncMode();
  score = s.score|0; total = s.total|0; streak = s.streak|0; retry = Array.isArray(s.retry) ? s.retry.filter(x => isObj(x) && typeof x.base === 'string' && Number.isFinite(x.at)) : [];
  current = v; givenKey = s.givenKey;
  renderQuestion(s.vals || {}, false);
  if (s.answered){ answered = true; markAnswer(); }
  if (s.tab === 'list') switchTab('list');
}

/* ---------- Quiz ---------- */
const syncMode = () => syncSeg('mode-seg', mode);
function setMode(m){ if (m === mode) return; mode = m; syncMode(); initQuiz(); }
function initQuiz(){
  score = 0; total = 0; streak = 0; retry = []; current = null; lastRetry = false;
  loadQuestion();
}

function loadQuestion(){
  current = pickNext();
  givenKey = keys[Math.floor(Math.random() * keys.length)];
  renderQuestion({}, true);
  saveSession();
}

// Le curseur se place tout seul seulement sur PC (sur téléphone, ça ouvrirait le clavier)
const canAutoFocus = matchMedia('(hover: hover) and (pointer: fine)').matches;
const esc = t => String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function renderQuestion(vals, focus){
  answered = false;
  document.getElementById('q-prompt-text').textContent = `Complète la ligne dans l'ordre. L'indice est déjà rempli.`;
  document.getElementById('quiz-inputs-container').innerHTML = keys.map(k => k === givenKey ? `
    <div class="input-group given">
      <label>${meta[k]} <em>(indice)</em></label>
      <div class="given-row"><input type="text" value="${esc(current[k])}" disabled aria-label="Indice">${k !== 'french' ? '<button type="button" class="speak-btn" onclick="speakGiven()" aria-label="Écouter en anglais">🔊</button>' : ''}</div>
    </div>` : `
    <div class="input-group">
      <label for="in-${k}">${meta[k]}</label>
      <input id="in-${k}" type="text" class="quiz-target-input" data-key="${k}" value="${esc(vals[k] || '')}" placeholder="${meta[k]}..." autocomplete="off" autocapitalize="none" spellcheck="false" oninput="updateSubmit()">
      <div class="answer"></div>
    </div>`).join('');
  document.getElementById('q-feedback').innerHTML = (mode === 'srs' && !dueList().length) ? '<div class="note">🎉 Tout est à jour : révision libre</div>' : '';
  document.getElementById('next-btn').disabled = true;
  updateSubmit(); updateStats();
  if (focus && canAutoFocus) document.querySelector('.quiz-target-input')?.focus();
}

function updateStats(){
  document.getElementById('score-text').innerHTML = `<strong>${score} / ${total}</strong><small>Score</small>`;
  document.getElementById('streak-text').innerHTML = `<strong>🔥 ${streak}</strong><small>Série</small>`;
  document.getElementById('due-text').innerHTML = `<strong>📌 ${dueList().length}</strong><small>À revoir</small>`;
  const P = poolVerbs();
  const m = Math.round(P.reduce((a,v) => a + entry(v).box, 0) / (P.length * (GAPS.length - 1)) * 100);
  document.getElementById('mastery-text').textContent = `Maîtrise : ${m} %`;
  document.getElementById('mastery-bar').style.width = m + '%';
}

const speakGiven = () => speak(current[givenKey]);
const speakAll = () => speak(`${current.base}. ${current.preterit}. ${current.participle}.`);

function updateSubmit(){
  const all = [...document.querySelectorAll('.quiz-target-input')].every(i => i.value.trim());
  document.getElementById('submit-btn').disabled = !all || answered;
  saveSession();
}

/* Affiche la correction (sans modifier le score) */
function markAnswer(){
  let allOk = true;
  document.querySelectorAll('.quiz-target-input').forEach(inp => {
    const k = inp.dataset.key, ok = isCorrect(inp.value, current[k]);
    inp.classList.add(ok ? 'ok' : 'ko'); inp.disabled = true;
    if (!ok){ allOk = false; inp.parentElement.querySelector('.answer').textContent = `Attendu : ${current[k]}`; }
  });
  document.getElementById('q-feedback').innerHTML = (allOk
    ? '<span class="ok-text">✅ Bravo ! Tout est correct.</span>'
    : '<span class="ko-text">❌ Pas tout à fait, il reviendra bientôt.</span>')
    + '<button type="button" class="speak-btn speak-all" onclick="speakAll()">🔊 Écouter les 3 formes</button>';
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('next-btn').disabled = false;
  return allOk;
}

function checkAnswer(){
  if (answered) return;
  answered = true;
  const ok = markAnswer();
  total++;
  if (ok){ score++; streak++; } else { streak = 0; }
  record(ok);
  updateStats(); saveSession();
  document.getElementById('next-btn').focus();
}

function nextQuestion(){ loadQuestion(); }

function resetStats(){
  if (!confirm("Effacer toute ta progression ?")) return;
  srs = {}; store.del('srs'); store.del('session');
  document.getElementById('settings').close();
  initQuiz();
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || tab !== 'quiz' || document.querySelector('dialog[open]')) return;
  if (e.target.closest('.speak-btn, .gear')) return;
  if (!answered){ if (!document.getElementById('submit-btn').disabled) checkAnswer(); }
  else if (e.target.id !== 'next-btn') nextQuestion();
});

/* ---------- Liste ---------- */
function switchTab(t){
  tab = t;
  for (const x of ['quiz','list']){
    document.getElementById('tab-'+x).classList.toggle('active', x === t);
    document.getElementById('tab-'+x).setAttribute('aria-selected', x === t);
    document.getElementById(x+'-section').classList.toggle('active', x === t);
  }
  if (t === 'list') renderTables();
  saveSession();
}

function buildControls(){
  document.getElementById('controls-row').innerHTML = keys.map((k,i) =>
    `<button class="toggle-col-btn" id="btn-col-${i}" onclick="toggleColumn(${i})"></button>`).join('');
  keys.forEach((_,i) => updateToggleLabel(i));
}
function updateToggleLabel(i){
  const b = document.getElementById('btn-col-'+i);
  b.textContent = (hiddenCols[i] ? 'Afficher ' : 'Masquer ') + short[keys[i]];
  b.classList.toggle('hidden-col', hiddenCols[i]);
}
function toggleColumn(i){
  hiddenCols[i] = !hiddenCols[i]; store.set('hiddenCols', hiddenCols);
  updateToggleLabel(i); renderTables();
}

function cellTap(el){
  const span = el.querySelector('span');
  if (span.classList.contains('hidden-text')) span.classList.remove('hidden-text');
}
function jumpTo(l){
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('L-' + l)?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
}
let searchTimer;
function searchList(){ clearTimeout(searchTimer); searchTimer = setTimeout(renderTables, 120); }
function renderTables(){
  const q = norm(document.getElementById('search-input').value);
  const L = listById(viewList);
  const rows = verbsData.map((v,n) => [v,n]).filter(([v]) => (!L || L.bases.includes(v.base)) && keys.some(k => norm(v[k]).includes(q)));
  const head = `<div class="vrow vhead">${keys.map(k => `<div class="${k === 'french' ? 'fr' : ''}">${short[k]}</div>`).join('')}</div>`;
  let last = '';
  const html = rows.map(([v,n]) => {
    const l = v.base[0].toUpperCase();
    const id = l !== last ? ` id="L-${l}"` : ''; last = l;
    return `<div class="vrow"${id}>${keys.map((k,i) =>
      `<div class="vcell ${k === 'french' ? 'fr' : 'en'} ${v[k].length > 10 ? 'long' : ''} c-${k}" data-label="${short[k]}" onclick="cellTap(this)">${k !== 'french' ? `<button type="button" class="speak-btn mini" onclick="event.stopPropagation();speak(verbsData[${n}].${k})" aria-label="Écouter">🔊</button>` : ''}<span class="${hiddenCols[i] ? 'hidden-text' : ''}">${esc(v[k]).replace(/\//g, '/<wbr>')}</span></div>`).join('')}</div>`;
  }).join('');
  document.getElementById('tables-container').innerHTML = rows.length ? `<div class="vlist">${head}${html}</div>` : '<p class="empty">Aucun verbe trouvé.</p>';
  document.getElementById('az').innerHTML = [...new Set(rows.map(([v]) => v.base[0].toUpperCase()))]
    .map(l => `<button type="button" onclick="jumpTo('${l}')">${l}</button>`).join('');
}

/* ---------- Listes personnalisées ---------- */
function renderChips(){
  for (const w of ['quiz','list']){
    const cur = w === 'quiz' ? quizList : viewList;
    document.getElementById('chips-' + w).innerHTML =
      `<button type="button" class="chip plus" onclick="openListEditor()" aria-label="Créer une liste">＋</button><button type="button" class="chip plus" onclick="openImport()" aria-label="Importer un fichier JSON">📥</button>` +
      `<button type="button" class="chip ${cur === 'all' ? 'active' : ''}" aria-pressed="${cur === 'all'}" onclick="selectList('${w}','all')">Tous</button>` +
      lists.map(l => `<button type="button" class="chip ${cur === l.id ? 'active' : ''}" aria-pressed="${cur === l.id}" onclick="selectList('${w}','${l.id}')">${esc(l.name)}</button>`).join('');
  }
  const L = listById(viewList);
  document.getElementById('list-actions').innerHTML = L
    ? `<div class="list-actions"><span>${L.bases.length} verbe${L.bases.length > 1 ? 's' : ''}${L.tableaux && L.tableaux.length ? '<small>Tableaux ' + L.tableaux.join(', ') + '</small>' : ''}</span><button type="button" class="mini-btn" onclick="openListEditor('${L.id}')">✏️ Modifier</button><button type="button" class="mini-btn" onclick="deleteList('${L.id}')">🗑️ Supprimer</button></div>` : '';
}
function selectList(w, id){
  if (w === 'quiz'){ if (id === quizList) return; quizList = id; renderChips(); initQuiz(); }
  else { viewList = id; renderChips(); renderTables(); }
}
function fixSelections(){
  let quizLost = false;
  if (quizList !== 'all' && !listById(quizList)){ quizList = 'all'; quizLost = true; }
  if (viewList !== 'all' && !listById(viewList)) viewList = 'all';
  return quizLost;
}
function persistLists(){ store.set('lists', lists); renderChips(); }

let editId = null, pickSel = new Set();
function openListEditor(id){
  editId = typeof id === 'string' ? id : null;
  const l = editId && listById(editId);
  document.getElementById('le-title').textContent = l ? 'Modifier la liste' : 'Nouvelle liste';
  document.getElementById('le-name').value = l ? l.name : '';
  document.getElementById('le-search').value = '';
  document.getElementById('le-error').textContent = '';
  pickSel = new Set(l ? l.bases : []);
  renderPicker();
  document.getElementById('list-editor').showModal();
}
const updatePickCount = () => { const n = pickSel.size; document.getElementById('le-count').textContent = `${n} verbe${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}`; };
function renderPicker(){
  const q = norm(document.getElementById('le-search').value);
  document.getElementById('le-picker').innerHTML = verbsData.filter(v => !q || keys.some(k => norm(v[k]).includes(q)))
    .map(v => `<label class="pick"><input type="checkbox" value="${esc(v.base)}" ${pickSel.has(v.base) ? 'checked' : ''}><b>${esc(v.base)}</b><span>${esc(v.french)}</span></label>`).join('');
  updatePickCount();
}
document.getElementById('le-picker').addEventListener('change', e => {
  const c = e.target; if (c.type !== 'checkbox') return;
  c.checked ? pickSel.add(c.value) : pickSel.delete(c.value); updatePickCount();
});
function clearPicker(){ pickSel.clear(); renderPicker(); }
function saveList(){
  const name = document.getElementById('le-name').value.trim(), err = document.getElementById('le-error');
  if (!name){ err.textContent = 'Donne un nom à ta liste.'; return; }
  if (!pickSel.size){ err.textContent = 'Choisis au moins un verbe.'; return; }
  const bases = verbsData.filter(v => pickSel.has(v.base)).map(v => v.base);
  const existing = editId && listById(editId);
  if (existing) Object.assign(existing, { name, bases });
  else { editId = 'l' + Date.now().toString(36); lists.push({ id: editId, name, bases }); }
  persistLists();
  document.getElementById('list-editor').close();
  if (tab === 'quiz'){ quizList = ''; selectList('quiz', editId); } else selectList('list', editId);
}
function deleteList(id){
  const l = listById(id); if (!l || !confirm(`Supprimer la liste « ${l.name} » ?`)) return;
  lists = lists.filter(x => x.id !== id);
  const lost = fixSelections(); persistLists(); renderTables(); if (lost) initQuiz();
}

/* ---------- Import / export JSON ---------- */
const MAX_LISTS = 100, MAX_VERBS_PER_LIST = 500;

// Verbes ajoutés par un import : seulement ceux qui n'existent pas déjà dans la base.
let customVerbs = store.get('customVerbs', []);
customVerbs = (Array.isArray(customVerbs) ? customVerbs : [])
  .filter(c => isObj(c) && [c.base, c.preterit, c.participle, c.french].every(x => typeof x === 'string' && x));

function applyUserData(){
  for (const c of customVerbs) if (!verbsData.some(v => norm(v.base) === norm(c.base))) verbsData.push({ ...c });
  verbsData.sort((a, b) => a.base.localeCompare(b.base));
  const exist = new Set(verbsData.map(v => v.base));
  lists.forEach(l => { l.bases = l.bases.filter(b => exist.has(b)); });
}
function showMsg(title, text){
  document.getElementById('msg-title').textContent = title;
  document.getElementById('msg-text').textContent = text;
  document.getElementById('msg').showModal();
}
const cap = t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
const pick = (o, names) => { for (const n of names) if (o && o[n] != null && String(o[n]).trim()) return String(o[n]).trim().slice(0, 80); return ''; };

// Accepte le format du site (« listes ») ainsi que quelques variantes de noms de champs.
function parseImport(data){
  const arr = Array.isArray(data) ? data : (data.listes || data.lists || ((data.verbes || data.verbs) ? [data] : null));
  if (!Array.isArray(arr)) throw new Error('format');
  return arr.slice(0, MAX_LISTS).filter(isObj).map((l, i) => ({
    name: pick(l, ['title', 'titre', 'name', 'nom']) || `Liste importée ${i + 1}`,
    tableaux: Array.isArray(l.tableaux) ? l.tableaux.filter(Number.isFinite).slice(0, 30) : [],
    verbs: (Array.isArray(l.verbes) ? l.verbes : Array.isArray(l.verbs) ? l.verbs : []).slice(0, MAX_VERBS_PER_LIST).filter(isObj).map(v => ({
      base: pick(v, ['base', 'infinitif']),
      preterit: pick(v, ['preterit', 'prétérit', 'past']),
      participle: pick(v, ['participe_passe', 'participe', 'participle', 'pp']),
      french: pick(v, ['traduction', 'translation', 'french', 'francais'])
    })).filter(v => v.base)
  })).filter(l => l.verbs.length);
}

function importData(text){
  document.getElementById('settings').close();
  let parsed;
  try { parsed = parseImport(JSON.parse(text)); }
  catch { showMsg('❌ Fichier non reconnu', "Ce fichier n'est pas un JSON de listes valide."); return; }
  if (!parsed.length){ showMsg('Aucune liste trouvée', 'Le fichier ne contient aucune liste avec des verbes.'); return; }
  let added = 0, known = 0, skipped = 0, created = 0, updated = 0, refused = 0, firstId = null;
  for (const L of parsed){
    const bases = [];
    for (const v of L.verbs){
      let ex = verbsData.find(x => norm(x.base) === norm(v.base));
      if (ex) known++;   // verbe déjà sur le site : on garde NOS formes et NOTRE traduction
      else if (v.preterit && v.participle && v.french){
        ex = { base: cap(v.base), preterit: v.preterit, participle: v.participle, french: v.french };
        verbsData.push(ex); customVerbs.push({ ...ex }); added++;
      } else { skipped++; continue; }
      if (!bases.includes(ex.base)) bases.push(ex.base);
    }
    if (!bases.length) continue;
    const old = lists.find(l => norm(l.name) === norm(L.name));
    if (!old && lists.length >= MAX_LISTS){ refused++; continue; }
    if (old){ old.bases = bases; old.tableaux = L.tableaux; updated++; firstId = firstId || old.id; }
    else { const id = 'l' + Date.now().toString(36) + created; lists.push({ id, name: L.name, bases, tableaux: L.tableaux }); created++; firstId = firstId || id; }
  }
  verbsData.sort((a, b) => a.base.localeCompare(b.base));
  store.set('customVerbs', customVerbs);
  persistLists(); renderTables();
  if (firstId) selectList(tab === 'quiz' ? 'quiz' : 'list', firstId);
  const s = n => (n > 1 ? 's' : '');
  const lines = [`${created} liste${s(created)} créée${s(created)}${updated ? `, ${updated} mise${s(updated)} à jour` : ''}.`];
  if (known) lines.push('Les verbes déjà présents sur le site gardent leurs formes et leur traduction.');
  if (added) lines.push(`${added} nouveau${added > 1 ? 'x' : ''} verbe${s(added)} ajouté${s(added)} à la base.`);
  if (skipped) lines.push(`${skipped} verbe${s(skipped)} ignoré${s(skipped)} (formes ou traduction manquantes).`);
  if (refused) lines.push(`${refused} liste${s(refused)} ignorée${s(refused)} (maximum ${MAX_LISTS} listes).`);
  showMsg('✅ Import terminé', lines.join('\n'));
}
function openImport(){ document.getElementById('import-file').click(); }
document.getElementById('import-file').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (f.size > 2e6){ showMsg('Fichier trop gros', 'Le fichier dépasse 2 Mo.'); return; }
  importData(await f.text());
});
function exportLists(){
  document.getElementById('settings').close();
  if (!lists.length){ showMsg('Rien à exporter', "Tu n'as pas encore de liste."); return; }
  const data = { listes: lists.map(l => ({
    title: l.name, tableaux: l.tableaux || [],
    verbes: l.bases.map(b => verbsData.find(x => x.base === b)).filter(Boolean)
      .map(v => ({ base: v.base, preterit: v.preterit, participe_passe: v.participle, traduction: v.french }))
  })) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'verbes_irreguliers.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

applyUserData(); applySettings(); buildControls(); restoreSession(); renderChips();

/* ---------- PWA ---------- */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')){
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {});
}
