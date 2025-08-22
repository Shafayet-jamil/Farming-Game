/**
 * NASA Farm Navigators - Helper Utilities
 * Common utility functions used throughout the game
 */

window.GameHelpers = {
    /**
     * Format numbers for display
     */
    formatNumber: function(number, decimals = 1) {
        if (number === null || number === undefined) return 'N/A';
        
        if (number >= 1000000) {
            return (number / 1000000).toFixed(decimals) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(decimals) + 'K';
        }
        
        return Number(number).toFixed(decimals);
    },

    /**
     * Format percentage values
     */
    formatPercentage: function(value, decimals = 0) {
        if (value === null || value === undefined) return 'N/A';
        return (value * 100).toFixed(decimals) + '%';
    },

    /**
     * Clamp a value between min and max
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation between two values
     */
    lerp: function(a, b, t) {
        return a + (b - a) * t;
    },

    /**
     * Map a value from one range to another
     */
    mapRange: function(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },

    /**
     * Generate random number in range
     */
    randomRange: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Generate random integer in range
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Calculate distance between two coordinates
     */
    calculateDistance: function(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    /**
     * Convert degrees to radians
     */
    degToRad: function(deg) {
        return deg * (Math.PI / 180);
    },

    /**
     * Debounce function calls
     */
    debounce: function(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    /**
     * Throttle function calls
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    /**
     * Deep clone an object
     */
    deepClone: function(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    /**
     * Get element position relative to viewport
     */
    getElementPosition: function(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX,
            bottom: rect.bottom + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement: function(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Add CSS class with animation
     */
    addClassAnimated: function(element, className, duration = 300) {
        return new Promise(resolve => {
            element.classList.add(className);
            setTimeout(() => resolve(), duration);
        });
    },

    /**
     * Remove CSS class with animation
     */
    removeClassAnimated: function(element, className, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `all ${duration}ms ease`;
            element.classList.remove(className);
            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    },

    /**
     * Fade in element
     */
    fadeIn: function(element, duration = 300) {
        return new Promise(resolve => {
            element.style.opacity = '0';
            element.style.display = 'block';
            element.style.transition = `opacity ${duration}ms ease`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                setTimeout(() => {
                    element.style.transition = '';
                    resolve();
                }, duration);
            }, 10);
        });
    },

    /**
     * Fade out element
     */
    fadeOut: function(element, duration = 300) {
        return new Promise(resolve => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.transition = '';
                resolve();
            }, duration);
        });
    },

    /**
     * Create and show notification
     */
    showNotification: function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            backgroundColor: GameHelpers.getNotificationColor(type),
            color: 'white',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100px)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    },

    /**
     * Get notification color based on type
     */
    getNotificationColor: function(type) {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        return colors[type] || colors.info;
    },

    /**
     * Format date for display
     */
    formatDate: function(date, options = {}) {
        const defaults = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat('en-US', { ...defaults, ...options });
        return formatter.format(date);
    },

    /**
     * Get current season based on date
     */
    getCurrentSeason: function(date = new Date()) {
        const month = date.getMonth(); // 0-11
        if (month >= 2 && month <= 4) return 'Spring';
        if (month >= 5 && month <= 7) return 'Summer';
        if (month >= 8 && month <= 10) return 'Fall';
        return 'Winter';
    },

    /**
     * Calculate sustainability score
     */
    calculateSustainabilityScore: function(decisions, results) {
        const weights = GAME_CONFIG.SUSTAINABILITY_WEIGHTS;
        let score = 0;
        
        // Water efficiency (0-100)
        const waterEfficiency = results.waterUsed > 0 ? 
            Math.min(100, (results.cropYield / results.waterUsed) * 10) : 0;
        score += waterEfficiency * weights.water_efficiency;
        
        // Soil health (based on fertilizer and chemical use)
        const soilHealth = 100 - (decisions.fertilizerAmount * 0.5) - (decisions.pesticidesAmount * 0.3);
        score += Math.max(0, soilHealth) * weights.soil_health;
        
        // Chemical use (lower is better)
        const chemicalScore = 100 - (decisions.fertilizerAmount + decisions.pesticidesAmount);
        score += Math.max(0, chemicalScore) * weights.chemical_use;
        
        // Yield optimization (compare to potential yield)
        const yieldOptimization = Math.min(100, (results.cropYield / results.potentialYield) * 100);
        score += yieldOptimization * weights.yield_optimization;
        
        // Environmental impact
        const environmentalScore = (decisions.organicMethods ? 100 : 50) - 
                                 (decisions.excessiveWater ? 30 : 0);
        score += Math.max(0, environmentalScore) * weights.environmental_impact;
        
        return Math.round(Math.max(0, Math.min(100, score)));
    },

    /**
     * Generate mock NASA data for simulation
     */
    generateMockNASAData: function(location, season, variability = 0.2) {
        const ranges = NASA_CONFIG.MOCK_DATA_RANGES;
        const seasonMultipliers = {
            Spring: { temp: 0.7, precip: 1.2, moisture: 1.1 },
            Summer: { temp: 1.3, precip: 0.8, moisture: 0.8 },
            Fall: { temp: 0.8, precip: 1.0, moisture: 1.0 },
            Winter: { temp: 0.4, precip: 1.1, moisture: 0.9 }
        };
        
        const multiplier = seasonMultipliers[season] || seasonMultipliers.Spring;
        const vary = (base, factor) => base + (Math.random() - 0.5) * base * variability * factor;
        
        return {
            soilMoisture: this.clamp(
                vary(0.4 * multiplier.moisture, 1), 
                ranges.soil_moisture.min, 
                ranges.soil_moisture.max
            ),
            precipitation: Math.max(0, 
                vary(15 * multiplier.precip, 1.5)
            ),
            temperature: vary(20 * multiplier.temp, 0.8),
            ndvi: this.clamp(
                vary(0.6, 0.5), 
                ranges.ndvi.min, 
                ranges.ndvi.max
            ),
            landSurfaceTemp: vary(22 * multiplier.temp, 0.9),
            timestamp: Date.now()
        };
    },

    /**
     * Validate game decisions
     */
    validateDecisions: function(decisions) {
        const errors = [];
        
        if (!decisions.location) {
            errors.push('Please select a farm location');
        }
        
        if (decisions.irrigationAmount < 0 || decisions.irrigationAmount > 100) {
            errors.push('Irrigation amount must be between 0 and 100mm');
        }
        
        if (decisions.fertilizerAmount < 0 || decisions.fertilizerAmount > 100) {
            errors.push('Fertilizer amount must be between 0 and 100kg/ha');
        }
        
        if (!['none', 'organic', 'synthetic'].includes(decisions.fertilizerType)) {
            errors.push('Invalid fertilizer type selected');
        }
        
        if (!['none', 'ipm', 'organic', 'conventional'].includes(decisions.pestMethod)) {
            errors.push('Invalid pest management method selected');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Storage utilities
     */
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Storage not available:', e);
                return false;
            }
        },
        
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Storage not available:', e);
                return defaultValue;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Storage not available:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('Storage not available:', e);
                return false;
            }
        }
    }
};

// Make helper functions globally available
window.formatNumber = window.GameHelpers.formatNumber;
window.formatPercentage = window.GameHelpers.formatPercentage;
window.clamp = window.GameHelpers.clamp;
window.showNotification = window.GameHelpers.showNotification;

// Export for module systems (if used)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.GameHelpers;
}