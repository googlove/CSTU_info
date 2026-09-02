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

// Real coordinates in Cherkasy (geocoded)
const campusLocations = [
  { id:'c1',  name:'Корпуси №1, 2, 3, 4', address:'бул. Шевченка, 460',  ico:'🏛️', lat:49.421341, lng:32.098555 },
  { id:'c67', name:'Корпуси №6, 7',        address:'вул. Добровольського, 5', ico:'🏢', lat:49.419991, lng:32.103173 },
  { id:'c10', name:'Корпус №10',           address:'бульв. Шевченка, 333', ico:'🏢', lat:49.429668, lng:32.087203 },
  { id:'d1',  name:'Гуртожиток №1',        address:'вул. Кобзарська, 58', ico:'🏠', lat:49.420480, lng:32.097834 },
  { id:'d2',  name:'Гуртожиток №2',        address:'вул. Чехова, 42',    ico:'🏠', lat:49.422439, lng:32.095587 },
  { id:'d3',  name:'Гуртожиток №3',        address:'вул. Смілянська, 97/1', ico:'🏠', lat:49.428302, lng:32.048262 },
  { id:'d4',  name:'Гуртожиток №4',        address:'бульв. Шевченка, 333', ico:'🏠', lat:49.429668, lng:32.087203 },
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

// ---------- real campus map (Leaflet / OpenStreetMap) ----------
let campusMap = null;
const campusMarkers = {};

function initCampusMap(){
  if (campusMap || !window.L) return;
  campusMap = L.map('campusMap', { zoomControl: true }).setView([49.4235, 32.0900], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(campusMap);

  campusLocations.forEach(b => {
    const marker = L.marker([b.lat, b.lng]).addTo(campusMap)
      .bindPopup(`<strong>${b.name}</strong><br>${b.address}`);
    campusMarkers[b.id] = marker;
  });
}

// Build address list with route buttons
const buildingList = document.getElementById('buildingList');
buildingList.innerHTML = campusLocations.map(b => `
  <div class="glass building-item" data-id="${b.id}">
    <div class="building-head">
      <span class="emo">${b.ico}</span>
      <div>
        <div class="ttl">${b.name}</div>
        <div class="sub">${b.address}</div>
      </div>
    </div>
    <div class="building-actions">
      <button data-lat="${b.lat}" data-lng="${b.lng}" data-mode="transit">🚌 Автобусом</button>
      <button data-lat="${b.lat}" data-lng="${b.lng}" data-mode="walking">🚶 Пішки</button>
      <button data-lat="${b.lat}" data-lng="${b.lng}" data-mode="driving">🚗 На авто</button>
    </div>
  </div>`).join('');

function openDirections(lat, lng, mode){
  const dest = `${lat},${lng}`;
  const go = (origin) => {
    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${mode}`
      : `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=${mode}`;
    window.open(url, '_blank');
  };
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      (pos) => go(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => go(null),
      { timeout: 4000 }
    );
  } else {
    go(null);
  }
}

buildingList.querySelectorAll('.building-item').forEach(el => {
  el.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const b = campusLocations.find(x => x.id === el.dataset.id);
    if (!b) return;
    initCampusMap();
    campusMap.flyTo([b.lat, b.lng], 17, { duration: 0.8 });
    campusMarkers[b.id].openPopup();
  });
});

buildingList.querySelectorAll('.building-actions button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDirections(btn.dataset.lat, btn.dataset.lng, btn.dataset.mode);
  });
});

// Fullscreen toggle for the map
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', () => {
  const el = document.getElementById('campusMap');
  const requestFs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if (!document.fullscreenElement){
    requestFs && requestFs.call(el);
  } else {
    exitFs && exitFs.call(document);
  }
});
['fullscreenchange','webkitfullscreenchange'].forEach(evt =>
  document.addEventListener(evt, () => {
    if (campusMap) setTimeout(() => campusMap.invalidateSize(), 200);
  })
);

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
  if (id === 'campus'){
    initCampusMap();
    setTimeout(() => campusMap && campusMap.invalidateSize(), 250);
  }
}
document.querySelectorAll('[data-target]').forEach(el =>
  el.addEventListener('click', () => showScreen(el.dataset.target)));
document.querySelectorAll('[data-open]').forEach(el =>
  el.addEventListener('click', (e) => { e.preventDefault(); showScreen(el.dataset.open); }));

// ---------- profile: persistence (localStorage) ----------
const PROFILE_KEY = 'cdtu_hub_profile_v1';
const photoInput = document.getElementById('photoInput');
const uploadBtn = document.getElementById('uploadBtn');
const bigAvatar = document.getElementById('bigAvatar');
const dashAvatar = document.getElementById('dashAvatar');
const photoStatus = document.getElementById('photoStatus');
const dashNameEl = document.getElementById('dashName');
const dashMetaEl = document.getElementById('dashMeta');
const inName = document.getElementById('inName');
const inGroup = document.getElementById('inGroup');
const inFaculty = document.getElementById('inFaculty');

function readProfile(){
  try{ return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); }
  catch(e){ return {}; }
}

function renderProfile(p){
  if (p.name) inName.value = p.name;
  if (p.group) inGroup.value = p.group;
  if (p.faculty) inFaculty.value = p.faculty;
  dashNameEl.textContent = p.name || 'Додайте своє фото';
  dashMetaEl.textContent = [p.group, p.faculty].filter(Boolean).join(' · ') || 'Група · Факультет';
  if (p.photo){
    bigAvatar.innerHTML = `<img src="${p.photo}" alt="Фото 3x4">`;
    dashAvatar.innerHTML = `<img src="${p.photo}" alt="Фото 3x4">`;
  }
}

function saveProfile(photoDataUrl){
  const existing = readProfile();
  const profile = {
    name: inName.value.trim(),
    group: inGroup.value.trim(),
    faculty: inFaculty.value,
    photo: photoDataUrl !== undefined ? photoDataUrl : existing.photo,
  };
  try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
  catch(e){ console.warn('Не вдалося зберегти профіль локально', e); }
  return profile;
}

renderProfile(readProfile());

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  const p = saveProfile();
  renderProfile(p);
  showScreen('dashboard');
});

// ---------- profile photo: AI background removal (client-side, TensorFlow.js BodyPix) ----------
let bodyPixNet = null;
let bodyPixLoadingPromise = null;

function loadScriptOnce(src){
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Не вдалося завантажити ' + src));
    document.head.appendChild(s);
  });
}

async function ensureBodyPixModel(){
  if (bodyPixNet) return bodyPixNet;
  if (!bodyPixLoadingPromise){
    bodyPixLoadingPromise = (async () => {
      if (!window.tf){
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js');
      }
      if (!window.bodyPix){
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.2.0/dist/body-pix.min.js');
      }
      bodyPixNet = await bodyPix.load({ architecture: 'MobileNetV1', outputStride: 16, multiplier: 0.75, quantBytes: 2 });
      return bodyPixNet;
    })();
  }
  return bodyPixLoadingPromise;
}

// Returns a canvas the size of the source image with background pixels made transparent
async function cutOutPerson(img){
  const net = await ensureBodyPixModel();
  const segmentation = await net.segmentPerson(img, {
    internalResolution: 'medium',
    segmentationThreshold: 0.7,
  });
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = frame.data;
  for (let i = 0; i < segmentation.data.length; i++){
    if (segmentation.data[i] === 0) px[i * 4 + 3] = 0; // transparent background pixel
  }
  ctx.putImageData(frame, 0, 0);
  return canvas;
}

// Composites a source image/canvas centered & cropped onto a solid white 3x4 canvas
function composeOnWhite(source, W = 300, H = 400){
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  const sw = source.naturalWidth || source.width;
  const sh = source.naturalHeight || source.height;
  const scale = Math.max(W / sw, H / sh);
  const w = sw * scale, h = sh * scale;
  ctx.drawImage(source, (W - w) / 2, (H - h) / 2, w, h);
  return canvas;
}

function setPhotoStatus(text){
  if (!text){ photoStatus.hidden = true; return; }
  photoStatus.textContent = text;
  photoStatus.hidden = false;
}

uploadBtn.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = async () => {
    uploadBtn.disabled = true;
    setPhotoStatus('🧠 ШІ вирізає фон — секунду…');
    try{
      const cutout = await cutOutPerson(img);
      const finalCanvas = composeOnWhite(cutout);
      const url = finalCanvas.toDataURL('image/png');
      bigAvatar.innerHTML = `<img src="${url}" alt="Фото 3x4">`;
      dashAvatar.innerHTML = `<img src="${url}" alt="Фото 3x4">`;
      saveProfile(url);
      setPhotoStatus('✅ Фон замінено на білий і збережено');
    }catch(err){
      console.warn('ШІ-вирізання фону не вдалося, фото додано без нього', err);
      const finalCanvas = composeOnWhite(img);
      const url = finalCanvas.toDataURL('image/png');
      bigAvatar.innerHTML = `<img src="${url}" alt="Фото 3x4">`;
      dashAvatar.innerHTML = `<img src="${url}" alt="Фото 3x4">`;
      saveProfile(url);
      setPhotoStatus('⚠️ Немає з’єднання з ШІ-модулем — фото збережено на білому фоні без автоматичного вирізання.');
    }finally{
      uploadBtn.disabled = false;
      setTimeout(() => setPhotoStatus(null), 5000);
    }
  };
  img.src = URL.createObjectURL(file);
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
