// Leaflet map integration for the competitor data displayed on the landing page.
import { appState } from './state.js';

const center = [19.0760, 72.8777]; // Mumbai demo centre
let analysisCenter = center;

export function initMap() {
    const element = document.getElementById('map');
    if (!element || typeof L === 'undefined') return;

    const map = L.map(element).setView(center, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    appState.setMap(map);
    updateMapMarkers();
}

export function updateMapMarkers() {
    const map = appState.getMap();
    if (!map || typeof L === 'undefined') return;

    appState.getMapMarkers().forEach(marker => marker.remove());
    appState.getMapCircles().forEach(circle => circle.remove());

    const markers = appState.getCompetitors().map((competitor, index) => {
        const angle = (index / Math.max(appState.getCompetitors().length, 1)) * Math.PI * 2;
        const latitude = analysisCenter[0] + Math.cos(angle) * (0.018 + index * 0.003);
        const longitude = analysisCenter[1] + Math.sin(angle) * (0.018 + index * 0.003);
        return L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`<strong>${competitor.name}</strong><br>${competitor.rating} ★ · ${competitor.reviews} reviews`);
    });
    const circle = L.circle(analysisCenter, { radius: 5000, color: '#4F46E5', fillColor: '#4F46E5', fillOpacity: 0.08 }).addTo(map);
    appState.setMapMarkers(markers);
    appState.setMapCircles([circle]);
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
}

function toPercentage(value) {
    const score = Number(value);
    if (!Number.isFinite(score)) return '—';
    const percentage = score <= 1 ? score * 100 : score;
    return `${Math.max(0, Math.min(100, percentage)).toFixed(2)}%`;
}

async function geocodeLocation(location) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error('Location search failed');
    const matches = await response.json();
    if (!matches.length) throw new Error('Location not found');
    return [Number(matches[0].lat), Number(matches[0].lon)];
}

function renderAnalysisPanel(result, message = '') {
    const panel = document.getElementById('mapAnalysisPanel');
    if (!panel) return;

    const scores = [
        ['Demand', result.demandScore], ['Competition', result.competitionScore],
        ['Affordability', result.affordabilityScore], ['Final score', result.finalScore],
        ['Success probability', result.successProbability]
    ];
    const insights = Array.isArray(result.insights) ? result.insights : [];
    panel.hidden = false;
    panel.innerHTML = `
        <div class="map-analysis-heading">
            <div><span class="subtitle">Analysis for</span><h3>${escapeHtml(result.location || 'Selected area')}</h3></div>
            <span class="map-analysis-status">${escapeHtml(message || 'Area mapped')}</span>
        </div>
        <div class="map-score-grid">${scores.map(([label, value]) => `<div><strong>${toPercentage(value)}</strong><span>${label}</span></div>`).join('')}</div>
        ${insights.length ? `<div class="map-insights"><h4><i class="fas fa-lightbulb"></i> Area insights</h4><ul>${insights.map(insight => `<li>${escapeHtml(insight).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul></div>` : ''}
    `;
}

export async function displayAnalysisOnMap(result) {
    const map = appState.getMap();
    if (!map || typeof L === 'undefined') return;

    renderAnalysisPanel(result, 'Locating area…');
    try {
        analysisCenter = await geocodeLocation(result.location);
        const radiusMetres = Math.max(1, Number(result.searchRadius) || 5) * 1000;
        appState.getMapMarkers().forEach(marker => marker.remove());
        appState.getMapCircles().forEach(circle => circle.remove());

        const areaMarker = L.marker(analysisCenter, { zIndexOffset: 1000 }).addTo(map)
            .bindPopup(`<strong>${escapeHtml(result.businessName || 'Your business')}</strong><br>${escapeHtml(result.location || '')}`).openPopup();
        const areaCircle = L.circle(analysisCenter, { radius: radiusMetres, color: '#4F46E5', fillColor: '#4F46E5', fillOpacity: 0.12 }).addTo(map);
        const competitors = Array.isArray(result.competitors) ? result.competitors : [];
        const competitorMarkers = competitors.map((competitor, index) => {
            const angle = (index / Math.max(competitors.length, 1)) * Math.PI * 2;
            const distance = Math.min(radiusMetres * (0.3 + (index % 4) * 0.14), radiusMetres * 0.9);
            const point = L.latLng(analysisCenter).toBounds(distance).getCenter();
            const latitude = analysisCenter[0] + Math.cos(angle) * distance / 111320;
            const longitude = analysisCenter[1] + Math.sin(angle) * distance / (111320 * Math.cos(analysisCenter[0] * Math.PI / 180));
            return L.circleMarker([latitude || point.lat, longitude || point.lng], { radius: 7, color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.9 })
                .addTo(map).bindPopup(`<strong>${escapeHtml(competitor.name || 'Competitor')}</strong><br>${Number(competitor.rating || 0).toFixed(1)} ★`);
        });
        appState.setMapMarkers([areaMarker, ...competitorMarkers]);
        appState.setMapCircles([areaCircle]);
        map.fitBounds(areaCircle.getBounds(), { padding: [35, 35], maxZoom: 14 });
        const count = document.getElementById('mapCompetitorCount');
        if (count) count.innerHTML = `<i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> ${competitors.length} competitors in this area`;
        const timestamp = document.getElementById('mapTimestamp');
        if (timestamp) timestamp.textContent = 'Analysis updated just now';
        renderAnalysisPanel(result, `${Number(result.searchRadius) || 5} km search area`);
    } catch (error) {
        console.warn('Could not map analysis location:', error);
        renderAnalysisPanel(result, 'Area could not be located on the map');
    }
}
