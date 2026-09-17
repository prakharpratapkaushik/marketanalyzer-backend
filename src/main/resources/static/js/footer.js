// ============================================================
// FOOTER COMPONENT
// ============================================================

export function buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-brand">
                <h3><i class="fas fa-chart-line" style="color:var(--primary);"></i> MarketAnalyzer</h3>
                <p>Next-generation competitive market intelligence platform powered by AI.</p>
            </div>
            <div class="footer-links">
                <h4>Platform</h4>
                <a href="#map-section">Market Map</a>
                <a href="#analytics">Analytics</a>
                <a href="#" onclick="event.preventDefault(); window.openFormPopup();">Market Analysis</a>
            </div>
            <div class="footer-links">
                <h4>Features</h4>
                <a href="#">Data Collection</a>
                <a href="#">Geospatial AI</a>
                <a href="#">ML Predictions</a>
                <a href="#">Market Analysis</a>
            </div>
            <div class="footer-links">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">API Reference</a>
                <a href="#">Support</a>
                <a href="#">About Us</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 MarketAnalyzer Pro — Built with ❤️ using Python, FastAPI & React</p>
        </div>
    `;
    return footer;
}