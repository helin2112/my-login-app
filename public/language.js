// ========== SIMPLE GLOBAL LANGUAGE SYSTEM ==========

// Available languages
const languages = {
    en: { name: "English", flag: "🇬🇧" },
    am: { name: "Amharic", flag: "🇪🇹" },
    zh: { name: "Chinese", flag: "🇨🇳" },
    fr: { name: "French", flag: "🇫🇷" },
    ko: { name: "Korean", flag: "🇰🇷" },
    ru: { name: "Russian", flag: "🇷🇺" }
};

// Current language (saved in browser)
let currentLanguage = localStorage.getItem('skillbridge_language') || 'en';

// ========== TRANSLATIONS ==========
const translations = {
    // Navbar
    navHome: { en: "🏠 Home", am: "🏠 መነሻ", zh: "🏠 首页", fr: "🏠 Accueil", ko: "🏠 홈", ru: "🏠 Главная" },
    navTutorials: { en: "📚 Tutorials", am: "📚 ትምህርቶች", zh: "📚 教程", fr: "📚 Tutoriels", ko: "📚 튜토리얼", ru: "📚 Уроки" },
    navPlayground: { en: "💻 Playground", am: "💻 መለማመጃ", zh: "💻 练习场", fr: "💻 Terrain de jeu", ko: "💻 플레이그라운드", ru: "💻 Песочница" },
    navFavorites: { en: "⭐ My Favorites", am: "⭐ ተወዳጆቼ", zh: "⭐ 我的收藏", fr: "⭐ Mes Favoris", ko: "⭐ 즐겨찾기", ru: "⭐ Избранное" },
    navCommunity: { en: "💬 Community", am: "💬 ማህበረሰብ", zh: "💬 社区", fr: "💬 Communauté", ko: "💬 커뮤니티", ru: "💬 Сообщество" },
    
    // Hero Section
    heroTitle: { en: "Bridge the Coding Gap", am: "የኮድ ክፍተትን ያገናኙ", zh: "弥合编码差距", fr: "Comblez le fossé du codage", ko: "코딩 격차를 해소하세요", ru: "Преодолейте разрыв в программировании" },
    ctaButton: { en: "Start Learning Free →", am: "በነጻ መማር ጀምር →", zh: "免费开始学习 →", fr: "Commencer Gratuitement →", ko: "무료로 시작하기 →", ru: "Начать обучение бесплатно →" },
    
    // Stats
    statCourses: { en: "Courses", am: "ኮርሶች", zh: "课程", fr: "Cours", ko: "강좌", ru: "Курсы" },
    statLanguages: { en: "Languages", am: "ቋንቋዎች", zh: "语言", fr: "Langues", ko: "언어", ru: "Языки" },
    statCertified: { en: "Exams & Certificates", am: "ፈተናዎች እና ሰርተፊኬቶች", zh: "考试和证书", fr: "Examens et Certificats", ko: "시험 및 수료증", ru: "Экзамены и сертификаты" },
    
    // Featured Courses
    featuredTitle: { en: "Featured Courses", am: "የተመረጡ ኮርሶች", zh: "精选课程", fr: "Cours en Vedette", ko: "추천 강좌", ru: "Рекомендуемые курсы" },
    startBtn: { en: "Start Learning →", am: "መማር ጀምር →", zh: "开始学习 →", fr: "Commencer →", ko: "학습 시작 →", ru: "Начать обучение →" },
    
    // Tutorials Page
    tutorialsTitle: { en: "All Tutorials", am: "ሁሉም ትምህርቶች", zh: "所有教程", fr: "Tous les Tutoriels", ko: "모든 튜토리얼", ru: "Все уроки" },
    filterAll: { en: "All", am: "ሁሉም", zh: "全部", fr: "Tout", ko: "전체", ru: "Все" },
    filterFrontend: { en: "Frontend", am: "ፊት ማያ", zh: "前端", fr: "Frontend", ko: "프론트엔드", ru: "Фронтенд" },
    filterBackend: { en: "Backend", am: "ጀርባ ማያ", zh: "后端", fr: "Backend", ko: "백엔드", ru: "Бэкенд" },
    filterDatabase: { en: "Database", am: "የውሂብ ጎታ", zh: "数据库", fr: "Base de données", ko: "데이터베이스", ru: "База данных" },
    learnBtn: { en: "Learn", am: "ተማር", zh: "学习", fr: "Apprendre", ko: "배우기", ru: "Учить" },
    examBtn: { en: "Exam", am: "ፈተና", zh: "考试", fr: "Examen", ko: "시험", ru: "Экзамен" },
    
    // Favorites Page
    favoritesTitle: { en: "My Favorites", am: "ተወዳጆቼ", zh: "我的收藏", fr: "Mes Favoris", ko: "내 즐겨찾기", ru: "Мои избранные" },
    selectAll: { en: "Select All", am: "ሁሉንም ምረጥ", zh: "全选", fr: "Tout sélectionner", ko: "전체 선택", ru: "Выбрать все" },
    removeSelected: { en: "Remove Selected", am: "የተመረጡትን አስወግድ", zh: "删除选中", fr: "Supprimer", ko: "선택 삭제", ru: "Удалить" },
    viewLesson: { en: "View Lesson", am: "ትምህርቱን ተመልከት", zh: "查看课程", fr: "Voir le cours", ko: "수업 보기", ru: "Посмотреть урок" },
    remove: { en: "Remove", am: "አስወግድ", zh: "删除", fr: "Supprimer", ko: "제거", ru: "Удалить" },
    
    // Community Page
    communityTitle: { en: "Community Guestbook", am: "የማህበረሰብ እንግዳ መጽሐፍ", zh: "社区留言板", fr: "Livre d'or communautaire", ko: "커뮤니티 방명록", ru: "Гостевая книга сообщества" },
    leaveMessage: { en: "Leave a Message", am: "መልዕክት ይተው", zh: "留言", fr: "Laisser un message", ko: "메시지 남기기", ru: "Оставить сообщение" },
    postMessage: { en: "Post Message", am: "ልጥፍ", zh: "发布", fr: "Publier", ko: "게시", ru: "Опубликовать" },
    
    // Playground Page
    playgroundTitle: { en: "Code Playground & Games", am: "ኮድ መለማመጃ እና ጨዋታዎች", zh: "代码练习场和游戏", fr: "Terrain de jeu de code et jeux", ko: "코드 플레이그라운드 및 게임", ru: "Песочница кода и игры" },
    runCode: { en: "Run Code", am: "ኮዱን አሂድ", zh: "运行代码", fr: "Exécuter", ko: "코드 실행", ru: "Запустить" },
    
    // Auth
    login: { en: "Login", am: "ግባ", zh: "登录", fr: "Connexion", ko: "로그인", ru: "Войти" },
    signup: { en: "Sign Up", am: "ተመዝገብ", zh: "注册", fr: "S'inscrire", ko: "회원가입", ru: "Регистрация" },
    username: { en: "Username", am: "ስም", zh: "用户名", fr: "Nom", ko: "이름", ru: "Имя" },
    password: { en: "Password", am: "የይለፍ ቃል", zh: "密码", fr: "Mot de passe", ko: "비밀번호", ru: "Пароль" },
    createAccount: { en: "Create Account", am: "መለያ ፍጠር", zh: "创建账户", fr: "Créer un compte", ko: "계정 만들기", ru: "Создать аккаунт" }
};

