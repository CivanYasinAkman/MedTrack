// --- AUTH (GİRİŞ/KAYIT) FONKSİYONLARI ---
function showAuthScreen() {
  document.getElementById('authSection').classList.remove('hidden');
  document.querySelector('main').classList.add('hidden');
  document.getElementById('userInfo').classList.add('hidden');
}

async function showApp(username) {
  document.getElementById('authSection').classList.add('hidden');
  document.querySelector('main').classList.remove('hidden');
  document.getElementById('userInfo').classList.remove('hidden');
  document.getElementById('usernameDisplay').textContent = `👤 ${username}`;

  await loadCategories();
  await loadMedicines();
  setupEventListeners();
  startReminderChecker();

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function setupAuthListeners() {
  let isLoginMode = true;

  document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;
    const errBox = document.getElementById('authError');

    if (!username || !password) {
      errBox.textContent = 'Kullanıcı adı ve şifre gerekli';
      errBox.classList.remove('hidden');
      return;
    }

    if (isLoginMode) {
      const result = await apiLogin(username, password);
      if (result.ok) {
        errBox.classList.add('hidden');
        showApp(result.data.username);
      } else {
        errBox.textContent = result.data.error || 'Giriş başarısız';
        errBox.classList.remove('hidden');
      }
    } else {
      const result = await apiRegister(username, password);
      if (result.ok) {
        errBox.classList.add('hidden');
        // Kayıt sonrası otomatik giriş yap
        const loginResult = await apiLogin(username, password);
        if (loginResult.ok) showApp(loginResult.data.username);
      } else {
        errBox.textContent = result.data.error || 'Kayıt başarısız';
        errBox.classList.remove('hidden');
      }
    }
  });

 document.getElementById('switchAuthBtn').addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').textContent = isLoginMode ? 'Giriş Yap' : 'Kayıt Ol';
    document.getElementById('loginBtn').textContent = isLoginMode ? 'Giriş Yap' : 'Kayıt Ol';
    
    // İŞTE EKLENEN YENİ SATIR BURASI: Alttaki küçük butonun yazısını değiştirir
    document.getElementById('switchAuthBtn').textContent = isLoginMode ? 'Kayıt Ol' : 'Zaten hesabım var, Giriş Yap';
    
    document.getElementById('authError').classList.add('hidden');
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await apiLogout();
    showAuthScreen();
  });
}

function startReminderChecker() {
  setInterval(checkReminders, 15000);
}
// ----------------------------------------------------

const searchInput            = document.getElementById('searchInput');
const showFormBtn            = document.getElementById('showFormBtn');
const formSection            = document.getElementById('formSection');
const formTitle              = document.getElementById('formTitle');
const medicineForm           = document.getElementById('medicineForm');
const cancelBtn              = document.getElementById('cancelBtn');
const medicineList           = document.getElementById('medicineList');
const logModal               = document.getElementById('logModal');
const logList                = document.getElementById('logList');
const closeModal             = document.getElementById('closeModal');
const modalTitle             = document.getElementById('modalTitle');
const reminderAlert          = document.getElementById('reminderAlert');
const frequencySelect        = document.getElementById('frequency');
const reminderTimesContainer = document.getElementById('reminderTimesContainer');

const FREQUENCY_COUNT = { 'Günde 1 kez': 1, 'Günde 2 kez': 2, 'Günde 3 kez': 3 };

// --- DOMContentLoaded BLOĞU ---
document.addEventListener('DOMContentLoaded', async () => {
  // Önce oturum açık mı kontrol et
  const user = await getMe();
  if (user) {
    showApp(user.username);
  } else {
    showAuthScreen();
  }
  setupAuthListeners();
});

function setupEventListeners() {
  showFormBtn.addEventListener('click', () => showForm());
  cancelBtn.addEventListener('click', hideForm);
  medicineForm.addEventListener('submit', handleFormSubmit);
  closeModal.addEventListener('click', () => logModal.classList.add('hidden'));
  frequencySelect.addEventListener('change', () => renderReminderTimeInputs(frequencySelect.value));
}

