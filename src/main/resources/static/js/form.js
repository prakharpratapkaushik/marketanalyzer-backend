// ============================================================
// FORM COMPONENT & HANDLING - Backend API Integration
// ============================================================

import { BUSINESS_TYPES } from './data.js';
import { formatCurrency } from './utils.js';
import { getApiService } from './api-service.js';
import { displayAnalysisOnMap } from './map-service.js';

export function buildFormPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'form-popup-overlay';
    overlay.id = 'formPopupOverlay';
    overlay.innerHTML = `
        <div class="form-popup" id="formPopup">
            <button class="form-popup-close" onclick="window.closeFormPopup()">
                <i class="fas fa-times"></i>
            </button>
            <h3 class="form-title">📊 Market Analysis Request</h3>
            <p class="form-subtitle">Provide your business details and we'll analyze the competition in your area</p>

            <div id="formLoading" style="display:none;text-align:center;padding:20px;">
                <i class="fas fa-spinner fa-spin" style="font-size:2rem;color:var(--primary);"></i>
                <p style="margin-top:10px;color:var(--gray-500);">Submitting your analysis request...</p>
            </div>

            <form id="popupMarketForm" onsubmit="window.handleFormSubmit(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="popupBusinessName">Business Name <span style="color:#EF4444;">*</span></label>
                        <input type="text" class="form-control" id="popupBusinessName" placeholder="Enter your business name" required>
                        <div class="form-help">Enter the name of your business</div>
                    </div>
                    <div class="form-group">
                        <label for="popupBusinessType">Business Type <span style="color:#EF4444;">*</span></label>
                        <select class="form-control" id="popupBusinessType" required>
                            <option value="">Select business type...</option>
                            ${BUSINESS_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                        <div class="form-help">Select the category that best describes your business</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="popupBusinessLocation">Business Location <span style="color:#EF4444;">*</span></label>
                        <input type="text" class="form-control" id="popupBusinessLocation" placeholder="e.g., Mumbai, India" required>
                        <div class="form-help">Enter your city or specific area</div>
                    </div>
                    <div class="form-group">
                        <label for="popupSearchRadius">Search Radius (km) <span style="color:#EF4444;">*</span></label>
                        <div class="radius-slider-wrapper">
                            <input type="range" class="range-input" id="popupSearchRadius" min="1" max="50" value="5" oninput="window.updateRadiusDisplay(this.value)">
                            <div class="radius-display">
                                <span class="value" id="popupRadiusDisplayValue">5</span>
                                <span class="unit">km</span>
                            </div>
                        </div>
                        <div class="radius-range-labels">
                            <span>1 km</span><span>25 km</span><span>50 km</span>
                        </div>
                        <div class="form-help">How far from your location to search for competitors</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="popupCompetitorCount">Expected Competitors</label>
                        <input type="number" class="form-control" id="popupCompetitorCount" placeholder="e.g., 5" min="0" value="8">
                        <div class="form-help">How many competitors do you expect in your area?</div>
                    </div>
                    <div class="form-group">
                        <label for="popupBudgetRange">Estimated Budget (₹) <span style="color:#EF4444;">*</span></label>
                        <div class="budget-range-wrapper">
                            <input type="range" class="range-input" id="popupBudgetRange" min="0" max="100" value="30" oninput="window.updateBudgetDisplay(this.value)">
                            <div class="budget-display">
                                <span class="currency">₹</span>
                                <span class="amount" id="popupBudgetAmount">50K</span>
                            </div>
                        </div>
                        <div class="budget-range-labels">
                            <span>₹0</span><span>₹50K</span><span>₹2L</span><span>₹5L</span><span>₹10L+</span>
                        </div>
                        <div class="form-help">Slide to select your estimated budget range</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="popupCompetitionLevel">Perceived Competition Level</label>
                        <select class="form-control" id="popupCompetitionLevel">
                            <option value="Low">Low</option>
                            <option value="Moderate" selected>Moderate</option>
                            <option value="High">High</option>
                            <option value="Very High">Very High</option>
                        </select>
                        <div class="form-help">How competitive do you think your market is?</div>
                    </div>
                    <div class="form-group">
                        <label for="popupAdditionalInfo">Additional Information</label>
                        <textarea class="form-control" id="popupAdditionalInfo" placeholder="Any specific requirements or areas of interest..."></textarea>
                        <div class="form-help">Share any additional details that might help with the analysis</div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Analysis Preferences</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" checked> Include Reviews Analysis</label>
                        <label><input type="checkbox" checked> Include Foot Traffic</label>
                        <label><input type="checkbox" checked> Include Pricing Insights</label>
                        <label><input type="checkbox" checked> Email Results</label>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-submit" id="formSubmitBtn">
                        <i class="fas fa-chart-line"></i> Analyze Market
                    </button>
                    <button type="reset" class="btn-reset" onclick="window.resetForm()">Clear Form</button>
                </div>
                <div class="form-success" id="formSuccess">
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Analysis Request Submitted!</h3>
                    <p>We're analyzing the competition in your area. You'll receive results shortly.</p>
                    <p style="font-size:0.85rem;color:var(--gray-500);margin-top:0.5rem;">
                        <span id="requestIdDisplay"></span>
                    </p>
                </div>
                <div class="analysis-summary" id="popupAnalysisSummary">
                    <h4><i class="fas fa-chart-pie"></i> Market Analysis Summary</h4>
                    <div class="summary-grid" id="popupSummaryGrid"></div>
                </div>
            </form>
        </div>
    `;
    return overlay;
}

