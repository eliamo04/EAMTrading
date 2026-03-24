// ============================================================
// EAM TRADING — SUPABASE SECURITY LAYER v1.0
// ضع هذا الملف قبل </body> في ملف HTML الخاص بك
// أو أضفه كـ <script src="eam-supabase-security.js"></script>
// ============================================================

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚙️  الخطوة 1: ضع بيانات Supabase الخاصة بك هنا فقط
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL  = 'https://bggcxfpuefxalnssskaa.supabase.co';   // ← غيّر هذا
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ2N4ZnB1ZWZ4YWxuc3Nza2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzQ1NjIsImV4cCI6MjA4OTc1MDU2Mn0.0TNFV6R96xu-o22K9N6A30fjtv0DFzwlwH7YmuM1NcA'; // ← غيّر هذا

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 تهيئة Supabase Client
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 AUTH FUNCTIONS — تسجيل / دخول / خروج
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * تسجيل مستخدم جديد
 * Supabase يشفّر كلمة المرور تلقائياً بـ bcrypt
 */
async function eamRegister(name, email, password) {
  if (!name || !email || !password) {
    showToast('⚠️', 'Missing', 'Please fill all fields');
    return false;
  }
  if (password.length < 8) {
    showToast('⚠️', 'Weak Password', 'Password must be at least 8 characters');
    return false;
  }

  try {
    // 1. إنشاء حساب Auth في Supabase (كلمة المرور تُشفّر تلقائياً)
    const { data, error } = await sb.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: { full_name: name, plan: 'free', role: 'user' }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        showToast('❌', 'Email Exists', 'This email is already registered. Please sign in.');
      } else {
        showToast('❌', 'Error', error.message);
      }
      return false;
    }

    // 2. حفظ بيانات الملف الشخصي في جدول profiles
    if (data.user) {
      await sb.from('profiles').upsert({
        id: data.user.id,
        email: email.toLowerCase().trim(),
        full_name: name,
        plan: 'free',
        role: 'user',
        created_at: new Date().toISOString(),
        completed_lessons: [],
        portfolio: { capital: 0, assets: [] },
        trades: [],
        journal: [],
        goals: [],
        settings: { theme: 'dark', lang: 'en', notifications: true }
      });

      // تسجيل الدخول تلقائياً بعد التسجيل
      currentUser = {
        id: data.user.id,
        email: data.user.email,
        name,
        plan: 'free',
        role: 'user'
      };

      // حفظ Session بأمان (Supabase يتولى هذا)
      eamUpdateUI();
      showToast('✅', 'Welcome!', 'Account created successfully!');
      return true;
    }

  } catch (err) {
    showToast('❌', 'Error', 'Registration failed. Please try again.');
    console.error('Register error:', err);
    return false;
  }
}

/**
 * تسجيل الدخول
 */
async function eamLogin(email, password) {
  if (!email || !password) {
    showToast('⚠️', 'Missing', 'Please enter email and password');
    return false;
  }

  try {
    const { data, error } = await sb.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password
    });

    if (error) {
      showToast('❌', 'Login Failed', 'Invalid email or password');
      return false;
    }

    // تحميل بيانات الملف الشخصي
    await eamLoadProfile(data.user.id);
    eamUpdateUI();
    showToast('✅', 'Welcome Back!', `Hello, ${currentUser.name}!`);
    return true;

  } catch (err) {
    showToast('❌', 'Error', 'Login failed. Please try again.');
    console.error('Login error:', err);
    return false;
  }
}

/**
 * تسجيل الخروج
 */
async function eamLogout() {
  await sb.auth.signOut();
  currentUser = null;
  // إظهار صفحة اللاندينج
  const landing = document.getElementById('landingPage');
  const app     = document.getElementById('appScreen');
  const auth    = document.getElementById('authScreen');
  if (landing) landing.style.display = 'block';
  if (app)     app.style.display     = 'none';
  if (auth)    auth.style.display    = 'none';
  showToast('👋', 'Signed Out', 'See you soon!');
}

/**
 * تغيير كلمة المرور
 */
async function eamChangePassword(newPassword) {
  if (!newPassword || newPassword.length < 8) {
    showToast('⚠️', 'Too Short', 'Password must be at least 8 characters');
    return false;
  }
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) {
    showToast('❌', 'Error', error.message);
    return false;
  }
  showToast('✅', 'Password Updated', 'Your password has been changed securely');
  return true;
}

