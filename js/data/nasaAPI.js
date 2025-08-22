/**
 * NASA Farm Navigators - NASA API Integration
 * Handles communication with NASA data services and mock data generation
 */

window.NASAAPI = {
    // Data cache to avoid excessive API calls
    cache: new Map(),
    
    // Cache duration in milliseconds
    cacheDuration: 30 * 60 * 1000, // 30 minutes
    
    // API endpoints (using mock data for demo)
    endpoints: {
        smap: 'https://n5eil01u.ecs.nsidc.org/egi/request',
        imerg: 'https://gpm.nasa.gov/GPMdata',
        modis: 'https://lpdaac.usgs.gov/products'
    },
    
    /**
     * Initialize the NASA API connection
     */
    init: function() {
        console.log('🛰️ Initializing NASA API connections...');
        this.checkConnections();
    },

    /**
     * Check if NASA APIs are available
     */
    checkConnections: async function() {
        // In a real implementation, this would ping the actual NASA services
        // For this demo, we'll simulate the connection check
        try {
            // Simulate network check
            await this.simulateNetworkDelay(500);
            
            this.connectionStatus = {
                smap: true,
                imerg: true,
                lpdaac: true,
                lastCheck: Date.now()
            };
            
            console.log('✅ NASA API connections established');
            return true;
        } catch (error) {
            console.warn('⚠️ NASA APIs unavailable, using simulated data:', error);
            this.connectionStatus = {
                smap: false,
                imerg: false,
                lpdaac: false,
                lastCheck: Date.now(),
                error: error.message
            };
            return false;
        }
    },

    /**
     * Get SMAP soil moisture data
     */
    getSMAPData: async function(latitude, longitude, date = new Date()) {
        const cacheKey = `smap_${latitude}_${longitude}_${date.toDateString()}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }
        }

        try {
            // In production, this would make actual API calls to SMAP
            // For demo, we generate realistic mock data
            const mockData = this.generateSMAPMockData(latitude, longitude, date);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: mockData,
                timestamp: Date.now()
            });
            
            return mockData;
        } catch (error) {
            console.error('Failed to fetch SMAP data:', error);
            throw new Error('SMAP data unavailable');
        }
    },

    /**
     * Get IMERG precipitation data
     */
    getIMERGData: async function(latitude, longitude, date = new Date()) {
        const cacheKey = `imerg_${latitude}_${longitude}_${date.toDateString()}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }
        }

        try {
            const mockData = this.generateIMERGMockData(latitude, longitude, date);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: mockData,
                timestamp: Date.now()
            });
            
            return mockData;
        } catch (error) {
            console.error('Failed to fetch IMERG data:', error);
            throw new Error('IMERG data unavailable');
        }
    },

    /**
     * Get MODIS/LP DAAC data (NDVI, LST)
     */
    getLPDAACData: async function(latitude, longitude, date = new Date()) {
        const cacheKey = `lpdaac_${latitude}_${longitude}_${date.toDateString()}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }
        }

        try {
            const mockData = this.generateLPDAACMockData(latitude, longitude, date);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: mockData,
                timestamp: Date.now()
            });
            
            return mockData;
        } catch (error) {
            console.error('Failed to fetch LP DAAC data:', error);
            throw new Error('LP DAAC data unavailable');
        }
    },

    /**
     * Get all NASA data for a location
     */
    getAllData: async function(latitude, longitude, date = new Date()) {
        try {
            console.log(`🛰️ Fetching NASA data for ${latitude}, ${longitude}`);
            
            // Fetch all datasets in parallel
            const [smapData, imergData, lpdaacData] = await Promise.all([
                this.getSMAPData(latitude, longitude, date),
                this.getIMERGData(latitude, longitude, date),
                this.getLPDAACData(latitude, longitude, date)
            ]);

            const combinedData = {
                location: { latitude, longitude },
                date: date,
                smap: smapData,
                imerg: imergData,
                lpdaac: lpdaacData,
                timestamp: Date.now()
            };

            console.log('✅ NASA data retrieved:', combinedData);
            return combinedData;
        } catch (error) {
            console.error('Failed to fetch NASA data:', error);
            throw error;
        }
    },

    /**
     * Generate realistic SMAP mock data
     */
    generateSMAPMockData: function(lat, lon, date) {
        // Simulate network delay
        const delay = GameHelpers.randomInt(200, 800);
        
        // Base soil moisture varies by season and location
        const season = GameHelpers.getCurrentSeason(date);
        const seasonMultipliers = {
            'Spring': 0.8,
            'Summer': 0.5,
            'Fall': 0.7,
            'Winter': 0.9
        };
        
        // Location-based adjustments
        let baseValue = 0.35;
        if (lat > 40) baseValue *= 1.2; // Higher latitudes tend to be wetter
        if (Math.abs(lon) > 100) baseValue *= 0.8; // Inland areas
        
        const seasonalValue = baseValue * seasonMultipliers[season];
        const variation = GameHelpers.randomRange(-0.15, 0.15);
        const soilMoisture = GameHelpers.clamp(seasonalValue + variation, 0.05, 0.8);
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    soilMoisture: Number(soilMoisture.toFixed(3)),
                    units: 'volumetric',
                    quality: 'good',
                    uncertainty: Number((soilMoisture * 0.1).toFixed(3)),
                    retrievalTime: date.toISOString(),
                    satellite: 'SMAP',
                    resolution: '36km',
                    metadata: {
                        algorithm: 'L3_SM_P',
                        version: '6',
                        processingLevel: 'L3'
                    }
                });
            }, delay);
        });
    },

    /**
     * Generate realistic IMERG mock data
     */
    generateIMERGMockData: function(lat, lon, date) {
        const delay = GameHelpers.randomInt(150, 600);
        
        const season = GameHelpers.getCurrentSeason(date);
        const seasonMultipliers = {
            'Spring': 1.2,
            'Summer': 0.8,
            'Fall': 1.0,
            'Winter': 1.1
        };
        
        // Base precipitation varies by latitude (tropical vs temperate)
        let baseValue = 2.5;
        if (Math.abs(lat) < 30) baseValue *= 1.8; // Tropical regions
        if (Math.abs(lat) > 50) baseValue *= 0.7; // High latitudes
        
        const seasonalValue = baseValue * seasonMultipliers[season];
        const dailyVariation = GameHelpers.randomRange(0, seasonalValue * 2);
        const precipitation = Math.max(0, dailyVariation);
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    precipitation: Number(precipitation.toFixed(2)),
                    units: 'mm/hr',
                    precipitationType: precipitation > 5 ? 'rain' : 'light',
                    quality: 'good',
                    uncertainty: Number((precipitation * 0.15).toFixed(2)),
                    observationTime: date.toISOString(),
                    satellite: 'GPM',
                    resolution: '0.1deg',
                    metadata: {
                        algorithm: 'IMERG',
                        version: '06B',
                        latency: 'Early'
                    }
                });
            }, delay);
        });
    },

    /**
     * Generate realistic LP DAAC mock data
     */
    generateLPDAACMockData: function(lat, lon, date) {
        const delay = GameHelpers.randomInt(300, 1000);
        
        const season = GameHelpers.getCurrentSeason(date);
        const seasonMultipliers = {
            'Spring': { ndvi: 0.7, temp: 0.8 },
            'Summer': { ndvi: 0.9, temp: 1.2 },
            'Fall': { ndvi: 0.6, temp: 0.9 },
            'Winter': { ndvi: 0.3, temp: 0.5 }
        };
        
        const multiplier = seasonMultipliers[season];
        
        // NDVI varies by season and agricultural activity
        const baseNDVI = 0.6;
        const seasonalNDVI = baseNDVI * multiplier.ndvi;
        const ndviVariation = GameHelpers.randomRange(-0.2, 0.2);
        const ndvi = GameHelpers.clamp(seasonalNDVI + ndviVariation, 0.1, 0.9);
        
        // Land Surface Temperature varies by latitude and season
        let baseTemp = 20;
        if (Math.abs(lat) < 30) baseTemp = 28; // Tropical
        else if (Math.abs(lat) > 50) baseTemp = 12; // High latitude
        
        const seasonalTemp = baseTemp * multiplier.temp;
        const tempVariation = GameHelpers.randomRange(-8, 12);
        const landSurfaceTemp = seasonalTemp + tempVariation;
        
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    ndvi: Number(ndvi.toFixed(3)),
                    landSurfaceTemperature: Number(landSurfaceTemp.toFixed(1)),
                    units: {
                        ndvi: 'index',
                        temperature: 'celsius'
                    },
                    quality: 'good',
                    cloudCover: GameHelpers.randomInt(0, 30),
                    observationTime: date.toISOString(),
                    satellite: 'Terra/Aqua MODIS',
                    resolution: '1km',
                    metadata: {
                        product: 'MOD13Q1',
                        version: '6',
                        processingLevel: 'L3'
                    }
                });
            }, delay);
        });
    },

    /**
     * Get historical data for trend analysis
     */
    getHistoricalData: async function(latitude, longitude, startDate, endDate) {
        const historicalData = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            try {
                const data = await this.getAllData(latitude, longitude, new Date(currentDate));
                historicalData.push(data);
            } catch (error) {
                console.warn(`Failed to get data for ${currentDate}:`, error);
            }
            
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return historicalData;
    },

    /**
     * Get data quality information
     */
    getDataQuality: function() {
        return {
            smap: {
                status: this.connectionStatus?.smap ? 'operational' : 'simulated',
                lastUpdate: new Date().toISOString(),
                coverage: 'global',
                resolution: '36 km',
                accuracy: '0.04 m³/m³'
            },
            imerg: {
                status: this.connectionStatus?.imerg ? 'operational' : 'simulated',
                lastUpdate: new Date().toISOString(),
                coverage: '60°S to 60°N',
                resolution: '0.1° x 0.1°',
                latency: '4 hours'
            },
            lpdaac: {
                status: this.connectionStatus?.lpdaac ? 'operational' : 'simulated',
                lastUpdate: new Date().toISOString(),
                coverage: 'global',
                resolution: '250m to 1km',
                revisitTime: '1-2 days'
            }
        };
    },

    /**
     * Clear data cache
     */
    clearCache: function() {
        this.cache.clear();
        console.log('NASA data cache cleared');
    },

    /**
     * Get cache statistics
     */
    getCacheStats: function() {
        const now = Date.now();
        let activeEntries = 0;
        let expiredEntries = 0;
        
        this.cache.forEach((value) => {
            if (now - value.timestamp < this.cacheDuration) {
                activeEntries++;
            } else {
                expiredEntries++;
            }
        });
        
        return {
            total: this.cache.size,
            active: activeEntries,
            expired: expiredEntries,
            cacheHitRatio: activeEntries / (activeEntries + expiredEntries) || 0
        };
    },

    /**
     * Simulate network delay for realistic API behavior
     */
    simulateNetworkDelay: function(minMs = 200, maxMs = 1000) {
        const delay = GameHelpers.randomInt(minMs, maxMs);
        return new Promise(resolve => setTimeout(resolve, delay));
    }
};

// Initialize NASA API when the module loads
document.addEventListener('DOMContentLoaded', function() {
    window.NASAAPI.init();
});

// Export for module systems (if used)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.NASAAPI;
}