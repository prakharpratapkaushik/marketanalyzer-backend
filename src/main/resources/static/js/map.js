// ============================================================
// MAP COMPONENT
// ============================================================

export function buildMapSection() {
    const section = document.createElement('section');
    section.className = 'section section-alternate';
    section.id = 'map-section';
    section.innerHTML = `
        <div class="container">
            <div class="section-header animate-fade-in">
                <div class="subtitle">Geospatial Analysis</div>
                <h2>Competitor Location Map</h2>
                <p>Interactive map showing competitor density and market coverage</p>
            </div>
            <div class="map-wrapper animate-fade-in">
                <div class="map-overlay">
                    <span class="live-dot"></span>
                    <span id="mapCompetitorCount"><i class="fas fa-map-marker-alt" style="color:var(--primary);"></i> 8 competitors tracked</span>
                    <span class="timestamp" id="mapTimestamp">Last update: just now</span>
                </div>
                <div id="map"></div>
            </div>
            <div class="map-analysis-panel" id="mapAnalysisPanel" aria-live="polite" hidden></div>
        </div>
    `;
    return section;
}
