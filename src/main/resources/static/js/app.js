// ============================================================
// MAIN APPLICATION - Entry Point
// ============================================================

import { buildNavbar } from './navbar.js';
import { buildHero } from './hero.js';
import { buildMapSection } from './map.js';
import { buildAnalytics } from './charts.js';
import { buildFeatures } from './features.js';
import { buildFooter } from './footer.js';
import { buildFormPopup } from './form.js';
import { initMap } from './map-service.js';
import { initCharts } from './chart-service.js';
import { getApiService } from './api-service.js';
import { getAuthService } from './auth-service.js';

function handleScroll() {
    const nav = document.getElementById('navbar');
    if (nav) {
        nav.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }
}

function initApp() {
    console.log('Initializing MarketAnalyzer Pro...');

    const app = document.getElementById('app');
    if (!app) {
        console.error('App container not found!');
        return;
    }

    try {
        app.appendChild(buildNavbar());
        app.appendChild(buildHero());
        app.appendChild(buildMapSection());
        app.appendChild(buildAnalytics());
        app.appendChild(buildFeatures());
        app.appendChild(buildFooter());
        app.appendChild(buildFormPopup());

        setTimeout(() => {
            try {
                initMap();
                initCharts();

                if (typeof window.updateRadiusDisplay === 'function') window.updateRadiusDisplay(5);
                if (typeof window.updateBudgetDisplay === 'function') window.updateBudgetDisplay(30);

                checkApiHealth();
                loadUserSession();
            } catch (error) {
                console.error('Initialization error:', error);
            }
        }, 200);

        document.addEventListener('scroll', handleScroll);
        console.log('MarketAnalyzer Pro initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

async function checkApiHealth() {
    try {
        const apiService = getApiService();
        const health = await apiService.getHealthCheck();
        console.log('API Health:', health);

        const statusBadge = document.querySelector('.status-badge');
        if (!statusBadge) return;

        if (health?.status === 'UP') {
            statusBadge.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            const liveText = statusBadge.querySelector('.live-text');
            if (liveText) liveText.textContent = '🟢 ONLINE';
        } else {
            statusBadge.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            const liveText = statusBadge.querySelector('.live-text');
            if (liveText) liveText.textContent = '🔴 OFFLINE';
        }
    } catch (error) {
        console.warn('API Health check failed:', error);
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            const liveText = statusBadge.querySelector('.live-text');
            if (liveText) liveText.textContent = '🔴 OFFLINE';
        }
    }
}

function loadUserSession() {
    try {
        const authService = getAuthService();
        const user = authService.getUser();
        if (user) {
            console.log('User session loaded:', user.email);
            updateUIForAuthenticatedUser(user);
        }
    } catch (error) {
        console.warn('Failed to load user session:', error);
    }
}

function updateUIForAuthenticatedUser(user) {
    const navLinks = document.querySelector('.navbar-links');
    if (!navLinks || !user) return;

    if (navLinks.querySelector('[data-user-link]')) return;

    const loginLink = navLinks.querySelector('a[href="login.html"]');
    if (!loginLink) return;

    const userLink = document.createElement('a');
    userLink.setAttribute('data-user-link', 'true');
    userLink.href = '#';
    userLink.style.cssText = 'display:flex;align-items:center;gap:6px;color:var(--primary);';
    userLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.firstName || 'Account'}`;

    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.style.color = '#EF4444';
    logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            getAuthService().logout();
            window.location.reload();
        }
    });

    loginLink.replaceWith(userLink);

    const statusBadge = navLinks.querySelector('.status-badge');
    if (statusBadge) {
        navLinks.insertBefore(logoutLink, statusBadge);
    } else {
        navLinks.appendChild(logoutLink);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.handleLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
        getAuthService().logout();
        window.location.reload();
    }
};