// Helper function to get translation
function getTranslation(key) {
    if (translations[key] && translations[key][currentLanguage]) {
        return translations[key][currentLanguage];
    }
    return translations[key]?.en || key;
}

// Function to change language
function changeLanguage(langCode) {
    if (!languages[langCode]) return;
    
    currentLanguage = langCode;
    localStorage.setItem('skillbridge_language', currentLanguage);
    
    // Update all translatable elements
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        const translated = getTranslation(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translated;
        } else {
            el.innerHTML = translated;
        }
    });
    
    // Update floating button
    const currentLangSpan = document.getElementById('currentLangDisplay');
    if (currentLangSpan) {
        currentLangSpan.innerHTML = languages[currentLanguage].flag + ' ' + languages[currentLanguage].name;
    }
    
    // Close modal
    closeLanguageModal();
    
    // Show notification
    showMessage(`Language changed to ${languages[langCode].name}`);
}

// Show notification
function showMessage(msg) {
    const notif = document.createElement('div');
    notif.innerHTML = msg;
    notif.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #4ecdc4;
        color: #1a1a2e;
        padding: 8px 16px;
        border-radius: 50px;
        z-index: 9999;
        font-weight: bold;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

// Open language modal
function openLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) modal.style.display = 'flex';
}

function closeLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (modal) modal.style.display = 'none';
}

// Create floating language button
function addLanguageButton() {
    if (document.getElementById('floatingLangBtn')) return;
    
    const btnHTML = `
        <div class="floating-lang" id="floatingLangBtn" style="position:fixed; bottom:20px; right:20px; z-index:999;">
            <button onclick="openLanguageModal()" style="background:rgba(0,0,0,0.7); backdrop-filter:blur(10px); border:1px solid #4ecdc4; border-radius:50px; padding:8px 16px; cursor:pointer; color:white; display:flex; align-items:center; gap:8px;">
                <i class="fas fa-language"></i> <span id="currentLangDisplay">${languages[currentLanguage].flag} ${languages[currentLanguage].name}</span>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', btnHTML);
}

// Create language modal
function addLanguageModal() {
    if (document.getElementById('languageModal')) return;
    
    const modalHTML = `
        <div id="languageModal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); justify-content:center; align-items:center; z-index:1000;">
            <div style="background:#1a1a2e; padding:2rem; border-radius:20px; max-width:400px; width:90%; border:1px solid #4ecdc4;">
                <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                    <h2>🌐 Choose Language</h2>
                    <span onclick="closeLanguageModal()" style="font-size:1.5rem; cursor:pointer;">&times;</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:0.8rem;">
                    <div onclick="changeLanguage('en')" style="background:rgba(255,255,255,0.1); border-radius:50px; padding:10px; text-align:center; cursor:pointer;">🇬🇧 English</div>
                    <div onclick="changeLanguage('am')" style="background:rgba(255,255,255,0.1); border-radius:50px; padding:10px; text-align:center; cursor:pointer;">🇪🇹 አማርኛ</div>
                    <div onclick="changeLanguage('zh')" style="background:rgba(255,255,255,0.1); border-radius:50px; padding:10px; text-align:center; cursor:pointer;">🇨🇳 中文</div>
                    <div onclick="changeLanguage('fr')" style="background:rgba(255,255,255,0.1); border-radius:50px; padding:10px; text-align:center; cursor:pointer;">🇫🇷 Français</div>
                    <div onclick="changeLanguage('ko')" style="background:rgba(255,255,255,0.1); border-radius:50px; padding:10px; text-align:center; cursor:pointer;">🇰🇷 한국어</div>
                    <div onclick="changeLanguage('ru')" style="background:rgba(255,255,255,0.1); border-radius:50px; padding:10px; text-align:center; cursor:pointer;">🇷🇺 Русский</div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    addLanguageButton();
    addLanguageModal();
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        const translated = getTranslation(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translated;
        } else {
            el.innerHTML = translated;
        }
    });
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('languageModal');
        if (event.target === modal) closeLanguageModal();
    };
});