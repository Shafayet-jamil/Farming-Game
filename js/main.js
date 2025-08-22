/**
 * NASA Farm Navigators - Main Application
 * Entry point and main application controller
 */

window.FarmNavigators = {
    // Application state
    currentScreen: 'loading-screen',
    gameState: null,
    nasaData: null,
    
    // DOM elements
    elements: {},

    /**
     * Initialize the application
     */
    init: function() {
        console.log('🌱 NASA Farm Navigators - Starting up...');
        
        this.cacheElements();
        this.setupEventListeners();
        this.showLoadingScreen();
        
        // Initialize game systems
        this.initializeGameSystems();
    },

    /**
     * Cache frequently used DOM elements
     */
    cacheElements: function() {
        this.elements = {
            // Screens
            loadingScreen: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            gameScreen: document.getElementById('game-screen'),
            dataExplainerScreen: document.getElementById('data-explainer-screen'),
            teacherModeScreen: document.getElementById('teacher-mode-screen'),
            
            // Main menu buttons
            startGameBtn: document.getElementById('start-game'),
            tutorialBtn: document.getElementById('tutorial-btn'),
            dataExplainerBtn: document.getElementById('data-explainer-btn'),
            teacherModeBtn: document.getElementById('teacher-mode-btn'),
            
            // Game elements
            farmCanvas: document.getElementById('farm-canvas'),
            phaseIndicator: document.getElementById('phase-indicator'),
            sustainabilityValue: document.getElementById('sustainability-value'),
            scoreFill: document.getElementById('score-fill'),
            
            // Control panels
            locationPanel: document.getElementById('location-panel'),
            decisionPanel: document.getElementById('decision-panel'),
            resultsPanel: document.getElementById('results-panel'),
            
            // NASA data displays
            soilMoistureValue: document.getElementById('soil-moisture-value'),
            precipitationValue: document.getElementById('precipitation-value'),
            temperatureValue: document.getElementById('temperature-value'),
            ndviValue: document.getElementById('ndvi-value'),
            lstValue: document.getElementById('lst-value'),
            
            // Back buttons
            backToMenu: document.getElementById('back-to-menu'),
            backToMenuTeacher: document.getElementById('back-to-menu-teacher')
        };
    },

    /**
     * Set up event listeners
     */
    setupEventListeners: function() {
        // Main menu navigation
        this.elements.startGameBtn?.addEventListener('click', () => this.startGame());
        this.elements.tutorialBtn?.addEventListener('click', () => this.showTutorial());
        this.elements.dataExplainerBtn?.addEventListener('click', () => this.showDataExplainer());
        this.elements.teacherModeBtn?.addEventListener('click', () => this.showTeacherMode());
        
        // Back buttons
        this.elements.backToMenu?.addEventListener('click', () => this.showMainMenu());
        this.elements.backToMenuTeacher?.addEventListener('click', () => this.showMainMenu());
        
        // Location selection
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectLocation(e));
        });
        
        // Game controls
        document.getElementById('confirm-location')?.addEventListener('click', () => this.confirmLocation());
        document.getElementById('apply-decisions')?.addEventListener('click', () => this.applyDecisions());
        document.getElementById('next-season')?.addEventListener('click', () => this.nextSeason());
        
        // Range inputs with live updates
        document.getElementById('irrigation-amount')?.addEventListener('input', (e) => {
            document.getElementById('irrigation-display').textContent = e.target.value;
        });
        
        document.getElementById('fertilizer-amount')?.addEventListener('input', (e) => {
            document.getElementById('fertilizer-display').textContent = e.target.value;
        });
        
        // Menu button
        document.getElementById('menu-btn')?.addEventListener('click', () => this.showMainMenu());
        
        // Teacher mode tools
        document.getElementById('generate-worksheet')?.addEventListener('click', () => this.generateWorksheet());
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        console.log('✅ Event listeners set up');
    },

    /**
     * Initialize game systems
     */
    initializeGameSystems: async function() {
        try {
            // Initialize NASA API
            await NASAAPI.init();
            
            // Initialize game state
            this.gameState = {
                phase: GAME_CONFIG.PHASES.SETUP,
                season: 'Spring',
                year: 1,
                location: null,
                decisions: {},
                results: {},
                sustainabilityScore: 0,
                history: []
            };
            
            // Show main menu after initialization
            setTimeout(() => {
                this.showMainMenu();
            }, 2000);
            
            console.log('✅ Game systems initialized');
        } catch (error) {
            console.error('❌ Failed to initialize game systems:', error);
            this.showError('Failed to initialize the game. Please refresh the page.');
        }
    },

    /**
     * Show loading screen
     */
    showLoadingScreen: function() {
        this.switchScreen('loading-screen');
    },

    /**
     * Show main menu
     */
    showMainMenu: function() {
        this.switchScreen('main-menu');
    },

    /**
     * Start the game
     */
    startGame: function() {
        console.log('🎮 Starting new game...');
        
        // Reset game state
        this.gameState = {
            phase: GAME_CONFIG.PHASES.SETUP,
            season: 'Spring',
            year: 1,
            location: null,
            decisions: {},
            results: {},
            sustainabilityScore: 0,
            history: []
        };
        
        this.switchScreen('game-screen');
        this.updateGamePhase(GAME_CONFIG.PHASES.SETUP);
        this.showPanel('location-panel');
        
        // Initialize canvas
        if (this.elements.farmCanvas) {
            const canvas = this.elements.farmCanvas;
            const ctx = canvas.getContext('2d');
            this.drawFarmBackground(ctx, canvas.width, canvas.height);
        }
    },

    /**
     * Show tutorial
     */
    showTutorial: function() {
        showNotification('Tutorial mode coming soon! 📚', 'info');
        // In a full implementation, this would show an interactive tutorial
    },

    /**
     * Show data explainer
     */
    showDataExplainer: function() {
        this.switchScreen('data-explainer-screen');
        this.loadDatasetInfo('smap'); // Default to SMAP
    },

    /**
     * Show teacher mode
     */
    showTeacherMode: function() {
        this.switchScreen('teacher-mode-screen');
    },

    /**
     * Switch between screens
     */
    switchScreen: function(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            
            // Add fade-in animation
            targetScreen.style.opacity = '0';
            setTimeout(() => {
                targetScreen.style.transition = 'opacity 0.3s ease';
                targetScreen.style.opacity = '1';
                setTimeout(() => {
                    targetScreen.style.transition = '';
                }, 300);
            }, 10);
        }
    },

    /**
     * Update game phase
     */
    updateGamePhase: function(phase) {
        this.gameState.phase = phase;
        
        // Update phase indicator
        if (this.elements.phaseIndicator) {
            const phaseNames = {
                [GAME_CONFIG.PHASES.SETUP]: 'Setup Phase',
                [GAME_CONFIG.PHASES.DECISION]: 'Decision Phase',
                [GAME_CONFIG.PHASES.SIMULATION]: 'Simulation Phase',
                [GAME_CONFIG.PHASES.RESULTS]: 'Results Phase',
                [GAME_CONFIG.PHASES.LEARNING]: 'Learning Phase'
            };
            this.elements.phaseIndicator.textContent = phaseNames[phase] || 'Unknown Phase';
        }
        
        console.log(`📋 Game phase updated to: ${phase}`);
    },

    /**
     * Show specific control panel
     */
    showPanel: function(panelId) {
        // Hide all panels
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show target panel
        const targetPanel = document.getElementById(panelId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    },

    /**
     * Handle location selection
     */
    selectLocation: function(event) {
        const button = event.currentTarget;
        const locationId = button.getAttribute('data-location');
        
        // Update UI
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        
        // Store selection
        this.gameState.selectedLocation = locationId;
        
        // Enable confirm button
        const confirmBtn = document.getElementById('confirm-location');
        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
        
        console.log(`📍 Location selected: ${locationId}`);
    },

    /**
     * Confirm location and fetch NASA data
     */
    confirmLocation: async function() {
        if (!this.gameState.selectedLocation) {
            showNotification('Please select a location first', 'warning');
            return;
        }
        
        const location = GAME_CONFIG.LOCATIONS[this.gameState.selectedLocation];
        this.gameState.location = location;
        
        showNotification(`Loading data for ${location.name}...`, 'info');
        
        try {
            // Fetch NASA data for the selected location
            this.nasaData = await NASAAPI.getAllData(
                location.coordinates.lat,
                location.coordinates.lon
            );
            
            // Update farm location display
            document.getElementById('farm-location').textContent = location.name;
            
            // Proceed to decision phase
            this.updateGamePhase(GAME_CONFIG.PHASES.DECISION);
            this.showPanel('decision-panel');
            this.updateNASADataDisplays();
            
            showNotification('NASA data loaded successfully! 🛰️', 'success');
        } catch (error) {
            console.error('Failed to load NASA data:', error);
            showNotification('Failed to load satellite data. Using simulated data.', 'warning');
            
            // Use mock data as fallback
            this.nasaData = GameHelpers.generateMockNASAData(
                this.gameState.selectedLocation,
                this.gameState.season
            );
            
            this.updateGamePhase(GAME_CONFIG.PHASES.DECISION);
            this.showPanel('decision-panel');
            this.updateNASADataDisplays();
        }
    },

    /**
     * Update NASA data displays in the UI
     */
    updateNASADataDisplays: function() {
        if (!this.nasaData) return;
        
        // Update SMAP soil moisture
        if (this.elements.soilMoistureValue && this.nasaData.smap) {
            this.elements.soilMoistureValue.textContent = 
                `${(this.nasaData.smap.soilMoisture * 100).toFixed(1)}%`;
        }
        
        // Update IMERG precipitation
        if (this.elements.precipitationValue && this.nasaData.imerg) {
            this.elements.precipitationValue.textContent = 
                `${this.nasaData.imerg.precipitation.toFixed(1)} mm/hr`;
        }
        
        // Update LP DAAC data
        if (this.elements.ndviValue && this.nasaData.lpdaac) {
            this.elements.ndviValue.textContent = 
                this.nasaData.lpdaac.ndvi.toFixed(2);
        }
        
        if (this.elements.temperatureValue && this.nasaData.lpdaac) {
            this.elements.temperatureValue.textContent = 
                `${this.nasaData.lpdaac.landSurfaceTemperature.toFixed(1)}°C`;
        }
        
        // Update other displays
        if (this.elements.lstValue && this.nasaData.lpdaac) {
            this.elements.lstValue.textContent = 
                `${this.nasaData.lpdaac.landSurfaceTemperature.toFixed(1)}°C`;
        }
    },

    /**
     * Apply farming decisions
     */
    applyDecisions: function() {
        // Collect decisions from form inputs
        const decisions = {
            irrigationAmount: parseInt(document.getElementById('irrigation-amount')?.value || 50),
            fertilizerType: document.getElementById('fertilizer-type')?.value || 'organic',
            fertilizerAmount: parseInt(document.getElementById('fertilizer-amount')?.value || 25),
            pestMethod: document.getElementById('pest-method')?.value || 'ipm'
        };
        
        // Validate decisions
        const validation = GameHelpers.validateDecisions(decisions);
        if (!validation.isValid) {
            showNotification(validation.errors[0], 'error');
            return;
        }
        
        this.gameState.decisions = decisions;
        
        // Proceed to simulation phase
        this.updateGamePhase(GAME_CONFIG.PHASES.SIMULATION);
        this.runSimulation();
    },

    /**
     * Run farming simulation
     */
    runSimulation: function() {
        showNotification('Running simulation based on NASA data...', 'info');
        
        // Simulate farming results based on NASA data and decisions
        setTimeout(() => {
            const results = this.calculateFarmingResults();
            this.gameState.results = results;
            
            // Show results
            this.updateGamePhase(GAME_CONFIG.PHASES.RESULTS);
            this.showPanel('results-panel');
            this.displayResults(results);
            
            // Update sustainability score
            const sustainabilityScore = GameHelpers.calculateSustainabilityScore(
                this.gameState.decisions, 
                results
            );
            this.updateSustainabilityScore(sustainabilityScore);
            
            showNotification('Simulation complete! 📊', 'success');
        }, 2000);
    },

    /**
     * Calculate farming results based on decisions and NASA data
     */
    calculateFarmingResults: function() {
        const decisions = this.gameState.decisions;
        const location = this.gameState.location;
        const crop = GAME_CONFIG.CROPS[location.primaryCrops[0]]; // Use first crop
        
        // Base yield calculation
        let yieldMultiplier = 1.0;
        
        // Factor in irrigation decisions vs soil moisture
        const soilMoisture = this.nasaData.smap?.soilMoisture || 0.4;
        const irrigationOptimal = this.calculateIrrigationOptimality(decisions.irrigationAmount, soilMoisture);
        yieldMultiplier *= irrigationOptimal;
        
        // Factor in fertilizer
        const fertilizerConfig = GAME_CONFIG.FERTILIZER.types[decisions.fertilizerType];
        yieldMultiplier *= (1 + fertilizerConfig.yieldBoost);
        
        // Factor in temperature stress
        const temperature = this.nasaData.lpdaac?.landSurfaceTemperature || 20;
        const tempStress = this.calculateTemperatureStress(temperature, crop.temperatureRange);
        yieldMultiplier *= tempStress;
        
        // Factor in NDVI (vegetation health)
        const ndvi = this.nasaData.lpdaac?.ndvi || 0.6;
        const vegetationHealth = Math.min(1.0, ndvi / 0.8); // Optimal NDVI is ~0.8
        yieldMultiplier *= vegetationHealth;
        
        // Calculate final results
        const baseYield = crop.baseYield;
        const finalYield = baseYield * yieldMultiplier;
        const waterUsed = decisions.irrigationAmount + (this.nasaData.imerg?.precipitation || 10);
        
        return {
            cropYield: Math.max(0, finalYield),
            potentialYield: baseYield * 1.2, // Maximum possible yield
            waterUsed: waterUsed,
            waterEfficiency: finalYield / waterUsed,
            soilHealth: this.calculateSoilHealth(decisions),
            environmentalImpact: this.calculateEnvironmentalImpact(decisions),
            economicReturn: finalYield * 200 // $200 per ton (simplified)
        };
    },

    /**
     * Calculate irrigation optimality
     */
    calculateIrrigationOptimality: function(irrigationAmount, soilMoisture) {
        const targetMoisture = 0.6; // Optimal soil moisture
        const currentTotal = soilMoisture + (irrigationAmount / 100 * 0.3);
        
        if (currentTotal < 0.3) return 0.5; // Too dry
        if (currentTotal > 0.8) return 0.7; // Too wet
        
        // Optimal range
        return Math.max(0.5, 1.0 - Math.abs(currentTotal - targetMoisture) * 2);
    },

    /**
     * Calculate temperature stress
     */
    calculateTemperatureStress: function(temperature, optimalRange) {
        const [minTemp, maxTemp] = optimalRange;
        
        if (temperature < minTemp || temperature > maxTemp) {
            const stress = Math.min(Math.abs(temperature - minTemp), Math.abs(temperature - maxTemp)) / 10;
            return Math.max(0.3, 1.0 - stress);
        }
        
        return 1.0; // No temperature stress
    },

    /**
     * Calculate soil health
     */
    calculateSoilHealth: function(decisions) {
        let soilHealth = 100;
        
        // Fertilizer impact
        if (decisions.fertilizerType === 'synthetic') {
            soilHealth -= decisions.fertilizerAmount * 0.3;
        } else if (decisions.fertilizerType === 'organic') {
            soilHealth += decisions.fertilizerAmount * 0.1;
        }
        
        // Pest management impact
        if (decisions.pestMethod === 'conventional') {
            soilHealth -= 10;
        } else if (decisions.pestMethod === 'ipm') {
            soilHealth += 5;
        }
        
        return Math.max(0, Math.min(100, soilHealth));
    },

    /**
     * Calculate environmental impact
     */
    calculateEnvironmentalImpact: function(decisions) {
        let impact = 50; // Neutral baseline
        
        // Positive impacts
        if (decisions.fertilizerType === 'organic') impact += 20;
        if (decisions.pestMethod === 'ipm' || decisions.pestMethod === 'organic') impact += 15;
        if (decisions.irrigationAmount < 60) impact += 10;
        
        // Negative impacts
        if (decisions.fertilizerType === 'synthetic') impact -= 15;
        if (decisions.pestMethod === 'conventional') impact -= 20;
        if (decisions.irrigationAmount > 80) impact -= 10;
        
        return Math.max(0, Math.min(100, impact));
    },

    /**
     * Display farming results
     */
    displayResults: function(results) {
        document.getElementById('crop-yield').textContent = 
            `${results.cropYield.toFixed(1)} tons/ha`;
        
        document.getElementById('water-efficiency').textContent = 
            `${formatPercentage(results.waterEfficiency / 2)}`;
        
        document.getElementById('soil-health').textContent = 
            `${results.soilHealth.toFixed(0)}%`;
        
        // Generate learning insights
        this.generateLearningInsights(results);
    },

    /**
     * Generate learning insights
     */
    generateLearningInsights: function(results) {
        const insights = [];
        const decisions = this.gameState.decisions;
        
        // Soil moisture insights
        const soilMoisture = this.nasaData.smap?.soilMoisture || 0.4;
        if (soilMoisture < 0.3 && decisions.irrigationAmount < 50) {
            insights.push("💧 SMAP data showed low soil moisture. Consider increasing irrigation for better yields.");
        }
        
        // NDVI insights
        const ndvi = this.nasaData.lpdaac?.ndvi || 0.6;
        if (ndvi < 0.5) {
            insights.push("🌱 Low NDVI indicates stressed vegetation. Fertilization timing could be optimized.");
        }
        
        // Temperature insights
        const temperature = this.nasaData.lpdaac?.landSurfaceTemperature || 20;
        if (temperature > 30) {
            insights.push("🌡️ High temperatures detected by satellite. Consider heat-stress mitigation strategies.");
        }
        
        // Sustainability insights
        if (decisions.fertilizerType === 'organic') {
            insights.push("🌿 Great choice on organic fertilizer! This improves long-term soil health.");
        }
        
        // Display insights
        const insightsContainer = document.getElementById('insights-content');
        if (insightsContainer) {
            insightsContainer.innerHTML = insights.map(insight => 
                `<div class="insight-item">${insight}</div>`
            ).join('');
        }
    },

    /**
     * Update sustainability score display
     */
    updateSustainabilityScore: function(score) {
        this.gameState.sustainabilityScore = score;
        
        if (this.elements.sustainabilityValue) {
            this.elements.sustainabilityValue.textContent = score;
        }
        
        if (this.elements.scoreFill) {
            this.elements.scoreFill.style.width = `${score}%`;
        }
        
        document.getElementById('final-sustainability').textContent = `${score}/100`;
    },

    /**
     * Proceed to next season
     */
    nextSeason: function() {
        // Save current season results
        this.gameState.history.push({
            season: this.gameState.season,
            year: this.gameState.year,
            decisions: { ...this.gameState.decisions },
            results: { ...this.gameState.results },
            sustainabilityScore: this.gameState.sustainabilityScore
        });
        
        // Advance to next season
        const currentSeasonIndex = GAME_CONFIG.SEASONS.indexOf(this.gameState.season);
        if (currentSeasonIndex === 3) { // Winter, go to next year
            this.gameState.season = GAME_CONFIG.SEASONS[0]; // Spring
            this.gameState.year++;
        } else {
            this.gameState.season = GAME_CONFIG.SEASONS[currentSeasonIndex + 1];
        }
        
        // Update season display
        document.getElementById('current-season').textContent = this.gameState.season;
        
        // Reset to decision phase for new season
        this.updateGamePhase(GAME_CONFIG.PHASES.DECISION);
        this.showPanel('decision-panel');
        
        // Refresh NASA data
        this.refreshNASAData();
        
        showNotification(`Welcome to ${this.gameState.season}, Year ${this.gameState.year}! 🌱`, 'success');
    },

    /**
     * Refresh NASA data for new season
     */
    refreshNASAData: async function() {
        if (this.gameState.location) {
            try {
                this.nasaData = await NASAAPI.getAllData(
                    this.gameState.location.coordinates.lat,
                    this.gameState.location.coordinates.lon
                );
                this.updateNASADataDisplays();
            } catch (error) {
                console.error('Failed to refresh NASA data:', error);
                // Continue with previous data
            }
        }
    },

    /**
     * Draw farm background on canvas
     */
    drawFarmBackground: function(ctx, width, height) {
        // Sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.3);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#98D8E8');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height * 0.3);
        
        // Ground
        ctx.fillStyle = '#8BC34A';
        ctx.fillRect(0, height * 0.3, width, height * 0.7);
        
        // Farm grid
        ctx.strokeStyle = '#689F38';
        ctx.lineWidth = 1;
        const gridSize = 40;
        
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, height * 0.3);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = height * 0.3; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Add some farm elements
        ctx.fillStyle = '#795548';
        ctx.fillRect(width - 120, height * 0.15, 80, 100); // Barn
        
        ctx.fillStyle = '#4CAF50';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(50 + i * 80, height * 0.5, 60, 40); // Crop plots
        }
    },

    /**
     * Generate worksheet for teacher mode
     */
    generateWorksheet: function() {
        const worksheetContent = `
            <div class="worksheet-header">
                <h1 class="worksheet-title">NASA Farm Navigators</h1>
                <h2 class="worksheet-subtitle">Educational Worksheet - Sustainable Agriculture with Satellite Data</h2>
                <p><strong>Name:</strong> ___________________________ <strong>Date:</strong> _______________</p>
            </div>

            <div class="worksheet-section">
                <h3>Part 1: Understanding NASA Data</h3>
                
                <div class="question-block">
                    <div class="question-text">1. What is SMAP and how does it help farmers?</div>
                    <div class="answer-space"></div>
                </div>
                
                <div class="question-block">
                    <div class="question-text">2. Explain how IMERG precipitation data can improve irrigation decisions.</div>
                    <div class="answer-space"></div>
                </div>
                
                <div class="question-block">
                    <div class="question-text">3. What does NDVI tell us about crop health?</div>
                    <div class="answer-space"></div>
                </div>
            </div>

            <div class="worksheet-section">
                <h3>Part 2: Sustainable Farming Decisions</h3>
                
                <div class="question-block">
                    <div class="question-text">4. If satellite data shows soil moisture at 20%, what irrigation decision would you make and why?</div>
                    <div class="answer-space"></div>
                </div>
                
                <div class="question-block">
                    <div class="question-text">5. Compare organic vs synthetic fertilizers in terms of sustainability.</div>
                    <div class="answer-space"></div>
                </div>
            </div>

            <div class="worksheet-section">
                <h3>Part 3: Game Reflection</h3>
                
                <div class="question-block">
                    <div class="question-text">6. What was your highest sustainability score and what decisions led to it?</div>
                    <div class="answer-space"></div>
                </div>
                
                <div class="question-block">
                    <div class="question-text">7. How did NASA satellite data influence your farming decisions?</div>
                    <div class="answer-space"></div>
                </div>
            </div>
        `;

        const worksheetPreview = document.getElementById('worksheet-preview');
        if (worksheetPreview) {
            worksheetPreview.innerHTML = worksheetContent;
        }
        
        // Add print button
        const existingBtn = document.querySelector('.print-worksheet-btn');
        if (existingBtn) existingBtn.remove();
        
        const printBtn = document.createElement('button');
        printBtn.className = 'print-worksheet-btn no-print';
        printBtn.innerHTML = '🖨️ Print Worksheet';
        printBtn.onclick = () => window.print();
        document.body.appendChild(printBtn);
        
        showNotification('Worksheet generated! Ready to print. 📄', 'success');
    },

    /**
     * Load dataset information
     */
    loadDatasetInfo: function(datasetId) {
        // This would load detailed information about NASA datasets
        // For now, show a placeholder
        const content = document.getElementById('dataset-content');
        if (content) {
            content.innerHTML = `
                <div class="dataset-card">
                    <div class="dataset-header">
                        <h3>${NASA_CONFIG.DATASETS[datasetId.toUpperCase()]?.name || 'Dataset Information'}</h3>
                        <div class="dataset-subtitle">How NASA satellites help modern agriculture</div>
                    </div>
                    <div class="dataset-body">
                        <p class="dataset-description">
                            ${NASA_CONFIG.DATASETS[datasetId.toUpperCase()]?.description || 'Dataset information loading...'}
                        </p>
                        <div class="how-it-works">
                            <h4>🛰️ How It Works</h4>
                            <p>This dataset provides crucial information for agricultural decision-making...</p>
                        </div>
                        <div class="agricultural-applications">
                            <h4>🌾 Agricultural Applications</h4>
                            <p>Farmers use this data to optimize irrigation, predict yields, and improve sustainability.</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-dataset="${datasetId}"]`)?.classList.add('active');
    },

    /**
     * Handle keyboard shortcuts
     */
    handleKeyPress: function(event) {
        // ESC key goes back to main menu
        if (event.key === 'Escape' && this.currentScreen !== 'main-menu') {
            this.showMainMenu();
        }
        
        // Space key for quick actions
        if (event.key === ' ' && this.currentScreen === 'game-screen') {
            event.preventDefault();
            // Add quick action functionality
        }
    },

    /**
     * Handle window resize
     */
    handleResize: function() {
        // Resize canvas if needed
        if (this.elements.farmCanvas) {
            const container = this.elements.farmCanvas.parentElement;
            const rect = container.getBoundingClientRect();
            // Keep aspect ratio but fit container
            this.elements.farmCanvas.style.width = '100%';
            this.elements.farmCanvas.style.height = '100%';
        }
    },

    /**
     * Show error message
     */
    showError: function(message) {
        showNotification(message, 'error', 5000);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing NASA Farm Navigators...');
    window.FarmNavigators.init();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause any ongoing processes
        console.log('📱 App backgrounded');
    } else {
        // Resume processes
        console.log('📱 App foregrounded');
    }
});

// Export for testing
if (typeof window !== 'undefined') {
    window.FarmNavigators = FarmNavigators;
}