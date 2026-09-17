// ============================================================
// CHART SERVICE - Chart.js Management
// ============================================================

import { MONTHS, TREND_DATA, RATING_TREND } from './data.js';
import { appState, getChartInstance, setChartInstance } from './state.js';

export function initCharts() {
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4F46E5';
    const secondary = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#7C3AED';
    const competitors = appState.getCompetitors();

    // Rating Chart
    const ctx1 = document.getElementById('ratingChart');
    if (ctx1) {
        setChartInstance('rating', new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: competitors.map(d => d.name),
                datasets: [
                    {
                        label: 'Rating',
                        data: competitors.map(d => d.rating),
                        backgroundColor: primary + 'B3',
                        borderColor: primary,
                        borderWidth: 2,
                        borderRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Reviews (x100)',
                        data: competitors.map(d => d.reviews / 100),
                        backgroundColor: secondary + 'B3',
                        borderColor: secondary,
                        borderWidth: 2,
                        borderRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } }
                },
                scales: {
                    y: { beginAtZero: true, max: 5, title: { display: true, text: 'Rating' } },
                    y1: {
                        position: 'right',
                        beginAtZero: true,
                        title: { display: true, text: 'Reviews (x100)' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        }));
    }

    // Revenue Chart
    const ctx2 = document.getElementById('revenueChart');
    if (ctx2) {
        setChartInstance('revenue', new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: competitors.map(d => d.name),
                datasets: [
                    {
                        label: 'Revenue (₹ Lakhs)',
                        data: competitors.map(d => d.revenue / 100000),
                        backgroundColor: 'rgba(16,185,129,0.7)',
                        borderColor: 'rgba(16,185,129,1)',
                        borderWidth: 2,
                        borderRadius: 4
                    },
                    {
                        label: 'Foot Traffic',
                        data: competitors.map(d => d.footTraffic),
                        backgroundColor: 'rgba(124,58,237,0.7)',
                        borderColor: 'rgba(124,58,237,1)',
                        borderWidth: 2,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                if (ctx.datasetIndex === 0) return `₹${ctx.parsed.y.toFixed(1)}L`;
                                return `${ctx.parsed.y} visitors`;
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Revenue (₹L) / Traffic' } }
                }
            }
        }));
    }

    // Position Chart
    const ctx3 = document.getElementById('positionChart');
    if (ctx3) {
        setChartInstance('position', new Chart(ctx3, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Competitors',
                    data: competitors.map(d => ({ x: d.reviews, y: d.rating })),
                    backgroundColor: competitors.map(d => d.status === 'Leader' ? 'rgba(16,185,129,0.8)' : d.status === 'Challenger' ? 'rgba(245,158,11,0.8)' : 'rgba(239,68,68,0.8)'),
                    borderColor: competitors.map(d => d.status === 'Leader' ? '#10B981' : d.status === 'Challenger' ? '#F59E0B' : '#EF4444'),
                    borderWidth: 2,
                    pointRadius: competitors.map(d => Math.sqrt(d.revenue) / 35 + 6)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const d = competitors[ctx.dataIndex];
                                return `${d.name}: ${d.rating.toFixed(1)}⭐ (${d.reviews} reviews)`;
                            }
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Number of Reviews' } },
                    y: { title: { display: true, text: 'Rating' }, min: 3.5, max: 5.0 }
                }
            }
        }));
    }

    // Market Share Chart
    const ctx4 = document.getElementById('marketShareChart');
    if (ctx4) {
        setChartInstance('share', new Chart(ctx4, {
            type: 'doughnut',
            data: {
                labels: competitors.map(d => d.name),
                datasets: [{
                    data: competitors.map(d => d.revenue),
                    backgroundColor: ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6'],
                    borderWidth: 3,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { padding: 15, usePointStyle: true, font: { size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                return `₹${(ctx.parsed / 100000).toFixed(1)}L (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '55%'
            }
        }));
    }

    // Trend Chart
    const ctx5 = document.getElementById('trendChart');
    if (ctx5) {
        setChartInstance('trend', new Chart(ctx5, {
            type: 'line',
            data: {
                labels: MONTHS,
                datasets: [
                    {
                        label: 'Market Growth Index',
                        data: TREND_DATA,
                        borderColor: primary,
                        backgroundColor: primary + '1A',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: primary,
                        pointRadius: 4
                    },
                    {
                        label: 'Average Rating',
                        data: RATING_TREND,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#10B981',
                        pointRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } }
                },
                scales: {
                    y: { beginAtZero: false, min: 0.8, max: 1.6, title: { display: true, text: 'Growth Index' } },
                    y1: {
                        position: 'right',
                        beginAtZero: false,
                        min: 3.8,
                        max: 4.8,
                        title: { display: true, text: 'Rating' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        }));
    }
}

export function updateCharts() {
    const competitors = appState.getCompetitors();

    const ratingChart = getChartInstance('rating');
    if (ratingChart) {
        ratingChart.data.datasets[0].data = competitors.map(d => d.rating);
        ratingChart.data.datasets[1].data = competitors.map(d => d.reviews / 100);
        ratingChart.update();
    }

    const revenueChart = getChartInstance('revenue');
    if (revenueChart) {
        revenueChart.data.datasets[0].data = competitors.map(d => d.revenue / 100000);
        revenueChart.data.datasets[1].data = competitors.map(d => d.footTraffic);
        revenueChart.update();
    }

    const positionChart = getChartInstance('position');
    if (positionChart) {
        positionChart.data.datasets[0].data = competitors.map(d => ({ x: d.reviews, y: d.rating }));
        positionChart.data.datasets[0].backgroundColor = competitors.map(d => d.status === 'Leader' ? 'rgba(16,185,129,0.8)' : d.status === 'Challenger' ? 'rgba(245,158,11,0.8)' : 'rgba(239,68,68,0.8)');
        positionChart.update();
    }

    const shareChart = getChartInstance('share');
    if (shareChart) {
        shareChart.data.datasets[0].data = competitors.map(d => d.revenue);
        shareChart.update();
    }
}