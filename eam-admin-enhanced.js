// ============================================================
// EAM TRADING — Admin Panel Enhanced v1.0
// ضع هذا الملف في نفس المجلد وأضفه في HTML قبل </body>
// <script src="eam-admin-enhanced.js"></script>
// ============================================================

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛠️ انتظر تحميل الصفحة كاملاً
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(injectAdminPanel, 800);
});

function injectAdminPanel() {
  var adminPage = document.getElementById('page-admin');
  if (!adminPage) return;

  // أضف CSS للميزات الجديدة
  var style = document.createElement('style');
  style.textContent = `
    .eam-admin-section { background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:16px; margin-top:13px; }
    .eam-admin-section h3 { font-size:14px; font-weight:700; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
    .eam-user-row { display:flex; align-items:center; gap:10px; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.04); transition:background .2s; }
    .eam-user-row:hover { background:rgba(255,215,0,.03); }
    .eam-user-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--red2)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#000; flex-shrink:0; }
    .eam-user-info { flex:1; min-width:0; }
    .eam-user-name { font-size:13px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .eam-user-email { font-size:10px; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .eam-plan-badge { font-size:9px; padding:2px 7px; border-radius:10px; font-weight:700; }
    .eam-plan-free { background:rgba(255,255,255,.08); color:var(--text2); }
    .eam-plan-pro { background:rgba(0,200,83,.15); color:var(--green); }
    .eam-plan-elite { background:rgba(255,215,0,.15); color:var(--gold); }
    .eam-plan-banned { background:rgba(255,61,61,.15); color:var(--rp); }
    .eam-trial-badge { font-size:9px; padding:2px 7px; border-radius:10px; background:rgba(100,160,255,.15); color:#64a0ff; font-weight:700; }
    .eam-actions { display:flex; gap:5px; flex-wrap:wrap; }
    .eam-btn { padding:4px 10px; border-radius:6px; font-size:10px; font-weight:700; cursor:pointer; border:none; transition:all .2s; font-family:var(--font); }
    .eam-btn-gold { background:rgba(255,215,0,.15); color:var(--gold); border:1px solid rgba(255,215,0,.3); }
    .eam-btn-gold:hover { background:rgba(255,215,0,.25); }
    .eam-btn-red { background:rgba(255,61,61,.15); color:var(--rp); border:1px solid rgba(255,61,61,.3); }
    .eam-btn-red:hover { background:rgba(255,61,61,.25); }
    .eam-btn-green { background:rgba(0,200,83,.15); color:var(--green); border:1px solid rgba(0,200,83,.3); }
    .eam-btn-green:hover { background:rgba(0,200,83,.25); }
    .eam-btn-blue { background:rgba(100,160,255,.15); color:#64a0ff; border:1px solid rgba(100,160,255,.3); }
    .eam-search { width:100%; background:var(--bg4); border:1px solid var(--border); border-radius:8px; padding:8px 12px; color:var(--text); font-family:var(--font); font-size:12px; outline:none; margin-bottom:10px; }
    .eam-search:focus { border-color:rgba(255,215,0,.4); }
    .eam-input { background:var(--bg4); border:1px solid var(--border); border-radius:8px; padding:7px 11px; color:var(--text); font-family:var(--font); font-size:12px; outline:none; }
    .eam-input:focus { border-color:rgba(255,215,0,.4); }
    .eam-modal-ov { display:none; position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:5000; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
    .eam-modal-ov.open { display:flex; }
    .eam-modal { background:var(--bg3); border:1px solid var(--border); border-radius:14px; padding:24px; width:90%; max-width:400px; }
    .eam-modal-title { font-size:16px; font-weight:700; margin-bottom:16px; color:var(--gold); }
    .eam-modal-label { font-size:11px; color:var(--text2); margin-bottom:5px; display:block; }
    .eam-modal-row { margin-bottom:12px; }
    .eam-select { width:100%; background:var(--bg4); border:1px solid var(--border); border-radius:8px; padding:8px 11px; color:var(--text); font-family:var(--font); font-size:12px; outline:none; }
    .eam-stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
    .eam-stat { background:var(--bg4); border-radius:8px; padding:10px; text-align:center; }
    .eam-stat-val { font-size:20px; font-weight:700; font-family:'Rajdhani',sans-serif; }
    .eam-stat-label { font-size:10px; color:var(--text2); margin-top:2px; }
    .eam-empty { text-align:center; padding:30px; color:var(--text2); font-size:13px; }
    .eam-filter-row { display:flex; gap:6px; margin-bottom:10px; flex-wrap:wrap; }
    .eam-filter-btn { padding:4px 11px; border-radius:20px; font-size:11px; cursor:pointer; border:1px solid var(--border); background:var(--bg4); color:var(--text2); transition:all .2s; }
    .eam-filter-btn.active { background:rgba(255,215,0,.1); color:var(--gold); border-color:rgba(255,215,0,.3); }
    .eam-contact-preview { background:var(--bg4); border-radius:8px; padding:10px 13px; font-size:12px; color:var(--text2); margin-top:8px; display:flex; align-items:center; gap:8px; }
  `;
  document.head.appendChild(style);

  // أضف الـ sections الجديدة
  buildUserManagementSection(adminPage);
  buildContactEmailSection(adminPage);
  buildTrialSection(adminPage);
  buildSiteEditorSection(adminPage);

  // Modal للـ Trial
  buildTrialModal();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👥 قسم إدارة المستخدمين المحسّن
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildUserManagementSection(parent) {
  var sec = document.createElement('div');
  sec.className = 'eam-admin-section';
  sec.id = 'eamUserSection';
  sec.innerHTML = `
    <h3>👥 إدارة المستخدمين <span id="eamUserCount" style="font-size:11px;background:rgba(255,215,0,.1);color:var(--gold);padding:2px 8px;border-radius:10px">0</span></h3>
    <div class="eam-stats-grid" id="eamUserStats">
      <div class="eam-stat"><div class="eam-stat-val" style="color:var(--text)" id="eamTotalCount">0</div><div class="eam-stat-label">إجمالي</div></div>
      <div class="eam-stat"><div class="eam-stat-val" style="color:var(--green)" id="eamActiveCount">0</div><div class="eam-stat-label">نشط</div></div>
      <div class="eam-stat"><div class="eam-stat-val" style="color:var(--rp)" id="eamBannedCount">0</div><div class="eam-stat-label">محظور</div></div>
    </div>
    <div class="eam-filter-row">
      <button class="eam-filter-btn active" onclick="eamFilterUsers('all',this)">الكل</button>
      <button class="eam-filter-btn" onclick="eamFilterUsers('free',this)">Free</button>
      <button class="eam-filter-btn" onclick="eamFilterUsers('pro',this)">Pro</button>
      <button class="eam-filter-btn" onclick="eamFilterUsers('elite',this)">Elite</button>
      <button class="eam-filter-btn" onclick="eamFilterUsers('trial',this)">Trial</button>
      <button class="eam-filter-btn" onclick="eamFilterUsers('banned',this)">محظور</button>
    </div>
    <input class="eam-search" id="eamUserSearch" placeholder="🔍 ابحث بالاسم أو الإيميل..." oninput="eamRenderUsers()">
    <div id="eamUserList"></div>
  `;
  parent.appendChild(sec);
  setTimeout(eamRenderUsers, 500);
}

var eamCurrentFilter = 'all';

function eamFilterUsers(filter, btn) {
  eamCurrentFilter = filter;
  document.querySelectorAll('.eam-filter-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  eamRenderUsers();
}

function eamRenderUsers() {
  var list = document.getElementById('eamUserList');
  if (!list) return;

  var users = typeof USERS !== 'undefined' ? Object.entries(USERS) : [];
  var search = (document.getElementById('eamUserSearch') || {}).value || '';
  search = search.toLowerCase();

  // فلترة
  var filtered = users.filter(function(entry) {
    var email = entry[0], u = entry[1];
    var matchSearch = !search || u.name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
    var plan = eamGetUserPlan(email, u);
    var matchFilter =
      eamCurrentFilter === 'all' ? true :
      eamCurrentFilter === 'banned' ? u.banned :
      eamCurrentFilter === 'trial' ? eamHasActiveTrial(email) :
      plan === eamCurrentFilter;
    return matchSearch && matchFilter;
  });

  // إحصائيات
  var total = users.length;
  var active = users.filter(function(e){ return !e[1].banned; }).length;
  var banned = users.filter(function(e){ return e[1].banned; }).length;
  var tc = document.getElementById('eamTotalCount');
  var ac = document.getElementById('eamActiveCount');
  var bc = document.getElementById('eamBannedCount');
  var uc = document.getElementById('eamUserCount');
  if(tc) tc.textContent = total;
  if(ac) ac.textContent = active;
  if(bc) bc.textContent = banned;
  if(uc) uc.textContent = total;

  if (!filtered.length) {
    list.innerHTML = '<div class="eam-empty">لا يوجد مستخدمون في هذا الفلتر</div>';
    return;
  }

  list.innerHTML = filtered.map(function(entry) {
    var email = entry[0], u = entry[1];
    if (u.role === 'admin') return '';
    var letter = (u.name || 'U').charAt(0).toUpperCase();
    var plan = eamGetUserPlan(email, u);
    var planLabel = plan === 'elite' ? '💎 Elite' : plan === 'pro' ? '⭐ Pro' : '🆓 Free';
    var planClass = 'eam-plan-' + (u.banned ? 'banned' : plan);
    var trialInfo = eamGetTrialInfo(email);
    var trialBadge = trialInfo ? '<span class="eam-trial-badge">⏱️ ' + trialInfo + '</span>' : '';
    var banBtn = u.banned
      ? '<button class="eam-btn eam-btn-green" onclick="eamToggleBan(\'' + email + '\')">رفع الحظر</button>'
      : '<button class="eam-btn eam-btn-red" onclick="eamToggleBan(\'' + email + '\')">حظر</button>';
    return `
      <div class="eam-user-row" id="eam-row-${email.replace(/[@.]/g,'_')}">
        <div class="eam-user-avatar">${letter}</div>
        <div class="eam-user-info">
          <div class="eam-user-name">${u.name || 'مستخدم'}</div>
          <div class="eam-user-email">${email}</div>
        </div>
        <span class="eam-plan-badge ${planClass}">${u.banned ? '🚫 محظور' : planLabel}</span>
        ${trialBadge}
        <div class="eam-actions">
          <button class="eam-btn eam-btn-gold" onclick="eamOpenTrialModal('${email}','${(u.name||'').replace(/'/g,'\\\'')}')" title="إعطاء وصول مجاني مؤقت">🎁 Trial</button>
          <button class="eam-btn eam-btn-blue" onclick="eamSetPlan('${email}')" title="تغيير الخطة">💎 Plan</button>
          ${banBtn}
          <button class="eam-btn eam-btn-red" onclick="eamDeleteUser('${email}')" title="حذف المستخدم">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function eamGetUserPlan(email, u) {
  if (eamHasActiveTrial(email)) return u.trialPlan || 'pro';
  return u.plan || 'free';
}

function eamHasActiveTrial(email) {
  var u = typeof USERS !== 'undefined' ? USERS[email] : null;
  if (!u || !u.trialExpiry) return false;
  return new Date(u.trialExpiry) > new Date();
}

function eamGetTrialInfo(email) {
  var u = typeof USERS !== 'undefined' ? USERS[email] : null;
  if (!u || !u.trialExpiry) return null;
  var expiry = new Date(u.trialExpiry);
  var now = new Date();
  if (expiry <= now) return null;
  var days = Math.ceil((expiry - now) / 86400000);
  return days + ' يوم متبقي';
}

function eamToggleBan(email) {
  if (typeof USERS === 'undefined' || !USERS[email]) return;
  USERS[email].banned = !USERS[email].banned;
  if (typeof saveAllUsers === 'function') saveAllUsers();
  eamRenderUsers();
  var name = USERS[email].name || email;
  showToast(USERS[email].banned ? '🚫' : '✅', USERS[email].banned ? 'تم الحظر' : 'رُفع الحظر', name);
}

function eamDeleteUser(email) {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
  if (typeof USERS !== 'undefined') {
    delete USERS[email];
    if (typeof saveAllUsers === 'function') saveAllUsers();
    eamRenderUsers();
    showToast('🗑️', 'تم الحذف', 'تم حذف المستخدم');
  }
}

function eamSetPlan(email) {
  if (typeof USERS === 'undefined' || !USERS[email]) return;
  var current = USERS[email].plan || 'free';
  var plans = ['free', 'pro', 'elite'];
  var next = plans[(plans.indexOf(current) + 1) % plans.length];
  USERS[email].plan = next;
  if (typeof saveAllUsers === 'function') saveAllUsers();
  eamRenderUsers();
  var labels = { free: '🆓 Free', pro: '⭐ Pro', elite: '💎 Elite' };
  showToast('💎', 'تم التغيير', (USERS[email].name || email) + ' → ' + labels[next]);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎁 Modal إعطاء Trial مجاني
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildTrialModal() {
  var modal = document.createElement('div');
  modal.className = 'eam-modal-ov';
  modal.id = 'eamTrialModal';
  modal.innerHTML = `
    <div class="eam-modal">
      <div class="eam-modal-title">🎁 إعطاء وصول مجاني مؤقت</div>
      <div id="eamTrialUserName" style="font-size:13px;color:var(--text2);margin-bottom:14px"></div>
      <div class="eam-modal-row">
        <label class="eam-modal-label">نوع الخطة</label>
        <select class="eam-select" id="eamTrialPlan">
          <option value="pro">⭐ Pro</option>
          <option value="elite">💎 Elite</option>
        </select>
      </div>
      <div class="eam-modal-row">
        <label class="eam-modal-label">المدة</label>
        <select class="eam-select" id="eamTrialDuration">
          <option value="1">يوم واحد</option>
          <option value="3">3 أيام</option>
          <option value="7" selected>7 أيام</option>
          <option value="14">14 يوم</option>
          <option value="30">30 يوم</option>
          <option value="60">60 يوم</option>
          <option value="90">90 يوم</option>
          <option value="365">سنة كاملة</option>
        </select>
      </div>
      <div id="eamTrialCurrentInfo" style="font-size:11px;color:var(--text2);margin-bottom:14px"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="eam-btn eam-btn-red" onclick="eamCloseTrialModal()">إلغاء</button>
        <button class="eam-btn eam-btn-gold" onclick="eamConfirmTrial()">✅ تأكيد</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

var eamTrialTargetEmail = null;

function eamOpenTrialModal(email, name) {
  eamTrialTargetEmail = email;
  var modal = document.getElementById('eamTrialModal');
  if (!modal) return;
  var nameEl = document.getElementById('eamTrialUserName');
  var infoEl = document.getElementById('eamTrialCurrentInfo');
  if (nameEl) nameEl.textContent = '👤 ' + (name || email);
  if (infoEl) {
    var info = eamGetTrialInfo(email);
    infoEl.textContent = info ? 'لديه حالياً: ' + info : 'لا يوجد trial نشط حالياً';
  }
  modal.classList.add('open');
}

function eamCloseTrialModal() {
  var modal = document.getElementById('eamTrialModal');
  if (modal) modal.classList.remove('open');
  eamTrialTargetEmail = null;
}

function eamConfirmTrial() {
  if (!eamTrialTargetEmail || typeof USERS === 'undefined' || !USERS[eamTrialTargetEmail]) return;
  var plan = document.getElementById('eamTrialPlan').value;
  var days = parseInt(document.getElementById('eamTrialDuration').value);
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  USERS[eamTrialTargetEmail].trialPlan = plan;
  USERS[eamTrialTargetEmail].trialExpiry = expiry.toISOString();
  if (typeof saveAllUsers === 'function') saveAllUsers();
  eamCloseTrialModal();
  eamRenderUsers();
  var planLabel = plan === 'elite' ? '💎 Elite' : '⭐ Pro';
  showToast('🎁', 'تم منح Trial', planLabel + ' لمدة ' + days + ' يوم');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📧 قسم إيميل التواصل
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildContactEmailSection(parent) {
  var current = localStorage.getItem('eam_contact_email') || 'support@eamtrading.com';
  var sec = document.createElement('div');
  sec.className = 'eam-admin-section';
  sec.innerHTML = `
    <h3>📧 إيميل التواصل</h3>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">هذا الإيميل يظهر للمستخدمين في صفحة الدعم والتواصل</p>
    <div style="display:flex;gap:8px;align-items:center">
      <input type="email" class="eam-input" id="eamContactEmail" placeholder="support@example.com" value="${current}" style="flex:1">
      <button class="eam-btn eam-btn-gold" style="padding:7px 14px;font-size:12px" onclick="eamSaveContactEmail()">💾 حفظ</button>
    </div>
    <div class="eam-contact-preview" id="eamContactPreview">
      <span style="font-size:14px">📧</span>
      <span>الإيميل الحالي: <strong style="color:var(--gold)">${current}</strong></span>
    </div>
  `;
  parent.appendChild(sec);
}

function eamSaveContactEmail() {
  var inp = document.getElementById('eamContactEmail');
  if (!inp || !inp.value.includes('@')) {
    showToast('⚠️', 'خطأ', 'أدخل إيميل صحيح');
    return;
  }
  var email = inp.value.trim();
  localStorage.setItem('eam_contact_email', email);
  var preview = document.getElementById('eamContactPreview');
  if (preview) preview.innerHTML = '<span style="font-size:14px">📧</span><span>الإيميل الحالي: <strong style="color:var(--gold)">' + email + '</strong></span>';
  // تحديث أي روابط mailto في الصفحة
  document.querySelectorAll('a[href^="mailto:"]').forEach(function(a) {
    a.href = 'mailto:' + email;
    if (a.textContent.includes('@')) a.textContent = email;
  });
  showToast('✅', 'تم الحفظ', 'إيميل التواصل: ' + email);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⏱️ قسم Trial سريع
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildTrialSection(parent) {
  var sec = document.createElement('div');
  sec.className = 'eam-admin-section';
  sec.innerHTML = `
    <h3>⏱️ منح Trial سريع بالإيميل</h3>
    <p style="font-size:12px;color:var(--text2);margin-bottom:12px">أدخل إيميل المستخدم مباشرة لمنحه وصولاً مؤقتاً</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <input type="email" class="eam-input" id="eamQuickTrialEmail" placeholder="email@example.com" style="flex:1;min-width:180px">
      <select class="eam-select" id="eamQuickTrialPlan" style="width:110px">
        <option value="pro">⭐ Pro</option>
        <option value="elite">💎 Elite</option>
      </select>
      <select class="eam-select" id="eamQuickTrialDays" style="width:110px">
        <option value="1">1 يوم</option>
        <option value="3">3 أيام</option>
        <option value="7" selected>7 أيام</option>
        <option value="14">14 يوم</option>
        <option value="30">30 يوم</option>
      </select>
      <button class="eam-btn eam-btn-gold" style="padding:7px 14px;font-size:12px" onclick="eamQuickTrial()">🎁 منح</button>
    </div>
  `;
  parent.appendChild(sec);
}

function eamQuickTrial() {
  var email = (document.getElementById('eamQuickTrialEmail').value || '').trim().toLowerCase();
  var plan = document.getElementById('eamQuickTrialPlan').value;
  var days = parseInt(document.getElementById('eamQuickTrialDays').value);
  if (!email || !email.includes('@')) { showToast('⚠️', 'خطأ', 'أدخل إيميل صحيح'); return; }
  if (typeof USERS === 'undefined' || !USERS[email]) { showToast('❌', 'غير موجود', 'هذا الإيميل غير مسجل في النظام'); return; }
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  USERS[email].trialPlan = plan;
  USERS[email].trialExpiry = expiry.toISOString();
  if (typeof saveAllUsers === 'function') saveAllUsers();
  eamRenderUsers();
  document.getElementById('eamQuickTrialEmail').value = '';
  var planLabel = plan === 'elite' ? '💎 Elite' : '⭐ Pro';
  showToast('🎁', 'تم!', planLabel + ' لـ ' + email + ' لمدة ' + days + ' يوم');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️ قسم تعديل محتوى الموقع
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildSiteEditorSection(parent) {
  var sec = document.createElement('div');
  sec.className = 'eam-admin-section';
  sec.innerHTML = `
    <h3>✏️ تعديل محتوى الموقع</h3>
    <p style="font-size:12px;color:var(--text2);margin-bottom:14px">غيّر النصوص والإعلانات بدون ما تلمس الكود</p>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:5px">📢 إعلان شريط التنبيه (أعلى الصفحة)</label>
      <div style="display:flex;gap:8px">
        <input type="text" class="eam-input" id="eamAnnouncementText" placeholder="اكتب إعلانك هنا..." style="flex:1"
          value="${localStorage.getItem('eam_announcement') || ''}">
        <button class="eam-btn eam-btn-gold" style="padding:7px 12px" onclick="eamSaveAnnouncement()">حفظ</button>
        <button class="eam-btn eam-btn-red" style="padding:7px 12px" onclick="eamClearAnnouncement()">مسح</button>
      </div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:5px">🏠 عنوان الصفحة الرئيسية (Hero Title)</label>
      <div style="display:flex;gap:8px">
        <input type="text" class="eam-input" id="eamHeroTitle" placeholder="Trade Smarter with AI..." style="flex:1"
          value="${localStorage.getItem('eam_hero_title') || ''}">
        <button class="eam-btn eam-btn-gold" style="padding:7px 12px" onclick="eamSaveHeroTitle()">حفظ</button>
      </div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:5px">📝 النص التعريفي (Hero Subtitle)</label>
      <div style="display:flex;gap:8px">
        <input type="text" class="eam-input" id="eamHeroSub" placeholder="Real-time signals..." style="flex:1"
          value="${localStorage.getItem('eam_hero_sub') || ''}">
        <button class="eam-btn eam-btn-gold" style="padding:7px 12px" onclick="eamSaveHeroSub()">حفظ</button>
      </div>
    </div>

    <div style="margin-bottom:12px">
      <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:5px">🔔 رسالة ترحيب للمستخدمين الجدد</label>
      <div style="display:flex;gap:8px">
        <input type="text" class="eam-input" id="eamWelcomeMsg" placeholder="مرحباً بك في EAM Trading!" style="flex:1"
          value="${localStorage.getItem('eam_welcome_msg') || ''}">
        <button class="eam-btn eam-btn-gold" style="padding:7px 12px" onclick="eamSaveWelcomeMsg()">حفظ</button>
      </div>
    </div>

    <div style="margin-bottom:4px">
      <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:5px">🔒 وضع الصيانة</label>
      <div style="display:flex;align-items:center;gap:10px">
        <div id="eamMaintenanceToggle" onclick="eamToggleMaintenance()"
          style="width:44px;height:24px;border-radius:12px;background:${localStorage.getItem('eam_maintenance')==='1'?'rgba(0,200,83,.4)':'rgba(255,255,255,.1)'};border:1px solid var(--border);position:relative;cursor:pointer;transition:background .3s">
          <div style="position:absolute;top:3px;left:${localStorage.getItem('eam_maintenance')==='1'?'23px':'3px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:left .3s"></div>
        </div>
        <span style="font-size:12px;color:var(--text2)" id="eamMaintenanceLabel">${localStorage.getItem('eam_maintenance')==='1'?'🔴 وضع الصيانة مفعّل':'⚪ وضع الصيانة معطّل'}</span>
      </div>
    </div>
  `;
  parent.appendChild(sec);
  applyEditorSavedValues();
}

function applyEditorSavedValues() {
  var heroTitle = localStorage.getItem('eam_hero_title');
  var heroSub   = localStorage.getItem('eam_hero_sub');
  var welcome   = localStorage.getItem('eam_welcome_msg');
  var ann       = localStorage.getItem('eam_announcement');

  if (heroTitle) {
    document.querySelectorAll('h1').forEach(function(h) {
      if (h.textContent.includes('Trade Smarter') || h.textContent.includes('AI')) {
        h.innerHTML = heroTitle;
      }
    });
  }

  if (ann) eamShowAnnouncementBar(ann);
}

function eamSaveAnnouncement() {
  var val = document.getElementById('eamAnnouncementText').value.trim();
  if (!val) { eamClearAnnouncement(); return; }
  localStorage.setItem('eam_announcement', val);
  eamShowAnnouncementBar(val);
  showToast('✅', 'تم', 'تم حفظ الإعلان');
}

function eamShowAnnouncementBar(text) {
  var bar = document.getElementById('eamAnnouncementBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'eamAnnouncementBar';
    bar.style.cssText = 'position:fixed;top:36px;left:0;right:0;background:linear-gradient(90deg,rgba(184,134,11,.9),rgba(255,165,0,.8));color:#000;text-align:center;padding:6px 40px;font-size:12px;font-weight:700;z-index:999;';
    var close = document.createElement('span');
    close.textContent = '✕';
    close.style.cssText = 'position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:14px';
    close.onclick = function(){ bar.style.display='none'; };
    bar.appendChild(close);
    document.body.appendChild(bar);
  }
  bar.childNodes[0].textContent = '📢 ' + text + ' ';
  bar.style.display = 'block';
}

function eamClearAnnouncement() {
  localStorage.removeItem('eam_announcement');
  var bar = document.getElementById('eamAnnouncementBar');
  if (bar) bar.style.display = 'none';
  var inp = document.getElementById('eamAnnouncementText');
  if (inp) inp.value = '';
  showToast('🗑️', 'تم المسح', 'تم إزالة الإعلان');
}

function eamSaveHeroTitle() {
  var val = document.getElementById('eamHeroTitle').value.trim();
  if (!val) return;
  localStorage.setItem('eam_hero_title', val);
  document.querySelectorAll('h1').forEach(function(h) {
    if (h.textContent.includes('Trade Smarter') || h.textContent.includes('AI-Powered')) {
      h.innerHTML = val;
    }
  });
  showToast('✅', 'تم', 'تم تحديث العنوان الرئيسي');
}

function eamSaveHeroSub() {
  var val = document.getElementById('eamHeroSub').value.trim();
  if (!val) return;
  localStorage.setItem('eam_hero_sub', val);
  showToast('✅', 'تم', 'تم حفظ النص التعريفي');
}

function eamSaveWelcomeMsg() {
  var val = document.getElementById('eamWelcomeMsg').value.trim();
  if (!val) return;
  localStorage.setItem('eam_welcome_msg', val);
  showToast('✅', 'تم', 'سيظهر هذا للمستخدمين الجدد عند تسجيلهم');
}

function eamToggleMaintenance() {
  var current = localStorage.getItem('eam_maintenance') === '1';
  var next = !current;
  localStorage.setItem('eam_maintenance', next ? '1' : '0');
  var tog = document.getElementById('eamMaintenanceToggle');
  var lbl = document.getElementById('eamMaintenanceLabel');
  if (tog) {
    tog.style.background = next ? 'rgba(0,200,83,.4)' : 'rgba(255,255,255,.1)';
    tog.querySelector('div').style.left = next ? '23px' : '3px';
  }
  if (lbl) lbl.textContent = next ? '🔴 وضع الصيانة مفعّل' : '⚪ وضع الصيانة معطّل';
  showToast(next ? '🔒' : '🔓', next ? 'وضع الصيانة' : 'الموقع متاح', next ? 'الموقع في وضع الصيانة الآن' : 'الموقع يعمل بشكل طبيعي');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 تحديث تلقائي عند فتح Admin Panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var _origShowPage = window.showPage;
window.showPage = function(id) {
  if (typeof _origShowPage === 'function') _origShowPage(id);
  if (id === 'admin') {
    setTimeout(eamRenderUsers, 200);
  }
};
