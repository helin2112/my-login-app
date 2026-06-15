// ========================================
// SkillBridge - Authentication System
// ========================================

// Global variables
let currentUserId = localStorage.getItem('skillbridge_userId') || null;
let currentUsername = localStorage.getItem('skillbridge_username') || null;

// ============ AUTH UI FUNCTIONS ============

// Show login/signup modal
function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        showLoginForm(); // Default to login form
    }
}

// Close auth modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show login form
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector('.auth-tab').classList.add('active');
}

// Show register form
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

function initAuthModal() {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const loginTab = document.querySelector('.auth-tab.login');
    const registerTab = document.querySelector('.auth-tab.register');
    const closeButtons = document.querySelectorAll('.close-modal');

    if (loginButton) loginButton.addEventListener('click', login);
    if (registerButton) registerButton.addEventListener('click', signup);
    if (loginTab) loginTab.addEventListener('click', showLoginForm);
    if (registerTab) registerTab.addEventListener('click', showRegisterForm);
    closeButtons.forEach(btn => btn.addEventListener('click', closeAuthModal));
}

// ============ LOGIN FUNCTION ============
async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showNotification('Please enter username and password', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUserId = data.userId;
            currentUsername = data.username;
            localStorage.setItem('skillbridge_userId', currentUserId);
            localStorage.setItem('skillbridge_username', currentUsername);
            
            closeAuthModal();
            updateAuthUI();
            await loadUserData();
            showNotification(`Welcome back, ${currentUsername}! 🎉`, 'success');
            
            // Refresh current page to show user-specific content
            if (typeof renderTutorials === 'function') renderTutorials();
            if (typeof renderLanguageCards === 'function') renderLanguageCards();
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Server error. Please try again.', 'error');
    }
}

// ============ SIGNUP FUNCTION ============
async function signup() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    
    if (!username || !password) {
        showNotification('Please enter username and password', 'error');
        return;
    }
    
    if (username.length < 3) {
        showNotification('Username must be at least 3 characters', 'error');
        return;
    }
    
    if (password.length < 4) {
        showNotification('Password must be at least 4 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Account created! Please login.', 'success');
            showLoginForm();
            document.getElementById('regUsername').value = '';
            document.getElementById('regPassword').value = '';
        } else {
            showNotification(data.error || 'Signup failed', 'error');
        }
    } catch (error) {
        showNotification('Server error. Please try again.', 'error');
    }
}

// ============ LOGOUT FUNCTION ============
function logout() {
    currentUserId = null;
    currentUsername = null;
    localStorage.removeItem('skillbridge_userId');
    localStorage.removeItem('skillbridge_username');
    updateAuthUI();
    showNotification('Logged out successfully', 'info');
    
    // Clear local data
    userFavorites = [];
    userBackpack = [];
    
    // Refresh page
    if (typeof renderTutorials === 'function') renderTutorials();
    if (typeof renderLanguageCards === 'function') renderLanguageCards();
    if (typeof updateCartCount === 'function') updateCartCount();
}

