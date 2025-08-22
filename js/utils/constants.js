/**
 * NASA Farm Navigators - Constants
 * Global constants for the educational agriculture game
 */

// Game Configuration
window.GAME_CONFIG = {
    // Canvas dimensions
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Game phases
    PHASES: {
        SETUP: 'setup',
        DECISION: 'decision',
        SIMULATION: 'simulation',
        RESULTS: 'results',
        LEARNING: 'learning'
    },
    
    // Seasons
    SEASONS: ['Spring', 'Summer', 'Fall', 'Winter'],
    
    // Farm locations with their characteristics
    LOCATIONS: {
        iowa: {
            name: 'Iowa, USA',
            climate: 'Temperate Continental',
            coordinates: { lat: 42.0308, lon: -93.6319 },
            soilType: 'Prairie Soils',
            primaryCrops: ['corn', 'soybean'],
            challenges: ['Variable precipitation', 'Temperature extremes'],
            difficulty: 'beginner'
        },
        california: {
            name: 'California, USA',
            climate: 'Mediterranean',
            coordinates: { lat: 36.7783, lon: -119.4179 },
            soilType: 'Alluvial Soils',
            primaryCrops: ['almond', 'grape', 'tomato'],
            challenges: ['Water scarcity', 'Drought conditions'],
            difficulty: 'intermediate'
        },
        india: {
            name: 'Punjab, India',
            climate: 'Semi-Arid',
            coordinates: { lat: 31.1471, lon: 75.3412 },
            soilType: 'Alluvial Soils',
            primaryCrops: ['wheat', 'rice'],
            challenges: ['Monsoon variability', 'Groundwater depletion'],
            difficulty: 'advanced'
        }
    },
    
    // Crop types and their characteristics
    CROPS: {
        corn: {
            name: 'Corn',
            sprite: '🌽',
            growthTime: 120, // days
            waterNeeds: 'high',
            temperatureRange: [15, 35], // °C
            optimalSoilMoisture: [0.3, 0.6],
            baseYield: 10, // tons per hectare
            sustainabilityFactor: 0.8
        },
        soybean: {
            name: 'Soybean',
            sprite: '🌱',
            growthTime: 100,
            waterNeeds: 'medium',
            temperatureRange: [20, 30],
            optimalSoilMoisture: [0.25, 0.55],
            baseYield: 3,
            sustainabilityFactor: 0.9 // Nitrogen fixing
        },
        wheat: {
            name: 'Wheat',
            sprite: '🌾',
            growthTime: 150,
            waterNeeds: 'medium',
            temperatureRange: [12, 25],
            optimalSoilMoisture: [0.2, 0.5],
            baseYield: 5,
            sustainabilityFactor: 0.85
        },
        rice: {
            name: 'Rice',
            sprite: '🌾',
            growthTime: 130,
            waterNeeds: 'very_high',
            temperatureRange: [20, 35],
            optimalSoilMoisture: [0.8, 0.95], // Flooded conditions
            baseYield: 7,
            sustainabilityFactor: 0.7 // High methane emissions
        },
        almond: {
            name: 'Almond',
            sprite: '🥜',
            growthTime: 200,
            waterNeeds: 'high',
            temperatureRange: [15, 30],
            optimalSoilMoisture: [0.3, 0.6],
            baseYield: 2.5,
            sustainabilityFactor: 0.75
        },
        grape: {
            name: 'Grape',
            sprite: '🍇',
            growthTime: 180,
            waterNeeds: 'medium',
            temperatureRange: [18, 32],
            optimalSoilMoisture: [0.25, 0.55],
            baseYield: 15,
            sustainabilityFactor: 0.8
        },
        tomato: {
            name: 'Tomato',
            sprite: '🍅',
            growthTime: 90,
            waterNeeds: 'high',
            temperatureRange: [18, 28],
            optimalSoilMoisture: [0.4, 0.7],
            baseYield: 50,
            sustainabilityFactor: 0.85
        }
    },
    
    // Farm management options
    IRRIGATION: {
        amounts: {
            none: { value: 0, cost: 0, sustainability: 1.0 },
            low: { value: 25, cost: 10, sustainability: 0.9 },
            medium: { value: 50, cost: 20, sustainability: 0.8 },
            high: { value: 75, cost: 35, sustainability: 0.6 },
            excessive: { value: 100, cost: 50, sustainability: 0.4 }
        }
    },
    
    FERTILIZER: {
        types: {
            none: { 
                cost: 0, 
                yieldBoost: 0, 
                sustainability: 1.0, 
                description: 'No fertilizer applied'
            },
            organic: { 
                cost: 30, 
                yieldBoost: 0.15, 
                sustainability: 0.95, 
                description: 'Organic compost and natural nutrients'
            },
            synthetic: { 
                cost: 20, 
                yieldBoost: 0.3, 
                sustainability: 0.6, 
                description: 'Chemical fertilizers (NPK)'
            }
        },
        amounts: {
            light: { multiplier: 0.5, sustainability: 1.0 },
            recommended: { multiplier: 1.0, sustainability: 0.9 },
            heavy: { multiplier: 1.5, sustainability: 0.7 }
        }
    },
    
    PEST_MANAGEMENT: {
        methods: {
            none: {
                cost: 0,
                effectiveness: 0,
                sustainability: 1.0,
                description: 'No pest control'
            },
            ipm: {
                cost: 40,
                effectiveness: 0.8,
                sustainability: 0.95,
                description: 'Integrated Pest Management'
            },
            organic: {
                cost: 50,
                effectiveness: 0.6,
                sustainability: 0.9,
                description: 'Organic pesticides and biocontrol'
            },
            conventional: {
                cost: 25,
                effectiveness: 0.9,
                sustainability: 0.5,
                description: 'Synthetic pesticides'
            }
        }
    },
    
    // Sustainability scoring weights
    SUSTAINABILITY_WEIGHTS: {
        water_efficiency: 0.3,
        soil_health: 0.25,
        chemical_use: 0.2,
        yield_optimization: 0.15,
        environmental_impact: 0.1
    }
};

