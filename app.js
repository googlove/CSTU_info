// ---------- data ----------
const scheduleLinks = [
  { emo:'📱', ttl:'Мій розклад (Play Market)', sub:'ua.edu.chdtu.deanoffice.student_mobile_cross', url:'https://play.google.com/store/apps/details?id=ua.edu.chdtu.deanoffice.student_mobile_cross' },
  { emo:'🤖', ttl:'Бот розкладу ЧДТУ', sub:'@cdu_rozklad_bot', url:'https://t.me/cdu_rozklad_bot' },
  { emo:'🖥️', ttl:'Розклад (tt.chdtu.edu.ua)', sub:'офіційна таблиця розкладу', url:'https://tt.chdtu.edu.ua/cgi-bin/timetable.cgi' },
  { emo:'🤖', ttl:'Альтернативний бот розкладу', sub:'@rozklad_bot', url:'https://t.me/rozklad_bot' },
  { emo:'🍎', ttl:'Мій розклад (App Store)', sub:'iOS застосунок', url:'https://apps.apple.com/ua/app/%D0%BC%D1%96%D0%B9-%D1%80%D0%BE%D0%B7%D0%BA%D0%BB%D0%B0%D0%B4/id1643557284' },
  { emo:'📱', ttl:'Schedule (Play Market)', sub:'ru.candysoft.schedule', url:'https://play.google.com/store/apps/details?id=ru.candysoft.schedule' },
];

const generalLinks = [
  { emo:'💬', ttl:'Чат ЧДТУ', sub:'загальний студентський чат', url:'https://t.me/cstu_chat' },
  { emo:'📰', ttl:'Канал новин ЧДТУ', sub:'офіційні новини', url:'https://t.me/chdtu' },
  { emo:'🟡', ttl:'Студентська рада — Telegram', sub:'@stud_rada_cstu', url:'https://t.me/stud_rada_cstu/' },
  { emo:'🔥', ttl:'Студентська рада — Instagram', sub:'@stud_rada_chstu', url:'https://instagram.com/stud_rada_chstu/' },
  { emo:'🧡', ttl:'ЧДТУ — офіційний Instagram', sub:'@chstu_official', url:'https://instagram.com/chstu_official/' },
  { emo:'✍️', ttl:'Записатися в Студраду', sub:'та інші можливості', url:'https://linktr.ee/sr_cstu' },
];

const facultyLinks = [
  { emo:'🖥️', ttl:'ФІТІС', sub:'Факультет інформаційних технологій та систем', url:'https://t.me/theuniverseisintheheart' },
  { emo:'🏗️', ttl:'ФГТ', sub:'Факультет гуманітарних технологій', url:'https://t.me/Brochetos' },
  { emo:'📊', ttl:'ФЕУ', sub:'Факультет економіки та управління', url:'https://t.me/artofan_lat' },
  { emo:'🔌', ttl:'ФЕТАМ', sub:'Електронні технології, автотранспорт, машинобудування', url:'https://t.me/elvinaaa_aa' },
  { emo:'🏗️', ttl:'ФТБРП', sub:'Технології, будівництво та природокористування', url:'https://t.me/NK3105nk' },
];

const gradeScale = [
  ['90–100','A','Відмінно'],
  ['82–89','B','Дуже добре'],
  ['74–81','C','Добре'],
  ['64–73','D','Задовільно'],
  ['60–63','E','Достатньо'],
  ['35–59','FX','Незадовільно, можливе повторне складання'],
  ['1–34','F','Незадовільно, обов’язкове повторне вивчення'],
];

const isoBuildings = [
  { name:'Головний корпус', ico:'🏛️', x:'50%' },
  { name:'Корпус ФІТІС', ico:'🏢', x:'20%' },
  { name:'Спортзал', ico:'🏟️', x:'78%' },
  { name:'Гуртожиток №1', ico:'🏠', x:'32%' },
  { name:'Гуртожиток №2', ico:'🏠', x:'66%' },
];

// ---------- render lists ----------
function renderList(container, items){
  container.innerHTML = items.map(i => `
    <a class="glass link-item" href="${i.url}" target="_blank" rel="noopener">
      <span class="emo">${i.emo}</span>
      <span class="txt"><div class="ttl">${i.ttl}</div><div class="sub">${i.sub}</div></span>
      <span class="chev">›</span>
    </a>`).join('');
}
renderList(document.getElementById('scheduleLinks'), scheduleLinks);
renderList(document.getElementById('generalLinks'), generalLinks);
renderList(document.getElementById('facultyLinks'), facultyLinks);

const gradeTableBody = document.getElementById('gradeTableBody');
gradeTableBody.innerHTML = gradeScale.map(([range, letter, label]) =>
  `<tr><td>${range}</td><td><strong>${letter}</strong></td><td>${label}</td></tr>`
).join('');

