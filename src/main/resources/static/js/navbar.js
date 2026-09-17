// ============================================================
// NAVBAR COMPONENT - With Authentication
// ============================================================

import { getAuthService } from './auth-service.js';

export function buildNavbar() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'navbar';

    const authService = getAuthService();
    const isAuth = authService.isAuthenticated();
    const user = authService.getUser();

    nav.innerHTML = `
        <a class="navbar-brand" href="index.html">
            <div class="logo-icon"><i class="fas fa-chart-line"></i></div>
            <span>MarketAnalyzer</span>
        </a>
        <div class="navbar-links" id="navLinks">
            <a href="#map-section">Market Map</a>
            <a href="#analytics">Analytics</a>
            <a href="#" onclick="event.preventDefault(); window.openFormPopup();">Market Analysis</a>
            <a href="#features">Features</a>
            ${isAuth ? `
                <a href="dashboard.html" style="display:flex;align-items:center;gap:6px;color:var(--primary);">
                    <i class="fas fa-user-circle"></i> ${user?.firstName || 'Account'}
                </a>
                <a href="#" onclick="event.preventDefault(); window.handleLogout();" style="color:#EF4444;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            ` : `
                <a href="login.html" style="display:flex;align-items:center;gap:6px;font-weight:600;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            `}
            <button class="status-badge" id="liveDemoBtn" onclick="window.toggleLiveDemo()">
                <span class="dot" id="liveDot"></span>
                <span class="live-text">🔴 LIVE</span>
                <span class="update-time" id="updateTime">updating...</span>
            </button>
        </div>
        <button class="mobile-menu-btn" id="mobileMenuBtn">
            <i class="fas fa-bars"></i>
        </button>
    `;

    const menuBtn = nav.querySelector('#mobileMenuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.toggle('active');
        });
    }

    return nav;
}

window.handleLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
        const authService = getAuthService();
        authService.logout();
        window.location.href = 'login.html';
    }
};