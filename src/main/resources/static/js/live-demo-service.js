// ============================================================
// LIVE DEMO SERVICE - Real-time Updates
// ============================================================

import { appState } from './state.js';
import { updateMapMarkers } from './map-service.js';
import { updateCharts } from './chart-service.js';

export function toggleLiveDemo() {
    const btn = document.getElementById('liveDemoBtn');
    const dot = document.getElementById('liveDot');
    const timeDisplay = document.getElementById('updateTime');

    if (!btn || !dot || !timeDisplay) return;

    const isLive = appState.isLiveMode();

    if (!isLive) {
        // Start live mode
        appState.setLiveMode(true);
        btn.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
        btn.style.boxShadow = '0 0 30px rgba(239,68,68,0.5)';
        dot.style.animation = 'blink 0.5s infinite';
        timeDisplay.textContent = '🔄 updating...';

        const interval = setInterval(performLiveUpdate, 3000);
        appState.setUpdateInterval(interval);
        performLiveUpdate();
    } else {
        // Stop live mode
        appState.setLiveMode(false);
        btn.style.background = 'linear-gradient(135deg, #6B7280, #4B5563)';
        btn.style.boxShadow = 'none';
        dot.style.animation = 'none';
        dot.style.opacity = '0.5';
        timeDisplay.textContent = '⏸️ paused';

        const interval = appState.getUpdateInterval();
        if (interval) {
            clearInterval(interval);
            appState.setUpdateInterval(null);
        }
    }
}

export function performLiveUpdate() {
    const competitors = appState.getCompetitors();

    competitors.forEach(comp => {
        const ratingChange = (Math.random() - 0.5) * 0.2;
        comp.rating = Math.max(1, Math.min(5, comp.rating + ratingChange));
        comp.rating = Math.round(comp.rating * 10) / 10;

        const reviewChange = Math.floor((Math.random() - 0.4) * 20);
        comp.reviews = Math.max(0, comp.reviews + reviewChange);

        const trafficChange = Math.floor((Math.random() - 0.4) * 30);
        comp.footTraffic = Math.max(0, comp.footTraffic + trafficChange);

        if (comp.rating >= 4.5) comp.status = 'Leader';
        else if (comp.rating >= 4.0) comp.status = 'Challenger';
        else comp.status = 'Follower';
    });

    updateCharts();
    updateMapMarkers();

    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    const ts = document.getElementById('mapTimestamp');
    if (ts) ts.textContent = `Last update: ${timeStr}`;

    const ut = document.getElementById('updateTime');
    if (ut) ut.textContent = `⏱️ ${timeStr}`;
}

window.toggleLiveDemo = toggleLiveDemo;