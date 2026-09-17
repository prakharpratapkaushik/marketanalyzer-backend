// ============================================================
// AUTH SERVICE - Authentication Management
// ============================================================

import { getApiService } from './api-service.js';

class AuthService {
    constructor() {
        this.user = null;
        this.isLoading = false;
        this.listeners = [];
        this.apiService = null;

        this.loadUserFromStorage();

        window.addEventListener('auth:logout', () => {
            this.user = null;
            this.notifyListeners();
        });

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    getApi() {
        if (!this.apiService) {
            this.apiService = getApiService();
        }
        return this.apiService;
    }

    loadUserFromStorage() {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                this.user = JSON.parse(userJson);
            }
        } catch (e) {
            console.warn('Failed to load user from storage');
            this.user = null;
        }
    }

    async login(email, password) {
        this.isLoading = true;
        try {
            const response = await this.getApi().login(email, password);
            this.user = response.user || null;
            this.notifyListeners();
            return response;
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async register(userData) {
        this.isLoading = true;
        try {
            const response = await this.getApi().register(userData);
            this.user = response.user || null;
            this.notifyListeners();
            return response;
        } catch (error) {
            console.error('Registration error:', error.message);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    logout() {
        this.getApi().logout();
        this.user = null;
        localStorage.removeItem('user');
        this.notifyListeners();
    }

    isAuthenticated() {
        return !!this.user && this.getApi().isAuthenticated();
    }

    getUser() {
        return this.user;
    }

    async refreshUserProfile() {
        try {
            const profile = await this.getApi().request('/auth/profile');
            if (profile) {
                this.user = profile;
                localStorage.setItem('user', JSON.stringify(profile));
                this.notifyListeners();
            }
            return profile;
        } catch (error) {
            console.error('Failed to refresh profile:', error);
            return null;
        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.user);
            } catch (e) {
                console.warn('Listener error:', e);
            }
        });
    }
}

let authServiceInstance = null;

export function getAuthService() {
    if (!authServiceInstance) {
        authServiceInstance = new AuthService();
    }
    return authServiceInstance;
}

export default getAuthService;