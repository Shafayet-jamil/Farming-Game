/**
 * NASA Farm Navigators - Educational Data Explainer
 * Handles the "Under the Hood" educational content
 */

window.DataExplainer = {
    currentDataset: 'smap',
    datasets: {},

    /**
     * Initialize the data explainer
     */
    init: function() {
        this.loadDatasetDefinitions();
        this.setupEventListeners();
        console.log('📚 Data Explainer initialized');
    },

    /**
     * Load dataset definitions
     */
    loadDatasetDefinitions: function() {
        this.datasets = {
            smap: {
                name: 'Soil Moisture Active Passive (SMAP)',
                shortName: 'SMAP',
                description: 'SMAP measures soil moisture content globally using advanced radar and radiometer technology. Launched in 2015, it provides crucial data for agriculture, weather forecasting, and climate research.',
                keyMetrics: [
                    { value: '36 km', label: 'Spatial Resolution', description: 'Area covered by each measurement' },
                    { value: '2-3 days', label: 'Revisit Time', description: 'How often the same location is measured' },
                    { value: '5 cm', label: 'Soil Depth', description: 'Depth of soil moisture measurement' },
                    { value: '0.04 m³/m³', label: 'Accuracy', description: 'Measurement precision' }
                ],
                howItWorks: [
                    { step: 1, title: 'L-band Radar Transmission', description: 'SMAP transmits L-band radar signals that penetrate vegetation and reach the soil surface.' },
                    { step: 2, title: 'Signal Reflection Analysis', description: 'The radar measures how much signal is reflected back, which varies with soil moisture content.' },
                    { step: 3, title: 'Radiometer Calibration', description: 'An L-band radiometer provides additional measurements to improve accuracy and resolution.' },
                    { step: 4, title: 'Data Processing', description: 'Advanced algorithms combine radar and radiometer data to produce soil moisture maps.' }
                ],
                applications: [
                    { icon: '🌾', text: 'Precision irrigation scheduling based on real soil conditions' },
                    { icon: '🌊', text: 'Flood forecasting and drought monitoring systems' },
                    { icon: '📊', text: 'Agricultural yield prediction and crop insurance' },
                    { icon: '🌍', text: 'Climate model improvement and weather forecasting' }
                ],
                caseStudy: {
                    title: 'Iowa Corn Belt Success Story',
                    location: 'Midwest United States',
                    challenge: 'Farmers struggled with irrigation timing, leading to water waste and reduced yields during variable weather patterns.',
                    solution: 'Integration of SMAP soil moisture data into farm management systems allowed for precision irrigation scheduling.',
                    results: 'Participating farms achieved 15% water savings while maintaining crop yields, demonstrating the value of satellite-guided agriculture.'
                }
            },
            imerg: {
                name: 'Integrated Multi-satellitE Retrievals for GPM (IMERG)',
                shortName: 'IMERG',
                description: 'IMERG combines precipitation data from multiple satellites to provide near-real-time global rainfall measurements. This system is crucial for agricultural water management and extreme weather monitoring.',
                keyMetrics: [
                    { value: '0.1°×0.1°', label: 'Spatial Resolution', description: 'Approximately 11 km at the equator' },
                    { value: '30 minutes', label: 'Update Frequency', description: 'How often new data is available' },
                    { value: '60°S to 60°N', label: 'Coverage Area', description: 'Geographic coverage zone' },
                    { value: '4 hours', label: 'Data Latency', description: 'Time delay for processed data' }
                ],
                howItWorks: [
                    { step: 1, title: 'Multi-Satellite Observation', description: 'Multiple satellites equipped with different sensors observe precipitation patterns globally.' },
                    { step: 2, title: 'Microwave Analysis', description: 'Passive microwave sensors detect precipitation signatures through cloud cover.' },
                    { step: 3, title: 'Infrared Correlation', description: 'Infrared sensors provide additional data to identify precipitation areas.' },
                    { step: 4, title: 'Data Integration', description: 'Advanced algorithms merge data from all sources to create comprehensive precipitation maps.' }
                ],
                applications: [
                    { icon: '💧', text: 'Real-time irrigation decision support for farmers' },
                    { icon: '⛈️', text: 'Early warning systems for floods and severe weather' },
                    { icon: '🌽', text: 'Crop water stress monitoring and yield forecasting' },
                    { icon: '🏞️', text: 'Water resource management and reservoir operations' }
                ],
                caseStudy: {
                    title: 'Indian Monsoon Management',
                    location: 'Punjab and Haryana, India',
                    challenge: 'Unpredictable monsoon patterns made it difficult for farmers to plan irrigation and planting schedules.',
                    solution: 'IMERG data helped create localized precipitation forecasts and real-time rainfall monitoring systems.',
                    results: 'Farmers could better time their planting and reduce dependency on groundwater irrigation during adequate rainfall periods.'
                }
            },
            lpdaac: {
                name: 'Land Processes Distributed Active Archive Center (LP DAAC)',
                shortName: 'LP DAAC',
                description: 'LP DAAC provides land remote sensing data from missions like MODIS, Landsat, and VIIRS. This includes vegetation indices, land surface temperature, and land cover information essential for agricultural monitoring.',
                keyMetrics: [
                    { value: '250m-1km', label: 'Spatial Resolution', description: 'MODIS data resolution range' },
                    { value: '1-2 days', label: 'Temporal Resolution', description: 'Frequency of image acquisition' },
                    { value: '36 bands', label: 'Spectral Bands', description: 'Different wavelengths captured' },
                    { value: '2000-present', label: 'Data Timeline', description: 'Continuous data availability' }
                ],
                howItWorks: [
                    { step: 1, title: 'Spectral Image Capture', description: 'Satellites capture images in multiple wavelengths including visible, near-infrared, and thermal.' },
                    { step: 2, title: 'Vegetation Analysis', description: 'NDVI is calculated using red and near-infrared bands to assess plant health.' },
                    { step: 3, title: 'Temperature Measurement', description: 'Thermal infrared bands measure land surface temperature.' },
                    { step: 4, title: 'Change Detection', description: 'Time series analysis tracks changes in vegetation and land use over time.' }
                ],
                applications: [
                    { icon: '🌱', text: 'Crop health monitoring using vegetation indices' },
                    { icon: '🌡️', text: 'Heat stress detection in agricultural areas' },
                    { icon: '📈', text: 'Yield prediction and agricultural productivity assessment' },
                    { icon: '🗺️', text: 'Land use change monitoring and precision agriculture' }
                ],
                caseStudy: {
                    title: 'California Drought Response',
                    location: 'Central Valley, California',
                    challenge: 'Severe drought conditions threatened valuable almond and grape crops, requiring precise water management.',
                    solution: 'MODIS NDVI data helped identify stressed vegetation areas, enabling targeted irrigation to preserve crop health.',
                    results: 'Growers reduced water usage by 30% while maintaining crop viability through satellite-guided precision irrigation.'
                }
            }
        };
    },

    /**
     * Setup event listeners
     */
    setupEventListeners: function() {
        // Dataset tab switching
        document.querySelectorAll('[data-dataset]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const dataset = e.target.getAttribute('data-dataset');
                this.showDataset(dataset);
            });
        });
    },

    /**
     * Show specific dataset information
     */
    showDataset: function(datasetId) {
        this.currentDataset = datasetId;
        const dataset = this.datasets[datasetId];
        
        if (!dataset) {
            console.error('Dataset not found:', datasetId);
            return;
        }

        const content = this.generateDatasetHTML(dataset);
        const container = document.getElementById('dataset-content');
        
        if (container) {
            container.innerHTML = content;
            this.addInteractiveElements();
        }

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-dataset="${datasetId}"]`)?.classList.add('active');

        console.log(`📊 Showing dataset: ${dataset.name}`);
    },

    /**
     * Generate HTML for dataset information
     */
    generateDatasetHTML: function(dataset) {
        return `
            <div class="dataset-card fade-in">
                <div class="dataset-header">
                    <h3>${dataset.name}</h3>
                    <div class="dataset-subtitle">${dataset.shortName} - NASA Earth Observation Data</div>
                </div>
                
                <div class="dataset-body">
                    <p class="dataset-description">${dataset.description}</p>
                    
                    <div class="key-metrics">
                        <h4>📊 Key Specifications</h4>
                        <div class="metrics-grid">
                            ${dataset.keyMetrics.map(metric => `
                                <div class="metric-card" data-tooltip='${JSON.stringify({
                                    title: metric.label,
                                    description: metric.description
                                })}'>
                                    <div class="metric-value">${metric.value}</div>
                                    <div class="metric-label">${metric.label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="how-it-works">
                        <h4>🛰️ How ${dataset.shortName} Works</h4>
                        <div class="process-steps">
                            ${dataset.howItWorks.map(step => `
                                <div class="step">
                                    <div class="step-number">${step.step}</div>
                                    <div class="step-content">
                                        <h5>${step.title}</h5>
                                        <p>${step.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="agricultural-applications">
                        <h4>🌾 Agricultural Applications</h4>
                        <div class="application-list">
                            ${dataset.applications.map(app => `
                                <div class="application-item">
                                    <span class="application-icon">${app.icon}</span>
                                    <span class="application-text">${app.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="case-study">
                        <div class="case-study-header">
                            <div class="case-study-title">${dataset.caseStudy.title}</div>
                            <div class="case-study-location">📍 ${dataset.caseStudy.location}</div>
                        </div>
                        <div class="case-study-content">
                            <div class="case-study-section">
                                <strong>Challenge:</strong> ${dataset.caseStudy.challenge}
                            </div>
                            <div class="case-study-section">
                                <strong>NASA Solution:</strong> ${dataset.caseStudy.solution}
                            </div>
                            <div class="case-study-results">
                                <h5>🎯 Results</h5>
                                <p>${dataset.caseStudy.results}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Add interactive elements to the dataset display
     */
    addInteractiveElements: function() {
        // Add tooltips to metric cards
        if (window.TooltipSystem) {
            window.TooltipSystem.addNASADataTooltips();
        }

        // Add click handlers for expandable sections
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        });

        // Add animations
        document.querySelectorAll('.step').forEach((step, index) => {
            step.style.animationDelay = `${index * 0.1}s`;
            step.classList.add('slide-up');
        });
    },

    /**
     * Get dataset comparison data
     */
    getComparisonData: function() {
        return Object.keys(this.datasets).map(key => {
            const dataset = this.datasets[key];
            return {
                name: dataset.shortName,
                resolution: dataset.keyMetrics.find(m => m.label.includes('Resolution'))?.value || 'N/A',
                updateFreq: dataset.keyMetrics.find(m => m.label.includes('Update') || m.label.includes('Revisit'))?.value || 'N/A',
                primaryUse: dataset.applications[0]?.text || 'Agricultural monitoring'
            };
        });
    },

    /**
     * Generate educational quiz questions
     */
    generateQuizQuestions: function(datasetId) {
        const dataset = this.datasets[datasetId];
        if (!dataset) return [];

        const questions = [];

        // Question about dataset purpose
        questions.push({
            type: 'multiple-choice',
            question: `What is the primary purpose of ${dataset.shortName}?`,
            options: [
                dataset.description.split('.')[0],
                'Weather forecasting only',
                'Ocean temperature monitoring',
                'Atmospheric composition analysis'
            ],
            correct: 0,
            explanation: dataset.description
        });

        // Question about applications
        if (dataset.applications.length > 0) {
            questions.push({
                type: 'multiple-choice',
                question: `Which of these is NOT a typical application of ${dataset.shortName} data?`,
                options: [
                    'Deep ocean exploration',
                    dataset.applications[0].text,
                    dataset.applications[1]?.text || 'Climate monitoring',
                    dataset.applications[2]?.text || 'Environmental assessment'
                ],
                correct: 0,
                explanation: `${dataset.shortName} focuses on land and atmospheric observations, not deep ocean exploration.`
            });
        }

        return questions;
    },

    /**
     * Export dataset information for teaching
     */
    exportTeachingMaterials: function(datasetId) {
        const dataset = this.datasets[datasetId];
        if (!dataset) return null;

        return {
            summary: {
                name: dataset.name,
                description: dataset.description,
                keyFacts: dataset.keyMetrics.map(m => `${m.label}: ${m.value}`)
            },
            lessonPlan: {
                objectives: [
                    `Understand how ${dataset.shortName} collects data`,
                    `Identify agricultural applications of ${dataset.shortName}`,
                    `Analyze real-world case studies using ${dataset.shortName} data`
                ],
                activities: [
                    'Interactive data exploration',
                    'Case study analysis',
                    'Hands-on farming simulation'
                ]
            },
            assessmentQuestions: this.generateQuizQuestions(datasetId)
        };
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.DataExplainer.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.DataExplainer;
}