// ============ UPDATE UI BASED ON LOGIN STATE ============
function updateAuthUI() {
    const authBtn = document.getElementById('authButton');
    if (!authBtn) return;
    
    if (currentUserId) {
        authBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUsername} <i class="fas fa-chevron-down"></i>`;
        authBtn.onclick = () => toggleUserMenu();
    } else {
        authBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
        authBtn.onclick = () => showAuthModal();
    }
}

// Show user menu with logout option
function toggleUserMenu() {
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.innerHTML = `
        <div class="user-menu">
            <div class="user-info">👤 ${currentUsername}</div>
            <button onclick="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
    `;
    menu.style.cssText = `
        position: absolute;
        top: 60px;
        right: 100px;
        background: #1a1a2e;
        border: 1px solid #4ecdc4;
        border-radius: 10px;
        padding: 0.5rem;
        z-index: 1000;
    `;
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target) && e.target.id !== 'authButton') {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 100);
}

// ============ LOAD USER DATA FROM SERVER ============
async function loadUserData() {
    if (!currentUserId) return;
    
    try {
        // Load favorites
        const favResponse = await fetch(`/api/favorites/${currentUserId}`);
        const favData = await favResponse.json();
        window.userFavorites = favData.favorites || [];
        
        // Load backpack
        const backpackResponse = await fetch(`/api/backpack/${currentUserId}`);
        const backpackData = await backpackResponse.json();
        window.userBackpack = backpackData.backpack || [];
        
        if (typeof updateCartCount === 'function') updateCartCount();
        if (typeof updateCartDisplay === 'function') updateCartDisplay();
        
        console.log(`📦 Loaded ${window.userFavorites.length} favorites and ${window.userBackpack.length} backpack items`);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// ============ OVERRIDE FAVORITE FUNCTIONS ============
async function addToFavorites(tutorialId, tutorial) {
    if (!currentUserId) {
        showAuthModal();
        return false;
    }
    
    try {
        await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                tutorialId: tutorialId,
                tutorialName: tutorial.name,
                tutorialLanguage: tutorial.language,
                tutorialLevel: tutorial.level
            })
        });
        
        window.userFavorites.push({ tutorial_id: tutorialId });
        showNotification(`Added "${tutorial.name}" to toolbox! 🌟`, 'success');
        return true;
    } catch (error) {
        showNotification('Failed to add favorite', 'error');
        return false;
    }
}

async function removeFromFavorites(tutorialId, tutorialName) {
    if (!currentUserId) return false;
    
    try {
        await fetch(`/api/favorites/${currentUserId}/${tutorialId}`, {
            method: 'DELETE'
        });
        
        window.userFavorites = window.userFavorites.filter(f => f.tutorial_id !== tutorialId);
        showNotification(`Removed "${tutorialName}" from toolbox`, 'info');
        return true;
    } catch (error) {
        showNotification('Failed to remove favorite', 'error');
        return false;
    }
}

async function toggleFavorite(tutorialId, tutorial) {
    if (!currentUserId) {
        showAuthModal();
        return;
    }
    
    const isFav = window.userFavorites.some(f => f.tutorial_id === tutorialId);
    
    if (isFav) {
        await removeFromFavorites(tutorialId, tutorial.name);
    } else {
        await addToFavorites(tutorialId, tutorial);
    }
    
    // Refresh the page display
    if (typeof renderTutorials === 'function') renderTutorials();
    if (typeof renderLanguageCards === 'function') renderLanguageCards();
}

// ============ OVERRIDE BACKPACK FUNCTIONS ============
async function addToBackpack(tutorialId, tutorialName) {
    if (!currentUserId) {
        showAuthModal();
        return false;
    }
    
    try {
        await fetch('/api/backpack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                tutorialId: tutorialId,
                tutorialName: tutorialName
            })
        });
        
        showNotification(`Added "${tutorialName}" to backpack! 🎒`, 'success');
        await loadUserData();
        if (typeof updateCartCount === 'function') updateCartCount();
        if (typeof updateCartDisplay === 'function') updateCartDisplay();
        return true;
    } catch (error) {
        showNotification('Failed to add to backpack', 'error');
        return false;
    }
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#ffa502'};
        color: ${type === 'success' ? '#1a1a2e' : 'white'};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ INITIALIZE AUTH ON PAGE LOAD ============
document.addEventListener('DOMContentLoaded', () => {
    initAuthModal();
    updateAuthUI();
    if (currentUserId) {
        loadUserData();
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .logout-btn {
        background: #ff6b6b;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        width: 100%;
        margin-top: 0.5rem;
    }
    .user-menu {
        min-width: 150px;
    }
    .user-info {
        padding: 0.5rem;
        color: #4ecdc4;
        border-bottom: 1px solid rgba(78,205,196,0.3);
    }
`;
document.head.appendChild(style);