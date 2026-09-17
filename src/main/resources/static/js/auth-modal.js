// ============================================================
// AUTH MODAL - Login and Registration
// ============================================================

import { getAuthService } from './auth-service.js';

export function buildAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal-overlay';
    modal.id = 'authModal';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(6px);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div class="auth-modal" style="
            background: white;
            border-radius: 16px;
            padding: 2rem;
            max-width: 420px;
            width: 94%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        ">
            <button onclick="window.closeAuthModal()" style="
                position: sticky; top: 0; float: right;
                background: #F1F5F9; border: none;
                width: 36px; height: 36px;
                border-radius: 50%;
                font-size: 1.2rem; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.3s;
            "><i class="fas fa-times"></i></button>

            <div id="authTabs" style="display:flex;gap:0.5rem;margin-bottom:1.5rem;border-bottom:2px solid #E2E8F0;padding-bottom:0.5rem;">
                <button class="auth-tab active" data-tab="login" style="
                    flex:1; padding:0.6rem; border:none; background:transparent;
                    font-weight:600; color:#4F46E5; border-bottom:3px solid #4F46E5;
                    cursor:pointer; font-family:inherit; transition:all 0.3s;
                ">Login</button>
                <button class="auth-tab" data-tab="register" style="
                    flex:1; padding:0.6rem; border:none; background:transparent;
                    font-weight:600; color:#94A3B8; border-bottom:3px solid transparent;
                    cursor:pointer; font-family:inherit; transition:all 0.3s;
                ">Register</button>
            </div>

            <form id="loginForm" onsubmit="window.handleModalLogin(event)">
                <h3 style="margin-bottom:0.5rem;">Welcome Back</h3>
                <p style="color:#64748B;font-size:0.9rem;margin-bottom:1.2rem;">Sign in to access your market analysis</p>
                <div class="form-group" style="margin-bottom:1rem;">
                    <label style="display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">Email</label>
                    <input type="email" class="form-control" id="modalLoginEmail" placeholder="your@email.com" required style="width:100%;padding:0.7rem 1rem;border:2px solid #E2E8F0;border-radius:10px;font-family:inherit;font-size:0.95rem;">
                </div>
                <div class="form-group" style="margin-bottom:1.2rem;">
                    <label style="display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">Password</label>
                    <input type="password" class="form-control" id="modalLoginPassword" placeholder="Enter password" required style="width:100%;padding:0.7rem 1rem;border:2px solid #E2E8F0;border-radius:10px;font-family:inherit;font-size:0.95rem;">
                </div>
                <button type="submit" class="btn-submit" style="width:100%;padding:0.8rem;border-radius:10px;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;border:none;font-weight:600;font-size:1rem;cursor:pointer;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </form>

            <form id="registerForm" onsubmit="window.handleModalRegister(event)" style="display:none;">
                <h3 style="margin-bottom:0.5rem;">Create Account</h3>
                <p style="color:#64748B;font-size:0.9rem;margin-bottom:1.2rem;">Start analyzing your market today</p>
                <div class="form-group" style="margin-bottom:0.8rem;">
                    <label style="display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">First Name</label>
                    <input type="text" class="form-control" id="modalRegisterFirstName" placeholder="John" required style="width:100%;padding:0.7rem 1rem;border:2px solid #E2E8F0;border-radius:10px;font-family:inherit;font-size:0.95rem;">
                </div>
                <div class="form-group" style="margin-bottom:0.8rem;">
                    <label style="display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">Last Name</label>
                    <input type="text" class="form-control" id="modalRegisterLastName" placeholder="Doe" required style="width:100%;padding:0.7rem 1rem;border:2px solid #E2E8F0;border-radius:10px;font-family:inherit;font-size:0.95rem;">
                </div>
                <div class="form-group" style="margin-bottom:0.8rem;">
                    <label style="display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">Email</label>
                    <input type="email" class="form-control" id="modalRegisterEmail" placeholder="your@email.com" required style="width:100%;padding:0.7rem 1rem;border:2px solid #E2E8F0;border-radius:10px;font-family:inherit;font-size:0.95rem;">
                </div>
                <div class="form-group" style="margin-bottom:1.2rem;">
                    <label style="display:block;font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;">Password</label>
                    <input type="password" class="form-control" id="modalRegisterPassword" placeholder="Min 8 characters" required minlength="8" style="width:100%;padding:0.7rem 1rem;border:2px solid #E2E8F0;border-radius:10px;font-family:inherit;font-size:0.95rem;">
                </div>
                <button type="submit" class="btn-submit" style="width:100%;padding:0.8rem;border-radius:10px;background:linear-gradient(135deg,#10B981,#059669);color:white;border:none;font-weight:600;font-size:1rem;cursor:pointer;">
                    <i class="fas fa-user-plus"></i> Create Account
                </button>
            </form>

            <div id="authError" style="display:none;margin-top:1rem;padding:0.8rem;background:#FEE2E2;border-radius:8px;color:#DC2626;text-align:center;font-size:0.9rem;"></div>
        </div>
    `;

    return modal;
}

export function setupAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = '#94A3B8';
                t.style.borderBottomColor = 'transparent';
            });
            this.classList.add('active');
            this.style.color = '#4F46E5';
            this.style.borderBottomColor = '#4F46E5';

            const tabName = this.dataset.tab;
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');

            if (loginForm) loginForm.style.display = tabName === 'login' ? 'block' : 'none';
            if (registerForm) registerForm.style.display = tabName === 'register' ? 'block' : 'none';
        });
    });
}

window.openAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeAuthModal = function() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.handleModalLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById('modalLoginEmail')?.value;
    const password = document.getElementById('modalLoginPassword')?.value;
    const errorEl = document.getElementById('authError');

    if (!email || !password) {
        if (errorEl) { errorEl.textContent = 'Please enter email and password'; errorEl.style.display = 'block'; }
        return;
    }

    if (errorEl) errorEl.style.display = 'none';

    try {
        const authService = getAuthService();
        await authService.login(email, password);
        window.closeAuthModal();
        window.location.reload();
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = error.message || 'Login failed. Please try again.';
            errorEl.style.display = 'block';
        }
        console.error('Login error:', error);
    }
};

window.handleModalRegister = async function(e) {
    e.preventDefault();
    const firstName = document.getElementById('modalRegisterFirstName')?.value;
    const lastName = document.getElementById('modalRegisterLastName')?.value;
    const email = document.getElementById('modalRegisterEmail')?.value;
    const password = document.getElementById('modalRegisterPassword')?.value;
    const errorEl = document.getElementById('authError');

    if (!firstName || !lastName || !email || !password) {
        if (errorEl) { errorEl.textContent = 'Please fill in all fields'; errorEl.style.display = 'block'; }
        return;
    }

    if (password.length < 8) {
        if (errorEl) { errorEl.textContent = 'Password must be at least 8 characters'; errorEl.style.display = 'block'; }
        return;
    }

    if (errorEl) errorEl.style.display = 'none';

    try {
        const authService = getAuthService();
        await authService.register({ firstName, lastName, email, password });
        window.closeAuthModal();
        window.location.reload();
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = error.message || 'Registration failed. Please try again.';
            errorEl.style.display = 'block';
        }
        console.error('Registration error:', error);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    setupAuthTabs();
});