/**
 * إرسال رابط إعادة تعيين كلمة المرور
 */
async function eamResetPassword(email) {
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  if (error) {
    showToast('❌', 'Error', error.message);
  } else {
    showToast('📧', 'Email Sent', 'Check your inbox for the reset link');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👤 PROFILE — تحميل وحفظ البيانات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamLoadProfile(userId) {
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return;

  currentUser = {
    id: data.id,
    email: data.email,
    name: data.full_name,
    plan: data.plan || 'free',
    role: data.role || 'user',
    bio: data.bio || '',
    level: data.trading_level || 'beginner',
    country: data.country || '',
    phone: data.phone || '',
    completed_lessons: data.completed_lessons || [],
    portfolio: data.portfolio || { capital: 0, assets: [] },
    trades: data.trades || [],
    journal: data.journal || [],
    goals: data.goals || [],
    settings: data.settings || {}
  };
}

async function eamSaveProfile(updates) {
  if (!currentUser) return;
  const { error } = await sb
    .from('profiles')
    .update({
      full_name: updates.name || currentUser.name,
      bio: updates.bio,
      trading_level: updates.level,
      country: updates.country,
      phone: updates.phone,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentUser.id);

  if (!error) {
    Object.assign(currentUser, updates);
    eamUpdateUI();
    showToast('✅', 'Profile Saved', 'Your profile has been updated');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 DATA FUNCTIONS — حفظ وتحميل البيانات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// حفظ أي حقل في جدول profiles
async function eamSaveData(field, value) {
  if (!currentUser) return;
  const { error } = await sb
    .from('profiles')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', currentUser.id);

  if (!error) currentUser[field] = value;
  return !error;
}

// تحميل حقل معين
async function eamLoadData(field) {
  if (!currentUser) return null;
  const { data } = await sb
    .from('profiles')
    .select(field)
    .eq('id', currentUser.id)
    .single();
  return data ? data[field] : null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📒 JOURNAL — يومية التداول
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamSaveJournalEntry(entry) {
  if (!currentUser) return;
  const entries = currentUser.journal || [];
  entries.unshift({ ...entry, id: Date.now() });
  return await eamSaveData('journal', entries);
}

async function eamLoadJournal() {
  return (await eamLoadData('journal')) || [];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📚 COURSE PROGRESS — تقدم الدروس
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamMarkLessonComplete(lessonId) {
  if (!currentUser) return;
  const done = currentUser.completed_lessons || [];
  if (!done.includes(lessonId)) {
    done.push(lessonId);
    await eamSaveData('completed_lessons', done);
  }
}

async function eamGetCompletedLessons() {
  return (await eamLoadData('completed_lessons')) || [];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💼 PORTFOLIO — المحفظة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamSavePortfolio(portfolioData) {
  return await eamSaveData('portfolio', portfolioData);
}

async function eamLoadPortfolio() {
  return (await eamLoadData('portfolio')) || { capital: 0, assets: [] };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏆 GOALS — الأهداف
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamSaveGoals(goals) {
  return await eamSaveData('goals', goals);
}

async function eamLoadGoals() {
  return (await eamLoadData('goals')) || [];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ⚙️ SETTINGS — الإعدادات
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamSaveSettings(settingsObj) {
  return await eamSaveData('settings', settingsObj);
}

async function eamLoadSettings() {
  return (await eamLoadData('settings')) || {};
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡️ SESSION — استعادة الجلسة عند إعادة التحميل
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function eamRestoreSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session && session.user) {
    await eamLoadProfile(session.user.id);
    return true;
  }
  return false;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 مراقبة حالة Auth تلقائياً
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

sb.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    await eamLoadProfile(session.user.id);
    // إظهار التطبيق
    const landing = document.getElementById('landingPage');
    const auth    = document.getElementById('authScreen');
    const app     = document.getElementById('appScreen');
    if (landing) landing.style.display = 'none';
    if (auth)    auth.style.display    = 'none';
    if (app) {
      app.style.display = 'block';
      if (typeof startApp === 'function') startApp();
    }
    eamUpdateUI();
  }

  if (event === 'SIGNED_OUT') {
    currentUser = null;
    const landing = document.getElementById('landingPage');
    const app     = document.getElementById('appScreen');
    if (landing) landing.style.display = 'block';
    if (app)     app.style.display     = 'none';
  }

  if (event === 'PASSWORD_RECOVERY') {
    showToast('🔑', 'Reset Password', 'Please set your new password');
    // يمكنك فتح مودال تغيير الكلمة هنا
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 تحديث واجهة المستخدم
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function eamUpdateUI() {
  if (!currentUser) return;
  const name   = currentUser.name || 'User';
  const plan   = currentUser.plan || 'free';
  const role   = currentUser.role || 'user';
  const letter = name.charAt(0).toUpperCase();

  // تحديث الـ sidebar
  const uName   = document.getElementById('uName');
  const uAvatar = document.getElementById('uAvatar');
  const uLevel  = document.getElementById('uLevel');
  if (uName)   uName.textContent   = name;
  if (uAvatar) uAvatar.textContent = letter;
  if (uLevel) {
    if (role === 'admin') uLevel.textContent = '👑 Admin';
    else if (plan === 'elite') uLevel.textContent = '💎 Elite';
    else if (plan === 'pro')   uLevel.textContent = '⭐ Pro';
    else uLevel.textContent = '🆓 Free';
  }

  // تحديث صفحة الملف الشخصي
  const pName  = document.getElementById('profileNameLarge');
  const pEmail = document.getElementById('profileEmailDisplay');
  const pBadge = document.getElementById('profilePlanBadge');
  if (pName)  pName.textContent  = name;
  if (pEmail) pEmail.textContent = currentUser.email || '';
  if (pBadge) {
    if (role === 'admin' || plan === 'elite') {
      pBadge.innerHTML = role === 'admin' ? '👑 Admin — Full Elite Access' : '💎 Elite Plan';
      pBadge.style.background = 'rgba(255,215,0,0.15)';
    } else if (plan === 'pro') {
      pBadge.innerHTML = '⭐ Pro Plan';
      pBadge.style.background = 'rgba(0,200,83,0.1)';
    } else {
      pBadge.innerHTML = '🆓 Free Plan';
    }
  }

  // Admin nav item
  const adminNav = document.getElementById('adminNavItem');
  if (adminNav) {
    adminNav.style.display = (role === 'admin') ? 'flex' : 'none';
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 ربط الأزرار الموجودة في HTML بالنظام الجديد
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// استبدال دالة التسجيل القديمة
window.handleRegister = async function() {
  const name  = document.getElementById('regName')?.value?.trim();
  const email = document.getElementById('regEmail')?.value?.trim();
  const pass  = document.getElementById('regPass')?.value;
  const btn   = document.getElementById('registerBtn');

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Creating...'; }
  const ok = await eamRegister(name, email, pass);
  if (btn) { btn.disabled = false; btn.textContent = '🚀 Create Account'; }

  if (ok) {
    // الـ onAuthStateChange هيتولى إخفاء auth وإظهار التطبيق
  }
};

// استبدال دالة تسجيل الدخول القديمة
window.handleLogin = async function() {
  const email = document.getElementById('loginEmail')?.value?.trim();
  const pass  = document.getElementById('loginPass')?.value;
  const btn   = document.getElementById('loginBtn');

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Signing in...'; }
  const ok = await eamLogin(email, pass);
  if (btn) { btn.disabled = false; btn.textContent = '🔑 Sign In'; }
};

// استبدال دالة تسجيل الخروج
window.logout = eamLogout;
window.signOut = eamLogout;

// استبدال حفظ الملف الشخصي
window.saveProfile = async function() {
  const name    = document.getElementById('profileEditName')?.value?.trim();
  const bio     = document.getElementById('profileEditBio')?.value?.trim();
  const level   = document.getElementById('profileEditLevel')?.value;
  const phone   = document.getElementById('profileEditPhone')?.value?.trim();
  const country = document.getElementById('profileEditCountry')?.value;

  if (!name) { showToast('⚠️', 'Missing', 'Please enter your full name'); return; }
  await eamSaveProfile({ name, bio, level, phone, country });
};

// استبدال تغيير كلمة المرور
window.changeProfilePassword = async function() {
  const newPass  = document.getElementById('profileNewPass')?.value;
  const confPass = document.getElementById('profileConfPass')?.value;

  if (!newPass || !confPass) { showToast('⚠️', 'Missing', 'Please fill password fields'); return; }
  if (newPass !== confPass)  { showToast('❌', 'Mismatch', 'Passwords do not match'); return; }
  await eamChangePassword(newPass);
};

// استبدال حفظ Journal
window.saveJournalEntry = async function() {
  const pair    = document.getElementById('jPair')?.value?.trim();
  const date    = document.getElementById('jDate')?.value;
  const dir     = document.getElementById('jDir')?.value;
  const outcome = document.getElementById('jOutcome')?.value;
  const entry   = parseFloat(document.getElementById('jEntry')?.value)  || 0;
  const exit_   = parseFloat(document.getElementById('jExit')?.value)   || 0;
  const size    = parseFloat(document.getElementById('jSize')?.value)   || 0;
  const pnl     = parseFloat(document.getElementById('jPnl')?.value)    || 0;
  const setup   = document.getElementById('jSetup')?.value?.trim();
  const mood    = parseInt(document.getElementById('jMood')?.value)     || 7;
  const right   = document.getElementById('jRight')?.value?.trim();
  const improve = document.getElementById('jImprove')?.value?.trim();

  if (!pair) { showToast('⚠️', 'Missing Info', 'Please enter the asset/pair'); return; }

  await eamSaveJournalEntry({ pair, date, dir, outcome, entry, exit: exit_, size, pnl, setup, mood, right, improve });

  // تحديث القائمة المحلية وإعادة الرسم
  if (typeof journalEntries !== 'undefined') {
    const newEntry = { id: Date.now(), pair, date, dir, outcome, entry, exit: exit_, size, pnl, setup, mood, right, improve };
    journalEntries.unshift(newEntry);
    if (typeof closeJournalForm  === 'function') closeJournalForm();
    if (typeof renderJournalEntries === 'function') renderJournalEntries();
    if (typeof updateJournalStats   === 'function') updateJournalStats();
  }

  showToast('📒', 'Entry Saved', 'Journal entry saved to cloud! +20 pts');
  ['jPair','jEntry','jExit','jSize','jPnl','jSetup','jRight','jImprove'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
};

// استبدال حفظ الإعدادات
window.saveSettings = async function() {
  if (!currentUser) return;
  const settings = {};
  const bio     = document.getElementById('sBio');
  const level   = document.getElementById('sLevel');
  const theme   = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  const lang    = document.getElementById('langSelect')?.value || 'en';

  if (bio)   settings.bio   = bio.value;
  if (level) settings.level = level.value;
  settings.theme = theme;
  settings.lang  = lang;

  await eamSaveSettings(settings);
  showToast('✅', 'Settings Saved', 'Your preferences have been saved to cloud');
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 INIT — تشغيل النظام عند تحميل الصفحة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

(async function initEAMSecurity() {
  console.log('🔐 EAM Security Layer — Initializing...');

  // محاولة استعادة الجلسة السابقة
  const hasSession = await eamRestoreSession();

  if (hasSession) {
    // إخفاء صفحة اللاندينج وإظهار التطبيق
    const landing = document.getElementById('landingPage');
    const auth    = document.getElementById('authScreen');
    const app     = document.getElementById('appScreen');
    if (landing) landing.style.display = 'none';
    if (auth)    auth.style.display    = 'none';
    if (app) {
      app.style.display = 'block';
      if (typeof startApp === 'function') setTimeout(startApp, 100);
      if (typeof initAllFeatures === 'function') setTimeout(initAllFeatures, 300);
      if (typeof initNewFeatures === 'function') setTimeout(initNewFeatures, 500);
    }
    eamUpdateUI();
    console.log('✅ Session restored for:', currentUser?.email);
  } else {
    console.log('ℹ️ No active session — showing landing page');
  }

})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡️ حماية إضافية — منع عرض localStorage في Console
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function secureConsole() {
  // منع الـ USERS object القديم من الظهور
  if (typeof window.USERS !== 'undefined') {
    delete window.USERS;
  }
  // حذف كلمات المرور القديمة من localStorage
  const keys = Object.keys(localStorage);
  keys.forEach(k => {
    if (k === 'eam_users_db' || k === 'eam_session') {
      localStorage.removeItem(k);
    }
  });
})();