function renderReminderTimeInputs(frequency, existingTimes = []) {
  reminderTimesContainer.innerHTML = '';
  const count = FREQUENCY_COUNT[frequency] || 0;
  for (let i = 0; i < count; i++) {
    const label = document.createElement('label');
    label.className = 'reminder-time-group';
    // BURASI ARTIK STANDART 24 SAAT FORMATI
    label.innerHTML = `${i + 1}. Hatırlatma Saati * <input type="time" class="reminderTimeInput" value="${existingTimes[i] || ''}" required />`;
    reminderTimesContainer.appendChild(label);
  }
}

function getReminderTimeValues() {
  return Array.from(document.querySelectorAll('.reminderTimeInput')).map(i => i.value).filter(t => t !== "");
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('medicineId').value;
  const data = {
    medicineName: document.getElementById('medicineName').value,
    dosage: document.getElementById('dosage').value,
    stockAmount: Number(document.getElementById('stockAmount').value),
    expirationDate: document.getElementById('expirationDate').value,
    categoryId: document.getElementById('categoryId').value || null,
    frequency: frequencySelect.value || null,
    reminderTimes: getReminderTimeValues(),
    isActive: 1,
  };

  const res = id ? await updateMedicine(id, data) : await createMedicine(data);
  if (res.ok) {
    hideForm();
    await loadMedicines();
  } else {
    alert("Kayıt sırasında hata oluştu!");
  }
}

function createMedicineCard(med) {
  const card = document.createElement('div');
  card.className = 'medicine-card';
  
  // --- GÖRSEL UYARI HESAPLAMALARI ---
  const today = new Date();
  const expDateObj = new Date(med.expirationDate);
  const diffDays = Math.ceil((expDateObj - today) / (1000 * 60 * 60 * 24));
  
  let dateStatus = '';
  if (diffDays < 0) dateStatus = '<span style="color:red; font-weight:bold;"> (GEÇMİŞ!)</span>';
  else if (diffDays <= 7) dateStatus = '<span style="color:orange; font-weight:bold;"> (AZ KALDI!)</span>';

  let stockStatus = '';
  if (med.stockAmount <= 0) stockStatus = '<span style="color:red; font-weight:bold;"> (BİTTİ!)</span>';
  else if (med.stockAmount <= 5) stockStatus = '<span style="color:orange; font-weight:bold;"> (KRİTİK!)</span>';
  // ---------------------------------

  const expDateStr = med.expirationDate ? med.expirationDate.split('T')[0] : '-';
  let times = []; try { times = typeof med.reminderTimes === 'string' ? JSON.parse(med.reminderTimes) : (med.reminderTimes || []); } catch(e) { times = []; }

  card.innerHTML = `
    <div class="card-info">
      <h3>${med.medicineName}</h3>
      <p>Dosage: ${med.dosage}</p>
      <p>Stock: <strong>${med.stockAmount}</strong> ${stockStatus}</p>
      <p>Expires: ${expDateStr} ${dateStatus}</p>
      <p>Category: ${med.categoryName || '-'}</p>
      <p class="reminder-times">🔔 ${med.frequency || ''}: ${times.join(', ')}</p>
    </div>
    <div class="card-actions">
      <button class="btn-dose" onclick="handleLogDose(${med.id})">✓ Take Dose</button>
      <button class="btn-edit" onclick="handleEdit(${med.id})">Edit</button>
      <button class="btn-logs" onclick="handleViewLogs(${med.id}, '${med.medicineName}')">History</button>
      <button class="btn-delete" onclick="handleDelete(${med.id})">Delete</button>
    </div>
  `;
  return card;
}

