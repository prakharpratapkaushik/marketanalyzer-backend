// ============================================================
// CHARTS COMPONENT
// ============================================================

export function buildAnalytics() {
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'analytics';
    section.innerHTML = `
        <div class="container">
            <div class="section-header animate-fade-in">
                <div class="subtitle">Data Visualization</div>
                <h2>Advanced Analytics</h2>
                <p>Comprehensive charts and insights for strategic decision making</p>
            </div>
            <div class="grid-2">
                <div class="chart-card animate-fade-in">
                    <div class="chart-header">
                        <h3><i class="fas fa-star" style="color:var(--warning);"></i> Rating & Review Analysis</h3>
                        <span class="chart-badge">Performance</span>
                    </div>
                    <div class="chart-container"><canvas id="ratingChart"></canvas></div>
                </div>
                <div class="chart-card animate-fade-in">
                    <div class="chart-header">
                        <h3><i class="fas fa-rupee-sign" style="color:var(--success);"></i> Revenue & Foot Traffic</h3>
                        <span class="chart-badge">Revenue</span>
                    </div>
                    <div class="chart-container"><canvas id="revenueChart"></canvas></div>
                </div>
            </div>
            <div class="grid-2 mt-2">
                <div class="chart-card animate-fade-in">
                    <div class="chart-header">
                        <h3><i class="fas fa-chess-board" style="color:var(--secondary);"></i> Market Position Matrix</h3>
                        <span class="chart-badge">Positioning</span>
                    </div>
                    <div class="chart-container-large"><canvas id="positionChart"></canvas></div>
                </div>
                <div class="chart-card animate-fade-in">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-pie" style="color:var(--accent);"></i> Market Share Distribution</h3>
                        <span class="chart-badge">Share</span>
                    </div>
                    <div class="chart-container-large"><canvas id="marketShareChart"></canvas></div>
                </div>
            </div>
            <div class="chart-card animate-fade-in mt-2">
                <div class="chart-header">
                    <h3><i class="fas fa-chart-line" style="color:var(--primary);"></i> Market Growth Trends</h3>
                    <span class="chart-badge">12-Month Projection</span>
                </div>
                <div class="chart-container"><canvas id="trendChart"></canvas></div>
            </div>
        </div>
    `;
    return section;
}