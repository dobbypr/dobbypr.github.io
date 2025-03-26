// Initialize visual effects
document.addEventListener('DOMContentLoaded', function() {
    // Create parallax container and layers
    initParallaxEffect();
    
    // Initialize blood effect system
    initBloodEffectSystem();
    
    // Add click handler for blood splatter
    document.addEventListener('click', handleBloodClick);
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

    // Optimize parallax with requestAnimationFrame for better performance
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    // Parallax scroll handler
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Different scroll speeds for each layer
                layer1.style.transform = `translateY(${lastScrollY * 0.1}px)`;
                layer2.style.transform = `translateY(${lastScrollY * 0.05}px)`;
                layer3.style.transform = `translateY(${lastScrollY * 0.02}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ----------------------------------------
// OPTIMIZED BLOOD EFFECT SYSTEM
// ----------------------------------------
const BloodSystem = {
    // Configuration
    maxBloodElements: 30,     // Maximum number of blood elements to keep in the DOM
    dripPoolSize: 15,         // Number of drip elements to keep in the pool
    splatterPoolSize: 20,     // Number of splatter elements to keep in the pool
    lowPerformanceMode: false, // Set to true on low-end devices (will be auto-detected)
    
    // Element pools
    dripPool: [],
    splatterPool: [],
    
    // Tracking
    activeBloodElements: [],
    nextDripId: 0,
    nextSplatterId: 0,
    
    // Performance detection
    fpsValues: [],
    lastFrameTime: 0
};

// Initialize the blood effect system
function initBloodEffectSystem() {
    // Create blood container to help with organization and performance
    const bloodContainer = document.createElement('div');
    bloodContainer.id = 'blood-container';
    bloodContainer.style.position = 'fixed';
    bloodContainer.style.top = '0';
    bloodContainer.style.left = '0';
    bloodContainer.style.width = '100%';
    bloodContainer.style.height = '100%';
    bloodContainer.style.pointerEvents = 'none';
    bloodContainer.style.zIndex = '1000';
    bloodContainer.style.overflow = 'hidden';
    document.body.appendChild(bloodContainer);
    
    // Initialize element pools
    initializeBloodPools();
    
    // Check device performance
    detectPerformance();
    
    // Start periodic drips with reduced frequency compared to original
    setTimeout(addPeriodicBloodEffects, 3000);
}

// Create initial pools of reusable blood elements
function initializeBloodPools() {
    // Create drip pool
    for (let i = 0; i < BloodSystem.dripPoolSize; i++) {
        const drip = createBloodDripElement();
        BloodSystem.dripPool.push(drip);
    }
    
    // Create splatter pool
    for (let i = 0; i < BloodSystem.splatterPoolSize; i++) {
        const splatter = createBloodSplatterElement();
        BloodSystem.splatterPool.push(splatter);
    }
}

// Create a single blood drip element for the pool
function createBloodDripElement() {
    const drip = document.createElement('div');
    drip.className = 'blood-drip';
    drip.style.display = 'none'; // Hidden by default
    drip.dataset.inUse = 'false';
    document.getElementById('blood-container').appendChild(drip);
    return drip;
}

// Create a single blood splatter element for the pool
function createBloodSplatterElement() {
    const splatter = document.createElement('div');
    splatter.className = 'blood';
    splatter.style.display = 'none'; // Hidden by default
    splatter.dataset.inUse = 'false';
    document.getElementById('blood-container').appendChild(splatter);
    return splatter;
}

// Check device performance and adjust settings
function detectPerformance() {
    // Start performance monitoring
    BloodSystem.lastFrameTime = performance.now();
    let frameCount = 0;
    
    // Create a test splatter burst to measure performance
    createBloodSplatterBurst(5, window.innerWidth/2, window.innerHeight/2, 100, 1000);
    
    // Monitor FPS for a short period
    const testAnimation = () => {
        const now = performance.now();
        const elapsed = now - BloodSystem.lastFrameTime;
        
        if (elapsed > 1000) { // Every second
            const fps = frameCount / (elapsed / 1000);
            BloodSystem.fpsValues.push(fps);
            frameCount = 0;
            BloodSystem.lastFrameTime = now;
            
            if (BloodSystem.fpsValues.length >= 3) {
                // Calculate average FPS
                const avgFps = BloodSystem.fpsValues.reduce((a, b) => a + b, 0) / BloodSystem.fpsValues.length;
                
                // Set low performance mode if FPS is below threshold
                if (avgFps < 40) {
                    BloodSystem.lowPerformanceMode = true;
                    BloodSystem.maxBloodElements = 15; // Reduce max elements
                    console.log("Low performance mode activated for blood effects");
                }
                
                // Stop monitoring
                return;
            }
        }
        
        frameCount++;
        requestAnimationFrame(testAnimation);
    };
    
    requestAnimationFrame(testAnimation);
}

// Get a drip element from the pool or create a new one if needed
function getDripElement() {
    // First try to find an unused element in the pool
    for (let i = 0; i < BloodSystem.dripPool.length; i++) {
        if (BloodSystem.dripPool[i].dataset.inUse === 'false') {
            BloodSystem.dripPool[i].dataset.inUse = 'true';
            return BloodSystem.dripPool[i];
        }
    }
    
    // If pool is exhausted and we're under the limit, create a new element
    if (BloodSystem.activeBloodElements.length < BloodSystem.maxBloodElements) {
        const drip = createBloodDripElement();
        drip.dataset.inUse = 'true';
        BloodSystem.dripPool.push(drip);
        return drip;
    }
    
    // If we're at the limit, recycle the oldest element
    if (BloodSystem.activeBloodElements.length > 0) {
        // Get the oldest active element
        const oldest = BloodSystem.activeBloodElements.shift();
        
        // Reset any animations first
        oldest.style.animation = 'none';
        oldest.offsetHeight; // Force reflow
        
        return oldest;
    }
    
    // Fallback to the first pool element (shouldn't happen)
    return BloodSystem.dripPool[0];
}

// Get a splatter element from the pool or create a new one if needed
function getSplatterElement() {
    // First try to find an unused element in the pool
    for (let i = 0; i < BloodSystem.splatterPool.length; i++) {
        if (BloodSystem.splatterPool[i].dataset.inUse === 'false') {
            BloodSystem.splatterPool[i].dataset.inUse = 'true';
            return BloodSystem.splatterPool[i];
        }
    }
    
    // If pool is exhausted and we're under the limit, create a new element
    if (BloodSystem.activeBloodElements.length < BloodSystem.maxBloodElements) {
        const splatter = createBloodSplatterElement();
        splatter.dataset.inUse = 'true';
        BloodSystem.splatterPool.push(splatter);
        return splatter;
    }
    
    // If we're at the limit, recycle the oldest element
    if (BloodSystem.activeBloodElements.length > 0) {
        // Get the oldest active element
        const oldest = BloodSystem.activeBloodElements.shift();
        
        // Reset any animations first
        oldest.style.animation = 'none';
        oldest.offsetHeight; // Force reflow
        
        return oldest;
    }
    
    // Fallback to the first pool element (shouldn't happen)
    return BloodSystem.splatterPool[0];
}

// Release an element back to the pool
function releaseElement(element) {
    // Remove from active elements list
    const index = BloodSystem.activeBloodElements.indexOf(element);
    if (index > -1) {
        BloodSystem.activeBloodElements.splice(index, 1);
    }
    
    // Reset and hide the element
    element.style.display = 'none';
    element.style.animation = 'none';
    element.className = element.className.split(' ')[0]; // Reset to base class
    element.dataset.inUse = 'false';
    
    // Any additional cleanup needed
    element.style.transform = '';
    element.style.opacity = '';
}

// Handle click event for blood splatter
function handleBloodClick(e) {
    // Don't create effects if clicked in UI elements
    if (e.target.closest('.nav, .header, button, a, .toggle-switch, .music-controls')) {
        return;
    }
    
    // Create larger splatter at click point
    createBloodSplatter({pageX: e.pageX, pageY: e.pageY}, {
        size: '100px',
        duration: 1500
    });
    
    // Add a few smaller splatters around the click point for better effect
    const smallSplatterCount = BloodSystem.lowPerformanceMode ? 2 : 4;
    for (let i = 0; i < smallSplatterCount; i++) {
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        
        createBloodSplatter({
            pageX: e.pageX + offsetX, 
            pageY: e.pageY + offsetY
        }, {
            size: 30 + Math.random() * 30 + 'px',
            duration: 1000 + Math.random() * 500,
            delay: Math.random() * 200
        });
    }
    
    // Add 1-2 drips from the click point
    if (!BloodSystem.lowPerformanceMode) {
        const dripCount = 1 + Math.floor(Math.random());
        for (let i = 0; i < dripCount; i++) {
            const offsetX = (Math.random() - 0.5) * 20;
            createBloodDrip(e.pageX + offsetX, e.pageY, {
                delay: 100 + Math.random() * 200
            });
        }
    }
}

// Enhanced blood splatter with more variations
function createBloodSplatter(e, options = {}) {
    // Get coordinates
    const x = e.pageX || (e.left + e.width/2);
    const y = e.pageY || (e.top + e.height/2);
    
    // Get a splatter element from the pool
    const blood = getSplatterElement();
    
    // Apply settings
    const size = options.size || '80px';
    const duration = options.duration || 1500;
    const delay = options.delay || 0;
    
    // Determine color based on mode
    const isTerminal = document.body.classList.contains('terminal-mode');
    const baseColor = isTerminal ? '#00ff00' : '#ff3000';
    const shadowColor = isTerminal ? '0 0 8px rgba(0, 255, 0, 0.7)' : '0 0 8px rgba(255, 48, 0, 0.7)';
    
    // Set blood element styles
    blood.style.display = 'block';
    blood.style.left = (x - parseInt(size)/2) + 'px';
    blood.style.top = (y - parseInt(size)/2) + 'px';
    blood.style.width = size;
    blood.style.height = size;
    
    // Add some variations to make it more interesting
    const variation = Math.floor(Math.random() * 4);
    blood.className = 'blood blood-variation-' + variation;
    
    // Add custom CSS
    blood.style.boxShadow = shadowColor;
    
    // For splatter shape variation
    if (options.clipPath) {
        blood.style.clipPath = options.clipPath;
    } else {
        // Random splatter shapes using clip-path
        const clipPaths = [
            'circle(50% at 50% 50%)', // Normal circle
            'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Star
            'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', // Octagon
        ];
        
        // Use a random clip path or none
        if (Math.random() > 0.5) {
            const randomIndex = Math.floor(Math.random() * clipPaths.length);
            blood.style.clipPath = clipPaths[randomIndex];
        } else {
            blood.style.clipPath = '';
        }
    }
    
    // Apply any custom styles
    if (options.opacity) blood.style.opacity = options.opacity;
    if (options.transform) blood.style.transform = options.transform;
    
    // Apply animation with delay if specified
    setTimeout(() => {
        // Reset animation
        blood.style.animation = 'none';
        blood.offsetHeight; // Force reflow
        
        // Set new animation
        blood.style.animation = `blood ${duration}ms cubic-bezier(0.165, 0.84, 0.44, 1) forwards`;
        
        // Add to active elements
        BloodSystem.activeBloodElements.push(blood);
        
        // Schedule cleanup
        setTimeout(() => {
            releaseElement(blood);
        }, duration + 100);
    }, delay);
    
    return blood;
}

// Enhanced blood drip effect
function createBloodDrip(x, y, options = {}) {
    // Get a drip element from the pool
    const drip = getDripElement();
    
    // Apply settings
    const duration = options.duration || 2500;
    const delay = options.delay || 0;
    
    // Determine color based on mode
    const isTerminal = document.body.classList.contains('terminal-mode');
    const baseColor = isTerminal ? 
        'linear-gradient(to bottom, var(--terminal-green), var(--terminal-dark))' : 
        'linear-gradient(to bottom, var(--blood-red), var(--dark-red))';
    
    // Set drip element styles
    drip.style.display = 'block';
    drip.style.left = x + 'px';
    drip.style.top = y + 'px';
    drip.style.width = (1 + Math.random()) + 'px'; // Varying thickness
    drip.style.background = baseColor;
    drip.style.opacity = 0.8;
    
    // Apply animation with delay
    setTimeout(() => {
        // Reset animation
        drip.style.animation = 'none';
        drip.offsetHeight; // Force reflow
        
        // Set new animation with random duration
        const finalDuration = duration * (0.8 + Math.random() * 0.4);
        drip.style.animation = `drip ${finalDuration}ms ease-in forwards`;
        
        // Add to active elements
        BloodSystem.activeBloodElements.push(drip);
        
        // Schedule cleanup
        setTimeout(() => {
            releaseElement(drip);
        }, finalDuration + 100);
    }, delay);
    
    return drip;
}

// Multiple blood splatters at once
function createBloodSplatterBurst(count, centerX, centerY, range, duration) {
    // Reduce count for low performance mode
    const adjustedCount = BloodSystem.lowPerformanceMode ? Math.ceil(count / 2) : count;
    
    for (let i = 0; i < adjustedCount; i++) {
        setTimeout(() => {
            const x = centerX ? centerX - range/2 + Math.random() * range : Math.random() * window.innerWidth;
            const y = centerY ? centerY - range/2 + Math.random() * range : Math.random() * window.innerHeight;
            
            const size = (50 + Math.random() * 150) + 'px';
            
            createBloodSplatter({pageX: x, pageY: y}, {
                size: size,
                duration: duration || 1500,
                opacity: 0.7 + Math.random() * 0.3
            });
        }, i * (BloodSystem.lowPerformanceMode ? 150 : 100));
    }
}

// Helper function for creating blood drips at edges of sections
function createEdgeBloodDrips(container, count) {
    // Reduce count for low performance mode
    const adjustedCount = BloodSystem.lowPerformanceMode ? Math.ceil(count / 2) : count;
    
    const rect = container.getBoundingClientRect();
    
    for (let i = 0; i < adjustedCount; i++) {
        setTimeout(() => {
            let x, y;
            
            // Decide which edge to place the drip
            const edge = Math.floor(Math.random() * 4);
            
            switch (edge) {
                case 0: // Top edge
                    x = rect.left + Math.random() * rect.width;
                    y = rect.top;
                    break;
                case 1: // Right edge
                    x = rect.right;
                    y = rect.top + Math.random() * rect.height;
                    break;
                case 2: // Bottom edge
                    x = rect.left + Math.random() * rect.width;
                    y = rect.bottom;
                    break;
                case 3: // Left edge
                    x = rect.left;
                    y = rect.top + Math.random() * rect.height;
                    break;
            }
            
            createBloodDrip(x, y);
            
        }, i * 200);
    }
}

// Add periodic blood effects to the page
function addPeriodicBloodEffects() {
    // Only add periodic effects if we're not in low performance mode
    if (!BloodSystem.lowPerformanceMode) {
        // Get visible sections
        const sections = Array.from(document.querySelectorAll('.section')).filter(section => {
            const rect = section.getBoundingClientRect();
            return (
                rect.top < window.innerHeight &&
                rect.bottom > 0
            );
        });
        
        // Add drips to a random visible section
        if (sections.length > 0) {
            const randomSection = sections[Math.floor(Math.random() * sections.length)];
            const dripCount = 1 + Math.floor(Math.random() * 2); // 1-2 drips
            createEdgeBloodDrips(randomSection, dripCount);
        }
    }
    
    // Schedule next periodic effect
    const nextDelay = 5000 + Math.random() * 10000; // 5-15 seconds
    setTimeout(addPeriodicBloodEffects, nextDelay);
}

// Add CSS rules for blood variations
function addBloodVariationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Blood splatter variations */
        .blood-variation-0 {
            background: radial-gradient(circle, rgba(255, 48, 0, 0.9) 0%, rgba(128, 0, 0, 0.7) 70%, rgba(80, 0, 0, 0.5) 100%);
            border-radius: 50%;
        }
        
        .blood-variation-1 {
            background: radial-gradient(ellipse at center, rgba(255, 48, 0, 0.9) 0%, rgba(180, 0, 0, 0.8) 50%, rgba(80, 0, 0, 0.6) 100%);
            border-radius: 60% 40% 70% 30% / 40% 50% 60% 50%;
        }
        
        .blood-variation-2 {
            background: radial-gradient(circle at 30% 40%, rgba(255, 48, 0, 0.9) 0%, rgba(150, 10, 10, 0.8) 60%, rgba(80, 0, 0, 0.6) 100%);
            border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%;
        }
        
        .blood-variation-3 {
            background: radial-gradient(ellipse at 40% 30%, rgba(255, 48, 0, 0.9) 0%, rgba(128, 0, 0, 0.7) 50%, rgba(80, 0, 0, 0.5) 100%);
            border-radius: 30% 70% 40% 60% / 60% 30% 70% 40%;
        }
        
        /* Terminal mode variations */
        body.terminal-mode .blood-variation-0 {
            background: radial-gradient(circle, rgba(0, 255, 0, 0.9) 0%, rgba(0, 128, 0, 0.7) 70%, rgba(0, 80, 0, 0.5) 100%);
        }
        
        body.terminal-mode .blood-variation-1 {
            background: radial-gradient(ellipse at center, rgba(0, 255, 0, 0.9) 0%, rgba(0, 180, 0, 0.8) 50%, rgba(0, 80, 0, 0.6) 100%);
        }
        
        body.terminal-mode .blood-variation-2 {
            background: radial-gradient(circle at 30% 40%, rgba(0, 255, 0, 0.9) 0%, rgba(10, 150, 10, 0.8) 60%, rgba(0, 80, 0, 0.6) 100%);
        }
        
        body.terminal-mode .blood-variation-3 {
            background: radial-gradient(ellipse at 40% 30%, rgba(0, 255, 0, 0.9) 0%, rgba(0, 128, 0, 0.7) 50%, rgba(0, 80, 0, 0.5) 100%);
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Add blood variation styles on page load
document.addEventListener('DOMContentLoaded', addBloodVariationStyles);