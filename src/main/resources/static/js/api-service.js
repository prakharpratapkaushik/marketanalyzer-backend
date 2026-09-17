// ============================================================
// API SERVICE - Production-Ready Backend Communication
// ============================================================

class ApiService {
    constructor() {
        const globalUrl = window.API_CONFIG?.BASE_URL;
        const hasValidGlobal = globalUrl &&
            !globalUrl.includes('yourwebsite') &&
            !globalUrl.includes('your-api-domain') &&
            !globalUrl.includes('YOUR-DOMAIN');

        if (hasValidGlobal) {
            this.baseUrl = globalUrl;
        } else {
            // The frontend and API are served by the same Spring Boot service.
            this.baseUrl = `${window.location.origin}/api`;
        }

        this.timeout = window.API_CONFIG?.TIMEOUT || 30000;
        this.retryAttempts = window.API_CONFIG?.RETRY_ATTEMPTS || 3;

        this.token = localStorage.getItem('auth_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        this.isRefreshing = false;
        this.pendingRequests = [];

        console.log(`[API] Initialized: ${this.baseUrl}`);

        this.request = this.request.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const method = (options.method || 'GET').toUpperCase();

        const headers = { 'Accept': 'application/json' };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (options.headers && typeof options.headers === 'object') {
            Object.keys(options.headers).forEach(key => {
                if (key.toLowerCase() !== 'authorization') {
                    headers[key] = options.headers[key];
                }
            });
        }

        const config = {
            method: method,
            mode: 'cors',
            credentials: 'include',
            headers: headers,
        };

        if (options.body !== undefined) {
            if (options.body instanceof FormData) {
                delete headers['Content-Type'];
                config.body = options.body;
            } else if (options.body instanceof URLSearchParams) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                config.body = options.body.toString();
            } else if (typeof options.body === 'object') {
                headers['Content-Type'] = 'application/json';
                config.body = JSON.stringify(options.body);
            } else {
                config.body = options.body;
            }
        }

        console.log(`[API] ${method} ${endpoint}`);

        let lastError;
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this.fetchWithTimeout(url, config);
                const data = await this.handleResponse(response);
                console.log(`[API] ${method} ${endpoint} → ${response.status} OK`);
                return data;
            } catch (error) {
                lastError = error;
                if (error.status >= 400 && error.status < 500 &&
                    error.status !== 401 && error.status !== 408 && error.status !== 429) {
                    throw error;
                }
                if (attempt === this.retryAttempts) break;
                console.warn(`[API] Attempt ${attempt} failed, retrying...`);
                await this.sleep(1000 * attempt);
            }
        }

        if (lastError.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
            return this.handleUnauthorized(endpoint, options);
        }

        throw lastError;
    }

    async fetchWithTimeout(url, config) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                const err = new Error('Request timeout - server may be offline or blocked by CORS');
                err.status = 408;
                throw err;
            }
            if (error.message && error.message.includes('Failed to fetch')) {
                const err = new Error('Network error - check CORS settings and server availability');
                err.status = 0;
                throw err;
            }
            throw error;
        }
    }

    async handleResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        let data;

        if (contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const message = data?.message || data?.error || data || `HTTP ${response.status}`;
            const error = new Error(message);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('auth_token', data.token);
            if (data.refreshToken) {
                this.refreshToken = data.refreshToken;
                localStorage.setItem('refresh_token', data.refreshToken);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } else {
            throw new Error('Invalid response: no token received from server');
        }

        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: userData
        });

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('auth_token', data.token);
            if (data.refreshToken) {
                this.refreshToken = data.refreshToken;
                localStorage.setItem('refresh_token', data.refreshToken);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } else {
            throw new Error('Invalid response: no token received from server');
        }

        return data;
    }

    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify({ refreshToken: this.refreshToken })
        });

        if (!response.ok) {
            throw new Error('Refresh token invalid or expired');
        }

        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        if (!data.token) {
            throw new Error('Refresh response missing token');
        }

        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
        return data.token;
    }

    async handleUnauthorized(endpoint, options) {
        if (!this.refreshToken) {
            this.logout();
            throw new Error('Session expired. Please login again.');
        }

        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.pendingRequests.push({ endpoint, options, resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            await this.refreshAccessToken();
            this.isRefreshing = false;

            this.pendingRequests.forEach(({ endpoint: ep, options: opts, resolve, reject }) => {
                this.request(ep, opts).then(resolve).catch(reject);
            });
            this.pendingRequests = [];

            return this.request(endpoint, options);
        } catch (error) {
            this.isRefreshing = false;
            this.pendingRequests = [];
            this.logout();
            throw new Error('Session expired. Please login again.');
        }
    }

    logout() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    isAuthenticated() {
        return !!this.token;
    }

    getUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    }

    async requestAnalysis(data) {
        return this.request('/analysis/request', { method: 'POST', body: data });
    }

    async getAnalysisResult(requestId) {
        return this.request(`/analysis/${requestId}`);
    }

    async getUserAnalyses() {
        return this.request('/analysis/user');
    }

    async getAnalysisStatus(requestId) {
        return this.request(`/analysis/${requestId}/status`);
    }

    async getNearbyCompetitors(lat, lng, radius = 5) {
        return this.request(`/competitors/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    }

    async getCompetitorDetails(competitorId) {
        return this.request(`/competitors/${competitorId}`);
    }

    async getCompetitorTrends(competitorId, period = '30d') {
        return this.request(`/competitors/${competitorId}/trends?period=${period}`);
    }

    async getMarketTrends(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/insights/trends?${queryString}`);
    }

    async getMarketSummary(location, radius = 5) {
        return this.request(`/insights/summary?location=${encodeURIComponent(location)}&radius=${radius}`);
    }

    async getCompetitiveAnalysis(params) {
        return this.request('/insights/competitive', { method: 'POST', body: params });
    }

    async getPublicTrends() {
        return this.request('/public/trends');
    }

    async getPublicMarketData() {
        return this.request('/public/market-data');
    }

    async getHealthCheck() {
        try {
            return await this.request('/health');
        } catch (error) {
            console.warn('[API] Health check failed:', error.message);
            return { status: 'DOWN', error: error.message };
        }
    }

    async uploadFile(file, type = 'analysis') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        return this.request('/upload', {
            method: 'POST',
            headers: {},
            body: formData
        });
    }

    async downloadReport(requestId, format = 'pdf') {
        return this.request(`/analysis/${requestId}/report?format=${format}`, {
            method: 'GET',
            headers: { 'Accept': format === 'pdf' ? 'application/pdf' : 'text/html' }
        });
    }
}

const apiService = new ApiService();

export function getApiService() {
    return apiService;
}

export function apiRequest(endpoint, options = {}) {
    return apiService.request(endpoint, options);
}

export function getAuthToken() {
    return apiService.token;
}

export function isAuthenticated() {
    return apiService.isAuthenticated();
}

export function logout() {
    apiService.logout();
}

export default apiService;