// NASA Data API Configuration
window.NASA_CONFIG = {
    // Base URLs for different NASA datasets
    APIS: {
        SMAP: 'https://n5eil01u.ecs.nsidc.org/DP4/SMAP',
        IMERG: 'https://gpm.nasa.gov/data/imerg',
        LP_DAAC: 'https://lpdaac.usgs.gov/products',
        EARTHDATA: 'https://earthdata.nasa.gov/earth-observation-data'
    },
    
    // Data update intervals (in milliseconds)
    UPDATE_INTERVALS: {
        soil_moisture: 3600000, // 1 hour
        precipitation: 1800000, // 30 minutes
        temperature: 3600000,   // 1 hour
        ndvi: 86400000         // 24 hours
    },
    
    // Data ranges for simulation (when real API is unavailable)
    MOCK_DATA_RANGES: {
        soil_moisture: { min: 0.1, max: 0.8 },
        precipitation: { min: 0, max: 50 }, // mm/day
        temperature: { min: -10, max: 45 }, // °C
        ndvi: { min: 0.1, max: 0.9 },
        lst: { min: -5, max: 50 } // °C
    },
    
    // Dataset information for educational content
    DATASETS: {
        SMAP: {
            name: 'Soil Moisture Active Passive',
            shortName: 'SMAP',
            description: 'Measures soil moisture content from space using radar and radiometer technology',
            launched: '2015',
            orbit: 'Sun-synchronous polar',
            resolution: '36 km',
            revisitTime: '3 days',
            applications: [
                'Drought monitoring',
                'Flood prediction',
                'Agricultural water management',
                'Weather forecasting improvement'
            ]
        },
        IMERG: {
            name: 'Integrated Multi-satellitE Retrievals for GPM',
            shortName: 'IMERG',
            description: 'Provides global precipitation measurements by combining data from multiple satellites',
            launched: '2014',
            coverage: 'Global (60°S to 60°N)',
            resolution: '0.1° x 0.1° (11 km)',
            updateFrequency: '30 minutes',
            applications: [
                'Precipitation monitoring',
                'Flood forecasting',
                'Agricultural planning',
                'Climate research'
            ]
        },
        LP_DAAC: {
            name: 'Land Processes Distributed Active Archive Center',
            shortName: 'LP DAAC',
            description: 'Archives and distributes land remote sensing data including MODIS and Landsat',
            dataTypes: ['Land Surface Temperature', 'NDVI', 'Land Cover', 'Albedo'],
            resolution: '250m to 1km',
            temporalCoverage: '2000-present',
            applications: [
                'Vegetation monitoring',
                'Land surface temperature analysis',
                'Agricultural productivity assessment',
                'Climate change studies'
            ]
        }
    }
};

