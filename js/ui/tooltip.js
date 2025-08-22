/**
 * NASA Farm Navigators - Tooltip System
 * Interactive tooltips for educational content
 */

window.TooltipSystem = {
    tooltip: null,
    currentTarget: null,
    showTimeout: null,
    hideTimeout: null,

    /**
     * Initialize tooltip system
     */
    init: function() {
        this.tooltip = document.getElementById('tooltip');
        this.setupEventListeners();
        console.log('💬 Tooltip system initialized');
    },

    /**
     * Set up event listeners for tooltips
     */
    setupEventListeners: function() {
        // Handle mouse events for elements with tooltip data
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.show(target, target.getAttribute('data-tooltip'));
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hide();
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.tooltip && this.tooltip.classList.contains('visible')) {
                this.updatePosition();
            }
        });
    },

    /**
     * Show tooltip
     */
    show: function(target, content, delay = UI_CONFIG.TOOLTIP.SHOW_DELAY) {
        if (this.currentTarget === target) return;

        this.hide(true); // Hide current tooltip immediately
        this.currentTarget = target;

        this.showTimeout = setTimeout(() => {
            if (!this.tooltip) return;

            // Set content
            const tooltipText = this.tooltip.querySelector('.tooltip-text');
            if (tooltipText) {
                tooltipText.innerHTML = this.formatContent(content);
            }

            // Position tooltip
            this.updatePosition();

            // Show tooltip
            this.tooltip.classList.add('visible');

            // Add aria attributes for accessibility
            target.setAttribute('aria-describedby', 'tooltip');
            this.tooltip.setAttribute('role', 'tooltip');
        }, delay);
    },

    /**
     * Hide tooltip
     */
    hide: function(immediate = false) {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }

        const delay = immediate ? 0 : UI_CONFIG.TOOLTIP.HIDE_DELAY;

        this.hideTimeout = setTimeout(() => {
            if (this.tooltip) {
                this.tooltip.classList.remove('visible');
            }

            if (this.currentTarget) {
                this.currentTarget.removeAttribute('aria-describedby');
                this.currentTarget = null;
            }

            if (this.tooltip) {
                this.tooltip.removeAttribute('role');
            }
        }, delay);
    },

    /**
     * Update tooltip position
     */
    updatePosition: function() {
        if (!this.tooltip || !this.currentTarget) return;

        const targetRect = this.currentTarget.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        let top = targetRect.top - tooltipRect.height - 10;

        // Horizontal boundary checks
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > windowWidth - 10) {
            left = windowWidth - tooltipRect.width - 10;
        }

        // Vertical boundary checks
        if (top < 10) {
            // Show below target instead
            top = targetRect.bottom + 10;
            this.tooltip.classList.add('bottom');
            this.tooltip.classList.remove('top');
        } else {
            this.tooltip.classList.add('top');
            this.tooltip.classList.remove('bottom');
        }

        // Apply position
        this.tooltip.style.left = left + 'px';
        this.tooltip.style.top = top + 'px';
    },

    /**
     * Format tooltip content
     */
    formatContent: function(content) {
        // Handle different content types
        if (typeof content === 'object') {
            return this.formatObjectContent(content);
        }

        // Handle special formatting
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return content;
    },

    /**
     * Format object content for rich tooltips
     */
    formatObjectContent: function(obj) {
        let html = '';

        if (obj.title) {
            html += `<div class="tooltip-title">${obj.title}</div>`;
        }

        if (obj.description) {
            html += `<div class="tooltip-description">${obj.description}</div>`;
        }

        if (obj.value) {
            html += `<div class="tooltip-value">${obj.value}</div>`;
        }

        if (obj.source) {
            html += `<div class="tooltip-source">Source: ${obj.source}</div>`;
        }

        return html;
    },

    /**
     * Create interactive tooltip for NASA data
     */
    createNASADataTooltip: function(dataType, value, metadata = {}) {
        const tooltipData = {
            title: this.getNASADataTitle(dataType),
            description: this.getNASADataDescription(dataType),
            value: `${value} ${this.getNASADataUnit(dataType)}`,
            source: metadata.source || 'NASA Earth Observation'
        };

        return tooltipData;
    },

    /**
     * Get NASA data title
     */
    getNASADataTitle: function(dataType) {
        const titles = {
            'soil_moisture': 'SMAP Soil Moisture',
            'precipitation': 'IMERG Precipitation',
            'temperature': 'Land Surface Temperature',
            'ndvi': 'NDVI Vegetation Index',
            'lst': 'MODIS Land Surface Temperature'
        };

        return titles[dataType] || 'NASA Data';
    },

    /**
     * Get NASA data description
     */
    getNASADataDescription: function(dataType) {
        const descriptions = {
            'soil_moisture': 'Amount of water stored in soil. Critical for irrigation planning and drought monitoring.',
            'precipitation': 'Real-time rainfall measurements from multiple satellites. Essential for crop water management.',
            'temperature': 'Surface temperature affecting plant growth, evaporation rates, and stress levels.',
            'ndvi': 'Measure of vegetation health and density. Higher values indicate healthier, denser vegetation.',
            'lst': 'Land surface temperature from thermal infrared sensors. Affects crop development and water needs.'
        };

        return descriptions[dataType] || 'Satellite-derived agricultural data';
    },

    /**
     * Get NASA data unit
     */
    getNASADataUnit: function(dataType) {
        const units = {
            'soil_moisture': '%',
            'precipitation': 'mm/hr',
            'temperature': '°C',
            'ndvi': 'index',
            'lst': '°C'
        };

        return units[dataType] || '';
    },

    /**
     * Add tooltip to element
     */
    addTooltip: function(element, content) {
        if (typeof content === 'object') {
            element.setAttribute('data-tooltip', JSON.stringify(content));
        } else {
            element.setAttribute('data-tooltip', content);
        }

        // Add visual indicator
        element.style.cursor = 'help';
        element.classList.add('has-tooltip');
    },

    /**
     * Remove tooltip from element
     */
    removeTooltip: function(element) {
        element.removeAttribute('data-tooltip');
        element.style.cursor = '';
        element.classList.remove('has-tooltip');
    },

    /**
     * Add educational tooltips to NASA data elements
     */
    addNASADataTooltips: function() {
        // Soil moisture tooltip
        const soilMoistureElement = document.getElementById('soil-moisture-value');
        if (soilMoistureElement) {
            this.addTooltip(soilMoistureElement, {
                title: 'SMAP Soil Moisture',
                description: 'Measures water content in the top 5cm of soil. Helps farmers optimize irrigation timing and reduce water waste.',
                source: 'NASA SMAP Satellite'
            });
        }

        // Precipitation tooltip
        const precipitationElement = document.getElementById('precipitation-value');
        if (precipitationElement) {
            this.addTooltip(precipitationElement, {
                title: 'IMERG Precipitation',
                description: 'Global precipitation measurements updated every 30 minutes. Critical for drought monitoring and flood prediction.',
                source: 'NASA GPM Mission'
            });
        }

        // NDVI tooltip
        const ndviElement = document.getElementById('ndvi-value');
        if (ndviElement) {
            this.addTooltip(ndviElement, {
                title: 'NDVI Vegetation Index',
                description: 'Ranges from -1 to +1. Values above 0.3 indicate healthy vegetation. Used to assess crop health and predict yields.',
                source: 'MODIS/Landsat Satellites'
            });
        }

        // Temperature tooltip
        const temperatureElement = document.getElementById('temperature-value');
        if (temperatureElement) {
            this.addTooltip(temperatureElement, {
                title: 'Land Surface Temperature',
                description: 'Surface temperature affecting crop growth rates and water evaporation. Extreme temperatures can stress plants.',
                source: 'MODIS Thermal Sensors'
            });
        }

        // Add tooltips to farming decision elements
        this.addFarmingDecisionTooltips();
    },

    /**
     * Add tooltips for farming decisions
     */
    addFarmingDecisionTooltips: function() {
        // Irrigation tooltip
        const irrigationSlider = document.getElementById('irrigation-amount');
        if (irrigationSlider) {
            this.addTooltip(irrigationSlider, {
                title: 'Irrigation Amount',
                description: 'Consider current soil moisture levels from SMAP data. Over-irrigation wastes water and can harm crops.',
                source: 'Farm Management Decision'
            });
        }

        // Fertilizer tooltips
        const fertilizerType = document.getElementById('fertilizer-type');
        if (fertilizerType) {
            this.addTooltip(fertilizerType, {
                title: 'Fertilizer Choice',
                description: 'Organic fertilizers improve soil health long-term. Synthetic fertilizers provide quick nutrients but may impact sustainability.',
                source: 'Sustainable Agriculture Practices'
            });
        }

        // Pest management tooltip
        const pestMethod = document.getElementById('pest-method');
        if (pestMethod) {
            this.addTooltip(pestMethod, {
                title: 'Pest Management',
                description: 'IPM combines multiple strategies for sustainable pest control. Weather data helps time treatments effectively.',
                source: 'Integrated Pest Management'
            });
        }
    }
};

// Initialize tooltip system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.TooltipSystem.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.TooltipSystem;
}