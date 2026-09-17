// ============================================================
// STATE MANAGEMENT
// ============================================================

import { COMPETITOR_DATA } from './data.js';

class AppState {
    constructor() {
        this.competitorData = JSON.parse(JSON.stringify(COMPETITOR_DATA));
        this.chartInstances = {};
        this.isLive = false;
        this.updateInterval = null;
        this.updateCount = 0;
        this.map = null;
        this.mapMarkers = [];
        this.mapCircles = [];
    }

    getCompetitors() {
        return this.competitorData;
    }

    setCompetitors(data) {
        this.competitorData = data;
    }

    getChart(key) {
        return this.chartInstances[key];
    }

    setChart(key, instance) {
        this.chartInstances[key] = instance;
    }

    isLiveMode() {
        return this.isLive;
    }

    setLiveMode(value) {
        this.isLive = value;
    }

    getUpdateInterval() {
        return this.updateInterval;
    }

    setUpdateInterval(interval) {
        this.updateInterval = interval;
    }

    getMap() {
        return this.map;
    }

    setMap(map) {
        this.map = map;
    }

    getMapMarkers() {
        return this.mapMarkers;
    }

    setMapMarkers(markers) {
        this.mapMarkers = markers;
    }

    getMapCircles() {
        return this.mapCircles;
    }

    setMapCircles(circles) {
        this.mapCircles = circles;
    }
}

// Singleton instance
export const appState = new AppState();

// Helper functions
export function getCompetitorData() {
    return appState.getCompetitors();
}

export function updateCompetitorData(data) {
    appState.setCompetitors(data);
}

export function getChartInstance(key) {
    return appState.getChart(key);
}

export function setChartInstance(key, instance) {
    appState.setChart(key, instance);
}