window.openFormPopup = function() {
    const overlay = document.getElementById('formPopupOverlay');
    if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

window.closeFormPopup = function() {
    const overlay = document.getElementById('formPopupOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
};

window.resetForm = function() {
    const form = document.getElementById('popupMarketForm');
    if (form) form.reset();

    const success = document.getElementById('formSuccess');
    if (success) success.classList.remove('visible');

    const summary = document.querySelector('#formPopup .analysis-summary');
    if (summary) summary.classList.remove('visible');

    const loading = document.getElementById('formLoading');
    if (loading) loading.style.display = 'none';

    const submitBtn = document.getElementById('formSubmitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-chart-line"></i> Analyze Market';
        submitBtn.disabled = false;
    }

    if (typeof window.updateRadiusDisplay === 'function') window.updateRadiusDisplay(5);
    if (typeof window.updateBudgetDisplay === 'function') window.updateBudgetDisplay(30);
};

window.updateRadiusDisplay = function(value) {
    const display = document.getElementById('popupRadiusDisplayValue');
    if (display) display.textContent = value;
};

window.updateBudgetDisplay = function(value) {
    const val = parseInt(value);
    let displayText = '', amount = 0;
    if (val === 0) { displayText = '0'; amount = 0; }
    else if (val <= 20) { displayText = Math.round((val / 20) * 50) + 'K'; amount = Math.round((val / 20) * 50) * 1000; }
    else if (val <= 40) { const vk = 50 + Math.round(((val - 20) / 20) * 150); displayText = vk + 'K'; amount = vk * 1000; }
    else if (val <= 70) { const vl = 2 + Math.round(((val - 40) / 30) * 3); displayText = vl + 'L'; amount = vl * 100000; }
    else if (val <= 90) { const vl = 5 + Math.round(((val - 70) / 20) * 5); displayText = vl + 'L'; amount = vl * 100000; }
    else { displayText = '10L+'; amount = 1000000; }

    const budgetDisplay = document.getElementById('popupBudgetAmount');
    if (budgetDisplay) {
        budgetDisplay.textContent = displayText;
        budgetDisplay.dataset.value = amount;
    }
};

window.handleFormSubmit = async function(e) {
    e.preventDefault();

    const businessName = document.getElementById('popupBusinessName')?.value?.trim() || '';
    const businessType = document.getElementById('popupBusinessType')?.value || '';
    const location = document.getElementById('popupBusinessLocation')?.value?.trim() || '';
    const radius = document.getElementById('popupSearchRadius')?.value || '5';
    const competitorCount = document.getElementById('popupCompetitorCount')?.value || '8';
    const budgetValue = document.getElementById('popupBudgetAmount')?.dataset?.value || '50000';
    const competitionLevel = document.getElementById('popupCompetitionLevel')?.value || 'Moderate';
    const additionalInfo = document.getElementById('popupAdditionalInfo')?.value?.trim() || '';

    let isValid = true;
    ['popupBusinessName', 'popupBusinessType', 'popupBusinessLocation'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (!el.value?.trim()) { el.classList.add('error'); el.classList.remove('success'); isValid = false; }
            else { el.classList.remove('error'); el.classList.add('success'); }
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields (*)');
        return;
    }

    const submitBtn = document.getElementById('formSubmitBtn');
    const loadingDiv = document.getElementById('formLoading');

    if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'; submitBtn.disabled = true; }
    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        const requestData = {
            businessName, businessType, location,
            radius: parseFloat(radius),
            competitorCount: parseInt(competitorCount) || 10,
            budget: parseFloat(budgetValue),
            competitionLevel, additionalInfo
        };

        const apiService = getApiService();
        const response = await apiService.requestAnalysis(requestData);

        const successDiv = document.getElementById('formSuccess');
        if (successDiv) successDiv.classList.add('visible');

        const requestIdDisplay = document.getElementById('requestIdDisplay');
        if (requestIdDisplay) {
            requestIdDisplay.textContent = `Request ID: ${response.id || 'Processing...'}`;
        }

        // The current API completes the analysis synchronously. Show the returned
        // decision data immediately, while keeping the request-only summary for
        // any future asynchronous responses.
        if (response.status === 'COMPLETED' && hasAnalysisResults(response)) {
            updateSummaryWithFullResults(response);
            displayAnalysisOnMap(response);
            if (successDiv) {
                successDiv.querySelector('h3').textContent = 'Market Analysis Complete!';
                successDiv.querySelector('p').textContent = 'Your location scores and recommendations are ready.';
            }
        } else {
            generateAnalysisSummaryFromAPI(response, requestData);
        }

        if (response.id) {
            localStorage.setItem('lastAnalysisId', response.id);
            localStorage.setItem(`analysis_${response.id}`, JSON.stringify(requestData));
        }

        if (response.status === 'PROCESSING' || response.status === 'PENDING') {
            startPollingResults(response.id);
        }

    } catch (error) {
        console.error('Analysis submission failed:', error);
        alert(`Failed to submit analysis: ${error.message || 'Please try again'}`);

        const form = document.getElementById('popupMarketForm');
        if (form) {
            const existingError = form.querySelector('.form-error');
            if (existingError) existingError.remove();

            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = 'background:#FEE2E2;color:#DC2626;padding:12px;border-radius:8px;margin-top:12px;text-align:center;';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message || 'Failed to submit request. Please try again.'}`;
            form.appendChild(errorDiv);

            setTimeout(() => { if (errorDiv.parentNode) errorDiv.remove(); }, 5000);
        }

    } finally {
        if (submitBtn) { submitBtn.innerHTML = '<i class="fas fa-chart-line"></i> Analyze Market'; submitBtn.disabled = false; }
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
};

let pollInterval = null;

function startPollingResults(requestId) {
    if (pollInterval) clearInterval(pollInterval);

    let attempts = 0;
    const maxAttempts = 60;

    pollInterval = setInterval(async () => {
        attempts++;
        try {
            const apiService = getApiService();
            const result = await apiService.getAnalysisResult(requestId);

            if (result.status === 'COMPLETED') {
                clearInterval(pollInterval); pollInterval = null;
                updateSummaryWithFullResults(result);
                displayAnalysisOnMap(result);
            } else if (result.status === 'FAILED') {
                clearInterval(pollInterval); pollInterval = null;
                showAnalysisError(result);
            }

            updatePollingProgress(attempts, maxAttempts, result);

        } catch (error) {
            console.warn('Polling error:', error);
            if (attempts >= maxAttempts) {
                clearInterval(pollInterval); pollInterval = null;
                alert('Analysis is taking longer than expected. Please check back later.');
            }
        }
    }, 5000);
}

function updatePollingProgress(attempts, maxAttempts, result) {
    let progressEl = document.getElementById('pollingProgress');
    if (!progressEl) {
        const summaryGrid = document.getElementById('popupSummaryGrid');
        if (summaryGrid) {
            progressEl = document.createElement('div');
            progressEl.id = 'pollingProgress';
            progressEl.className = 'summary-item';
            progressEl.style.gridColumn = '1 / -1';
            progressEl.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;">
                    <i class="fas fa-spinner fa-spin" style="color:var(--primary);"></i>
                    <span>Processing analysis... ${Math.round((attempts / maxAttempts) * 100)}%</span>
                </div>
                <div style="width:100%;height:4px;background:var(--gray-200);border-radius:2px;margin-top:6px;overflow:hidden;">
                    <div style="width:${(attempts / maxAttempts) * 100}%;height:100%;background:linear-gradient(90deg,var(--primary),var(--secondary));border-radius:2px;transition:width 0.5s;"></div>
                </div>
            `;
            summaryGrid.appendChild(progressEl);
        }
    } else {
        const bar = progressEl.querySelector('div:last-child div');
        if (bar) bar.style.width = `${(attempts / maxAttempts) * 100}%`;
        const text = progressEl.querySelector('span');
        if (text && result) {
            text.textContent = result.status === 'COMPLETED' ? 'Complete!' :
                result.status === 'PROCESSING' ? 'Analyzing data...' :
                    `Processing... ${Math.round((attempts / maxAttempts) * 100)}%`;
        }
    }
}