// UI Configuration
window.UI_CONFIG = {
    // Animation durations
    ANIMATIONS: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
        PAGE_TRANSITION: 400
    },
    
    // Tooltip settings
    TOOLTIP: {
        SHOW_DELAY: 500,
        HIDE_DELAY: 100,
        MAX_WIDTH: 250
    },
    
    // Color schemes for data visualization
    COLOR_SCHEMES: {
        soil_moisture: ['#8B4513', '#DEB887', '#F4A460', '#87CEEB', '#1E90FF'],
        precipitation: ['#FFFFFF', '#E6F3FF', '#87CEEB', '#4682B4', '#191970'],
        temperature: ['#0000FF', '#87CEEB', '#FFFF00', '#FFA500', '#FF0000'],
        ndvi: ['#8B4513', '#F4A460', '#FFFF00', '#9AFF9A', '#228B22'],
        sustainability: ['#FF4444', '#FF8800', '#FFCC00', '#88CC00', '#44AA00']
    }
};

// Educational Content
window.EDUCATIONAL_CONTENT = {
    // Learning objectives
    OBJECTIVES: [
        'Understand how satellite data informs agricultural decisions',
        'Learn the relationship between soil moisture and crop irrigation',
        'Explore the impact of precipitation on farming practices',
        'Analyze how temperature affects crop growth and development',
        'Evaluate sustainable farming practices and their benefits'
    ],
    
    // Key concepts
    KEY_CONCEPTS: {
        soil_moisture: {
            definition: 'The amount of water stored in soil, crucial for plant growth and survival',
            importance: 'Determines irrigation needs and crop water stress levels',
            measurement: 'SMAP satellite uses radar and radiometer to measure soil moisture globally'
        },
        precipitation: {
            definition: 'Water falling from clouds as rain, snow, sleet, or hail',
            importance: 'Primary water source for rainfed agriculture and affects irrigation planning',
            measurement: 'IMERG combines multiple satellite sensors for global precipitation estimates'
        },
        ndvi: {
            definition: 'Normalized Difference Vegetation Index - measure of plant health and density',
            importance: 'Indicates crop vigor, stress, and optimal fertilization timing',
            measurement: 'Calculated from red and near-infrared light reflection from vegetation'
        },
        temperature: {
            definition: 'Land surface temperature affecting plant growth and development',
            importance: 'Influences crop growth rates, pest activity, and water evaporation',
            measurement: 'Thermal infrared sensors on satellites measure land surface temperature'
        }
    },
    
    // Case studies
    CASE_STUDIES: [
        {
            title: 'Iowa Corn Belt Water Management',
            location: 'Iowa, USA',
            challenge: 'Variable precipitation affecting corn yields',
            solution: 'Using SMAP soil moisture data to optimize irrigation timing',
            results: '15% water savings with maintained yields',
            nasaData: ['SMAP', 'IMERG']
        },
        {
            title: 'California Drought Response',
            location: 'Central Valley, California',
            challenge: 'Severe drought conditions threatening almond orchards',
            solution: 'NDVI monitoring for targeted irrigation and stress detection',
            results: '30% reduction in water use while preserving tree health',
            nasaData: ['LP DAAC', 'SMAP']
        },
        {
            title: 'Punjab Rice-Wheat System',
            location: 'Punjab, India',
            challenge: 'Groundwater depletion and sustainability concerns',
            solution: 'Integrated NASA data for crop scheduling and water management',
            results: 'Improved water use efficiency and soil health',
            nasaData: ['SMAP', 'IMERG', 'LP DAAC']
        }
    ]
};

// Export for module systems (if used)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_CONFIG,
        NASA_CONFIG,
        UI_CONFIG,
        EDUCATIONAL_CONTENT
    };
}