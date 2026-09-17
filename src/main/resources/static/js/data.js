// ============================================================
// DATA CONFIGURATION
// ============================================================

export const COMPETITOR_DATA = [
    { id: 1, name: 'Central Perk', lat: 40.7128, lng: -74.0060, rating: 4.8, reviews: 567, price: 3, revenue: 1200000, footTraffic: 650, status: 'Leader', growth: 12.5 },
    { id: 2, name: 'Brew & Bean', lat: 40.7142, lng: -74.0080, rating: 4.3, reviews: 342, price: 2, revenue: 850000, footTraffic: 480, status: 'Challenger', growth: 8.2 },
    { id: 3, name: 'Roast House', lat: 40.7110, lng: -74.0045, rating: 4.9, reviews: 789, price: 3, revenue: 1500000, footTraffic: 720, status: 'Leader', growth: 15.8 },
    { id: 4, name: 'Daily Grind', lat: 40.7160, lng: -74.0020, rating: 4.1, reviews: 234, price: 1, revenue: 550000, footTraffic: 380, status: 'Follower', growth: 3.1 },
    { id: 5, name: 'Coffee Collective', lat: 40.7095, lng: -74.0100, rating: 4.6, reviews: 456, price: 2, revenue: 980000, footTraffic: 590, status: 'Leader', growth: 10.4 },
    { id: 6, name: 'Artisan Brew', lat: 40.7135, lng: -74.0075, rating: 4.7, reviews: 623, price: 3, revenue: 1100000, footTraffic: 610, status: 'Leader', growth: 14.2 },
    { id: 7, name: 'Morning Star', lat: 40.7150, lng: -74.0090, rating: 4.0, reviews: 189, price: 1, revenue: 420000, footTraffic: 320, status: 'Follower', growth: 1.8 },
    { id: 8, name: 'Urban Grind', lat: 40.7100, lng: -74.0055, rating: 4.4, reviews: 398, price: 2, revenue: 780000, footTraffic: 440, status: 'Challenger', growth: 9.6 }
];

export const FEATURES = [
    { icon: 'fa-database', title: 'Multi-Source Data Collection', desc: 'Scrape data from Google Places, Overpass API, and websites using Python' },
    { icon: 'fa-map', title: 'Geospatial Intelligence', desc: 'Analyze competitor locations and visualize market density with GeoPandas' },
    { icon: 'fa-brain', title: 'AI-Powered Predictions', desc: 'Predict market trends using scikit-learn, XGBoost, and deep learning' },
    { icon: 'fa-server', title: 'Robust Backend API', desc: 'FastAPI or Flask for seamless data access and integration' },
    { icon: 'fa-chart-bar', title: 'Interactive Dashboards', desc: 'Real-time visualizations with Streamlit or React' },
    { icon: 'fa-cloud-upload-alt', title: 'One-Click Deployment', desc: 'Deploy on Render, Railway, AWS, or Hugging Face Spaces' }
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const TREND_DATA = [1.0, 1.03, 1.07, 1.12, 1.15, 1.18, 1.22, 1.27, 1.32, 1.36, 1.40, 1.45];
export const RATING_TREND = [4.1, 4.15, 4.2, 4.25, 4.28, 4.32, 4.35, 4.38, 4.42, 4.45, 4.48, 4.5];
export const BUSINESS_TYPES = ['Coffee Shop', 'Restaurant', 'Retail Store', 'Salon & Spa', 'Fitness Center', 'Pharmacy', 'Grocery Store', 'Bakery', 'Food Truck', 'Boutique', 'Electronics Store', 'Bookstore', 'Pet Store', 'Hardware Store', 'Furniture Store', 'Other'];
export const AUTH_CONFIG = {
    LOGIN_URL: '/login.html',
    DASHBOARD_URL: '/dashboard.html',
    API_ENDPOINTS: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile'
    }
};