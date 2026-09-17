// ============================================================
// FEATURES COMPONENT
// ============================================================

import { FEATURES } from './data.js';

export function buildFeatures() {
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'features';
    section.innerHTML = `
        <div class="container">
            <div class="section-header animate-fade-in">
                <div class="subtitle">Platform Capabilities</div>
                <h2>Powerful Features</h2>
                <p>Everything you need for comprehensive market analysis</p>
            </div>
            <div class="grid-3">
                ${FEATURES.map((f, i) => `
                    <div class="feature-card animate-fade-in">
                        <div class="feature-icon"><i class="fas ${f.icon}"></i></div>
                        <h3>${f.title}</h3>
                        <p>${f.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    return section;
}