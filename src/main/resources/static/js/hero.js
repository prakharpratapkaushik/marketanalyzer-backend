// ============================================================
// HERO COMPONENT
// ============================================================

export function buildHero() {
    const hero = document.createElement('section');
    hero.className = 'hero';
    hero.innerHTML = `
        <div class="hero-content">
            <h1>Competitive Market <br><span class="highlight">Analysis Platform</span></h1>
            <p>Gain real-time insights into your market landscape. Identify competitors, analyze performance metrics, and make data-driven decisions with AI-powered intelligence.</p>
            <div class="hero-actions">
                <button class="btn-primary" onclick="window.openFormPopup()">
                    <i class="fas fa-search"></i> Analyze Your Market
                </button>
            </div>
        </div>
    `;
    return hero;
}