const alertedThisMinute = new Set();
async function checkReminders() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${h}:${m}`;
  const totalMins = now.getHours() * 60 + now.getMinutes();

  try {
    const medicines = await fetchMedicines();
    medicines.forEach(med => {
      if (!med.reminderTimes) return;
      const rawData = JSON.stringify(med.reminderTimes);
      const timesFound = rawData.match(/\d{1,2}:\d{2}/g); 
      if (timesFound) {
        timesFound.forEach(timeStr => {
          const [dbH, dbM] = timeStr.split(':').map(Number);
          if ((dbH * 60 + dbM) === totalMins) {
            const key = `${med.id}-${totalMins}`;
            if (!alertedThisMinute.has(key)) {
              showReminderAlert([{ name: med.medicineName, dosage: med.dosage, time: timeStr }]);
              alertedThisMinute.add(key);
            }
          }
        });
      }
    });
  } catch (err) { console.error(err); }
}

function showReminderAlert(due) {
  if (!reminderAlert) return;
  const content = due.map(d => `<p>${d.name} (${d.dosage}) - ${d.time}</p>`).join('');
  reminderAlert.innerHTML = `<strong>🔔 İLAÇ VAKTİ!</strong> ${content} 
    <button onclick="closeAlert()" style="margin-top:10px; cursor:pointer;">Kapat</button>`;
  
  reminderAlert.style.display = "block";
  reminderAlert.classList.remove('hidden');

  if ('Notification' in window && Notification.permission === 'granted') {
    due.forEach(d => new Notification('MedTrack', { body: `${d.name} vakti geldi!` }));
  }
}

window.closeAlert = () => { reminderAlert.style.display = "none"; reminderAlert.classList.add('hidden'); };

async function loadMedicines(search = '') {
  const medicines = await fetchMedicines(search);
  renderMedicineList(medicines);
}

async function loadCategories() {
  const categories = await fetchCategories();
  const select = document.getElementById('categoryId');
  if (!select) return;
  select.innerHTML = '<option value="">Select Category</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.categoryName;
    select.appendChild(option);
  });
}

function renderMedicineList(medicines) {
  if (!medicineList) return;
  medicineList.innerHTML = '';
  medicines.forEach(med => medicineList.appendChild(createMedicineCard(med)));
}

function showForm(medicine = null) {
  formSection.classList.remove('hidden');
  if (medicine) {
    formTitle.textContent = 'Edit Medicine';
    document.getElementById('medicineId').value = medicine.id;
    document.getElementById('medicineName').value = medicine.medicineName;
    document.getElementById('dosage').value = medicine.dosage;
    document.getElementById('stockAmount').value = medicine.stockAmount;
    document.getElementById('expirationDate').value = medicine.expirationDate.split('T')[0];
    document.getElementById('categoryId').value = medicine.categoryId || '';
    frequencySelect.value = medicine.frequency || '';
    let t = []; try { t = typeof medicine.reminderTimes === 'string' ? JSON.parse(medicine.reminderTimes) : medicine.reminderTimes; } catch(e) { t = []; }
    renderReminderTimeInputs(medicine.frequency || '', t);
  } else {
    formTitle.textContent = 'Add New Medicine';
    medicineForm.reset();
    document.getElementById('medicineId').value = '';
    reminderTimesContainer.innerHTML = '';
  }
}

function hideForm() { formSection.classList.add('hidden'); }
async function handleEdit(id) { const med = await fetchMedicineById(id); showForm(med); }
async function handleDelete(id) { if (confirm('Silinsin mi?')) { await deleteMedicine(id); await loadMedicines(); } }
async function handleLogDose(id) { await logDose(id); await loadMedicines(); }
async function handleViewLogs(id, name) { 
  modalTitle.textContent = `History – ${name}`;
  logModal.classList.remove('hidden');
  const logs = await fetchDoseLogs(id);
  logList.innerHTML = logs.length ? logs.map(l => `<li>${new Date(l.takenAt).toLocaleString()}</li>`).join('') : '<li>No logs</li>';
}