function hasAnalysisResults(result) {
    return ['demandScore', 'competitionScore', 'affordabilityScore', 'finalScore', 'successProbability']
        .some(key => Number.isFinite(Number(result?.[key])));
}

function formatScore(value) {
    const score = Number(value);
    if (!Number.isFinite(score)) return '—';
    // The prediction service returns values from 0–1; accepting 0–100 keeps
    // the UI compatible with percentage values returned by other model versions.
    const percentage = score <= 1 ? score * 100 : score;
    return `${Math.max(0, Math.min(100, percentage)).toFixed(2)}%`;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
}

function addSummaryItem(grid, item) {
    const div = document.createElement('div');
    div.className = `summary-item${item.featured ? ' summary-item-featured' : ''}`;
    div.innerHTML = `<div class="value">${escapeHtml(item.value)}</div><div class="label">${escapeHtml(item.label)}</div>`;
    grid.appendChild(div);
}

function updateSummaryWithFullResults(result) {
    const grid = document.getElementById('popupSummaryGrid');
    if (!grid) return;

    const progress = document.getElementById('pollingProgress');
    if (progress) progress.remove();

    grid.innerHTML = '';

    let competitors = [];
    try {
        if (result.analysisResult) {
            const parsed = typeof result.analysisResult === 'string' ? JSON.parse(result.analysisResult) : result.analysisResult;
            competitors = parsed.competitors || [];
        } else if (result.competitors) {
            competitors = result.competitors;
        }
    } catch (e) {
        console.warn('Could not parse competitor data:', e);
    }

    const items = [
        { label: 'Demand Score', value: formatScore(result.demandScore) },
        { label: 'Competition Score', value: formatScore(result.competitionScore) },
        { label: 'Affordability', value: formatScore(result.affordabilityScore) },
        { label: 'Final Score', value: formatScore(result.finalScore), featured: true },
        { label: 'Success Probability', value: formatScore(result.successProbability), featured: true }
    ];

    items.forEach(item => addSummaryItem(grid, item));

    const insights = Array.isArray(result.insights) ? result.insights : [];
    if (insights.length) {
        const div = document.createElement('div');
        div.className = 'analysis-insights';
        div.innerHTML = `
            <h5><i class="fas fa-lightbulb"></i> Insights</h5>
            <ul>${insights.map(insight => `<li>${escapeHtml(insight).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}</ul>
        `;
        grid.appendChild(div);
    }

    const context = document.createElement('p');
    context.className = 'analysis-context';
    context.textContent = `${result.businessType || 'Business'} · ${result.location || 'Selected location'} · ${competitors.length} competitor${competitors.length === 1 ? '' : 's'} found`;
    grid.appendChild(context);

    const existingBtns = grid.parentElement?.querySelector('.summary-actions');
    if (existingBtns) existingBtns.remove();

    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'summary-actions';
    actionsWrapper.innerHTML = `
        <button class="btn-action btn-print" onclick="window.printAnalysisSummary()"><i class="fas fa-print"></i> Print</button>
        <button class="btn-action btn-download" onclick="window.downloadAnalysisSummary()"><i class="fas fa-download"></i> Download</button>
        <button class="btn-action" style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:white;box-shadow:0 4px 15px rgba(79,70,229,0.3);" onclick="window.viewFullReport()"><i class="fas fa-file-alt"></i> Full Report</button>
    `;
    grid.appendChild(actionsWrapper);

    const summary = document.getElementById('popupAnalysisSummary');
    if (summary) summary.classList.add('visible');
}

function showAnalysisError(result) {
    const grid = document.getElementById('popupSummaryGrid');
    if (!grid) return;

    const progress = document.getElementById('pollingProgress');
    if (progress) progress.remove();

    const div = document.createElement('div');
    div.className = 'summary-item';
    div.style.gridColumn = '1 / -1';
    div.style.background = '#FEE2E2';
    div.style.border = '2px solid #EF4444';
    div.innerHTML = `
        <div style="color:#DC2626;font-size:1.2rem;"><i class="fas fa-exclamation-triangle"></i> Analysis Failed</div>
        <div style="color:#64748B;font-size:0.9rem;">${result.errorMessage || 'Please try again or contact support.'}</div>
    `;
    grid.appendChild(div);
}

function generateAnalysisSummaryFromAPI(response, requestData) {
    const grid = document.getElementById('popupSummaryGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const items = [
        { label: 'Business Name', value: requestData?.businessName || response.businessName || 'Not specified' },
        { label: 'Business Type', value: requestData?.businessType || response.businessType || 'Not specified' },
        { label: 'Location', value: requestData?.location || response.location || 'Not specified' },
        { label: 'Search Radius', value: `${requestData?.radius || response.searchRadius || '5'} km` },
        { label: 'Request Status', value: response.status || 'Processing' },
        { label: 'Request ID', value: response.id ? response.id.slice(0, 8) : 'N/A' }
    ];

    if (requestData?.budget) {
        items.splice(4, 0, { label: 'Estimated Budget', value: formatCurrency(requestData.budget) });
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `<div class="value">${item.value}</div><div class="label">${item.label}</div>`;
        grid.appendChild(div);
    });

    const summary = document.getElementById('popupAnalysisSummary');
    if (summary) summary.classList.add('visible');
}

window.printAnalysisSummary = function() {
    // Print function - full implementation from original
    alert('Print functionality available in full version');
};

window.downloadAnalysisSummary = function() {
    // Download function - full implementation from original
    alert('Download functionality available in full version');
};

window.viewFullReport = function() {
    const requestId = localStorage.getItem('lastAnalysisId');
    if (requestId) {
        window.open(`/report/${requestId}`, '_blank');
    } else {
        alert('No analysis report available. Please submit a request first.');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('formPopupOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) window.closeFormPopup();
        });
    }
});
