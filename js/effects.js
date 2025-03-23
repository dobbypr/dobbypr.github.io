// Initialize visual effects
document.addEventListener('DOMContentLoaded', function() {
    // Create parallax container and layers
    initParallaxEffect();
    
    // Add click handler for blood splatter
    document.addEventListener('click', createBloodSplatter);
});

// Initialize parallax scrolling effect
function initParallaxEffect() {
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';

    const layer1 = document.createElement('div');
    layer1.className = 'parallax-layer-1';

    const layer2 = document.createElement('div');
    layer2.className = 'parallax-layer-2';

    const layer3 = document.createElement('div');
    layer3.className = 'parallax-layer-3';

    parallaxContainer.appendChild(layer1);
    parallaxContainer.appendChild(layer2);
    parallaxContainer.appendChild(layer3);
    document.body.appendChild(parallaxContainer);

    // Parallax scroll handler
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;

        // Different scroll speeds for each layer
        layer1.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        layer2.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        layer3.style.transform = `translateY(${scrollPosition * 0.02}px)`;
    });
}

// Blood splatter effect when clicking
function createBloodSplatter(e, options = {}) {
    const blood = document.createElement('div');
    blood.className = 'blood';

    // Support either click events or manual positioning
    const x = e.pageX || (e.left + e.width/2);
    const y = e.pageY || (e.top + e.height/2);

    blood.style.left = (x - 50) + 'px';
    blood.style.top = (y - 50) + 'px';
    blood.style.width = options.width || '100px';
    blood.style.height = options.height || '100px';
    blood.style.backgroundColor = options.color || (document.body.classList.contains('terminal-mode') ? '#00ff00' : '#ff0000');

    if (options.boxShadow) {
        blood.style.boxShadow = options.boxShadow;
    }

    if (options.opacity) {
        blood.style.opacity = options.opacity;
    }

    document.body.appendChild(blood);

    setTimeout(() => {
        blood.remove();
    }, options.duration || 1000);
}

// Helper function for creating blood drips
function createBloodDrips(container, count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const drip = document.createElement('div');
            drip.className = 'blood-drip';
            drip.style.left = Math.random() * 100 + '%';
            drip.style.animationDuration = (1 + Math.random() * 2) + 's';
            container.appendChild(drip);

            // Remove drip after animation completes
            setTimeout(() => {
                drip.remove();
            }, 3000);
        }, i * 200);
    }
}

// Helper function for creating multiple blood splatters
function createBloodSplatterBurst(count, centerX, centerY, range, duration) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = centerX ? centerX - range/2 + Math.random() * range : Math.random() * window.innerWidth;
            const y = centerY ? centerY - range/2 + Math.random() * range : Math.random() * window.innerHeight;

            const options = {
                width: '200px',
                height: '200px',
                duration: duration || 1500,
                color: document.body.classList.contains('terminal-mode') ? '#00ff00' : '#ff0000',
                boxShadow: `0 0 10px ${document.body.classList.contains('terminal-mode') ? '#00ff00' : '#ff0000'}`
            };

            createBloodSplatter({pageX: x, pageY: y}, options);
        }, i * 100);
    }
}

// Random Blood Drip Generator - creates random blood drips at edges of sections
function addRandomBloodDrips() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        // Create 1-3 random drips per section
        const dripCount = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < dripCount; i++) {
            const drip = document.createElement('div');
            drip.className = 'blood-drip';
            
            // Place along top or side edges randomly
            if (Math.random() > 0.5) {
                // Top edge
                drip.style.top = '0';
                drip.style.left = Math.random() * 100 + '%';
            } else {
                // Side edge (left or right)
                drip.style.top = Math.random() * 100 + '%';
                drip.style.left = Math.random() > 0.5 ? '0' : '100%';
            }
            
            // Make sure color matches current theme
            drip.style.background = document.body.classList.contains('terminal-mode') ? 
                'linear-gradient(to bottom, var(--terminal-green), var(--terminal-dark))' : 
                'linear-gradient(to bottom, var(--blood-red), var(--dark-red))';
            
            section.appendChild(drip);
            
            // Remove after animation completes
            setTimeout(() => {
                drip.remove();
            }, 3000);
        }
    });
    
    // Refresh drips periodically
    setTimeout(addRandomBloodDrips, 5000 + Math.random() * 5000);
}

// Start the random blood drips after page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit before starting
    setTimeout(addRandomBloodDrips, 3000);
});