// ---------- iso campus ----------
const isoStage = document.getElementById('isoStage');
const isoPreview = document.getElementById('isoPreview');
isoStage.innerHTML = isoBuildings.map((b,idx) => `
  <div class="iso-building" style="left:${b.x}; transform: translateX(-50%) translateZ(${idx*6}px);">
    <span class="ico">${b.ico}</span>
    <span class="lbl">${b.name}</span>
  </div>`).join('');
isoStage.querySelectorAll('.iso-building').forEach(el => {
  el.addEventListener('click', () => window.open('https://chdtu.edu.ua/kontaktna-informatsiya/roztashuvannya','_blank'));
});

// ---------- navigation ----------
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const main = document.getElementById('main');
const burgerBtn = document.getElementById('burgerBtn');

function openSidebar(){ sidebar.classList.add('open'); overlay.classList.add('show'); main.classList.add('blurred'); burgerBtn.classList.add('open'); }
function closeSidebar(){ sidebar.classList.remove('open'); overlay.classList.remove('show'); main.classList.remove('blurred'); burgerBtn.classList.remove('open'); }
burgerBtn.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
overlay.addEventListener('click', closeSidebar);

// swipe to open from left edge
let touchStartX = null;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
document.addEventListener('touchend', e => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (touchStartX < 30 && dx > 60) openSidebar();
  if (sidebar.classList.contains('open') && dx < -60) closeSidebar();
  touchStartX = null;
}, {passive:true});

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
  closeSidebar();
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('[data-target]').forEach(el =>
  el.addEventListener('click', () => showScreen(el.dataset.target)));
document.querySelectorAll('[data-open]').forEach(el =>
  el.addEventListener('click', (e) => { e.preventDefault(); showScreen(el.dataset.open); }));

// ---------- profile photo -> white-background passport frame ----------
const photoInput = document.getElementById('photoInput');
const uploadBtn = document.getElementById('uploadBtn');
const bigAvatar = document.getElementById('bigAvatar');
const dashAvatar = document.getElementById('dashAvatar');

uploadBtn.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const W = 300, H = 400; // 3x4 ratio
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,W,H);
    const scale = Math.max(W / img.width, H / img.height);
    const w = img.width * scale, h = img.height * scale;
    ctx.drawImage(img, (W-w)/2, (H-h)/2, w, h);
    const url = canvas.toDataURL('image/png');
    bigAvatar.innerHTML = `<img src="${url}" alt="Фото 3x4">`;
    dashAvatar.innerHTML = `<img src="${url}" alt="Фото 3x4">`;
  };
  img.src = URL.createObjectURL(file);
});

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  const name = document.getElementById('inName').value.trim();
  const group = document.getElementById('inGroup').value.trim();
  const faculty = document.getElementById('inFaculty').value;
  document.getElementById('dashName').textContent = name || 'Студент ЧДТУ';
  document.getElementById('dashMeta').textContent = [group, faculty].filter(Boolean).join(' · ') || 'Група · Факультет';
  showScreen('dashboard');
});

// ---------- rating calculator ----------
const gradeList = document.getElementById('gradeList');
const addGradeBtn = document.getElementById('addGradeBtn');
const bonusInput = document.getElementById('bonusInput');
const ratingResult = document.getElementById('ratingResult');

function addGradeRow(value=''){
  const row = document.createElement('div');
  row.className = 'grade-row';
  row.innerHTML = `<input type="number" min="1" max="100" placeholder="Оцінка (1–100)" value="${value}">
                    <button aria-label="Видалити">✕</button>`;
  row.querySelector('button').addEventListener('click', () => { row.remove(); calcRating(); });
  row.querySelector('input').addEventListener('input', calcRating);
  gradeList.appendChild(row);
}
addGradeBtn.addEventListener('click', () => addGradeRow());
bonusInput.addEventListener('input', calcRating);
addGradeRow(); addGradeRow();

function calcRating(){
  const values = [...gradeList.querySelectorAll('input')]
    .map(i => parseFloat(i.value))
    .filter(v => !isNaN(v) && v > 0);
  if (values.length === 0){
    ratingResult.textContent = 'Додайте хоча б одну оцінку';
    return;
  }
  const avg = values.reduce((a,b)=>a+b,0) / values.length;
  let b = parseFloat(bonusInput.value) || 0;
  if (b > 10) b = 10;
  const R = 0.9 * avg + b;
  ratingResult.textContent = `Рейтинговий бал: R = ${R.toFixed(2)}`;
}
calcRating();

// ---------- PWA install ----------
let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});
window.addEventListener('appinstalled', () => { installBtn.hidden = true; });

if ('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
