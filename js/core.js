// Main initialization and core functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Dynamic "Last Updated" Date
    const lastUpdatedP = document.getElementById('last-updated');
    if (lastUpdatedP) {
        const today = new Date();
        const day = today.getDate();
        const year = today.getFullYear();
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                           "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const month = monthNames[today.getMonth()];
        const prefix = "FORGED IN BLOOD AND CODE // LAST SYSTEM UPDATE: ";
        lastUpdatedP.textContent = `${prefix}${month} ${day}, ${year}`;
    }

    // Check if we've already been through the intro
    const hasVisitedBefore = sessionStorage.getItem('ultraLayerVisited');
    
    if (!hasVisitedBefore) {
        // First visit - show start screen
        initFirstVisit();
    } else {
        // Returning visitor - skip intro and initialize features
        initSiteFeatures();
        
        // If we have a hash in the URL (e.g. #music), scroll to it
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    // Initialize first visit experience with start screen and loading
    function initFirstVisit() {
        // Create start screen to get user interaction first
        const startScreen = document.createElement('div');
        startScreen.className = 'start-screen';
        startScreen.innerHTML = `
            <div class="start-title">ULTRALAYER</div>
            <div class="start-subtitle">ENTER HELL</div>
            <div class="start-button">CLICK TO BEGIN</div>
            <div class="start-note">
                <span class="blink">!</span> AUDIO EXPERIENCE <span class="blink">!</span>
            </div>
        `;
        document.body.appendChild(startScreen);

        // Hide everything else until user clicks
        document.querySelector('.container').style.display = 'none';

        // When user clicks the start screen, remove it and show the site
        startScreen.addEventListener('click', function() {
            // Enable audio (this click will allow autoplay)
            startScreen.remove();
            document.querySelector('.container').style.display = 'block';

            // Set flag for visited
            sessionStorage.setItem('ultraLayerVisited', 'true');

            // Try to play intro music after user interaction
            if (typeof initAudio === 'function') {
                initAudio();
            }

            // Start the loading sequence
            initLoadingScreen();
        });
    }

    // Enhanced loading screen
    function initLoadingScreen() {
        // Create loading screen elements
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';

        // Add stylized container for loading elements
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        
        const loadingTitle = document.createElement('div');
        loadingTitle.className = 'loading-title';
        loadingTitle.innerHTML = 'ULTRA<span class="loading-title-layer">LAYER</span>';

        const loadingBarContainer = document.createElement('div');
        loadingBarContainer.className = 'loading-bar-container';

        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        
        // Add glitch overlay to loading bar
        const loadingBarGlitch = document.createElement('div');
        loadingBarGlitch.className = 'loading-bar-glitch';

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';
        
        // Add decorative terminal prefix to loading messages
        const loadingPrefix = document.createElement('span');
        loadingPrefix.className = 'loading-prefix';
        loadingPrefix.textContent = '>';
        loadingMessage.appendChild(loadingPrefix);
        
        const loadingText = document.createElement('span');
        loadingText.className = 'loading-text';
        loadingMessage.appendChild(loadingText);

        // Add percentage counter
        const loadingPercent = document.createElement('div');
        loadingPercent.className = 'loading-percent';
        loadingPercent.textContent = '0%';

        const bloodDrips = document.createElement('div');
        bloodDrips.className = 'blood-drips';

        // Assemble loading screen
        loadingBarContainer.appendChild(loadingBar);
        loadingBarContainer.appendChild(loadingBarGlitch);
        loadingContainer.appendChild(loadingTitle);
        loadingContainer.appendChild(loadingBarContainer);
        loadingContainer.appendChild(loadingMessage);
        loadingContainer.appendChild(loadingPercent);
        loadingScreen.appendChild(loadingContainer);
        loadingScreen.appendChild(bloodDrips);
        document.body.appendChild(loadingScreen);

        // Create random blood drips animation
        if (typeof createBloodDrips === 'function') {
            createBloodDrips(bloodDrips, 20);
        }

        // Loading messages
        const messages = [
            "INITIALIZING BLOOD PUMPS...",
            "CALIBRATING VIOLENCE...",
            "LOADING THE MACHINE...",
            "COMPILING UNHOLY ASSETS...",
            "MANKIND IS DEAD...",
            "BLOOD IS FUEL...",
            "WEBSITE IS FULL..."
        ];

        let messageIndex = 0;
        let progress = 0;
        let musicPaused = false;

        // Update loading progress
        const loadingInterval = setInterval(() => {
            // More consistent progress increment
            const increment = Math.random() * 5 + 2; // 2-7% increment
            progress += increment;
            if (progress > 100) progress = 100;

            // Update bar width with smoother transition
            loadingBar.style.transition = 'width 0.3s ease-out';
            loadingBar.style.width = progress + '%';
            
            // Update percentage text
            loadingPercent.textContent = Math.floor(progress) + '%';
            
            // More dynamic glitch effect on the loading bar
            if (Math.random() > 0.7) {
                loadingBarGlitch.style.opacity = Math.random() * 0.5;
                loadingBarGlitch.style.left = (Math.random() * progress) + '%';
                loadingBarGlitch.style.width = (5 + Math.random() * 20) + '%';
                
                setTimeout(() => {
                    loadingBarGlitch.style.opacity = '0';
                }, 150);
            }

            // Update message with typing effect
            if (messageIndex < messages.length) {
                loadingText.textContent = messages[messageIndex];
                messageIndex++;
            }

            // When we reach 70%, pause the intro music and show weapon pickup
            if (progress >= 70 && !musicPaused) {
                musicPaused = true;

                // Fade out the intro music
                if (typeof introMusic !== 'undefined' && typeof fadeAudio === 'function') {
                    fadeAudio(introMusic, 0, 1000, function() {
                        introMusic.pause();

                        // Add a weapon pickup animation/effect
                        const weaponPickup = document.createElement('div');
                        weaponPickup.className = 'weapon-pickup';
                        weaponPickup.innerHTML = `
                            <div class="pickup-container">
                                <div class="weapon-icon"></div>
                                <div class="pickup-text">
                                    <div class="pickup-title">REVOLVER ACQUIRED</div>
                                    <div class="pickup-desc">THE HUMBLE BEGINNING OF ALL VIOLENCE</div>
                                </div>
                            </div>
                        `;
                        loadingScreen.appendChild(weaponPickup);

                        // Create blood splatter effect
                        if (typeof createBloodSplatterBurst === 'function') {
                            createBloodSplatterBurst(10, window.innerWidth/2, window.innerHeight/2, 150, 1500);
                        }

                        // Remove the weapon pickup after animation completes
                        setTimeout(() => {
                            if (weaponPickup.parentNode) {
                                weaponPickup.remove();
                            }
                        }, 2500);
                    });
                }
            }

            if (progress === 100) {
                clearInterval(loadingInterval);
                // Final message - only after weapon pickup is gone
                setTimeout(() => {
                    loadingText.textContent = "WELCOME TO HELL";
                    
                    // Final percentage pulse effect
                    loadingPercent.classList.add('complete');

                    // Play the drop section of the music
                    if (typeof dropMusic !== 'undefined' && typeof playAudioWithFallback === 'function') {
                        playAudioWithFallback(dropMusic);
                    }

                    // Intensify the final effect
                    loadingScreen.classList.add('final-stage');

                    // Trigger even more blood splatter for the finale
                    if (typeof createBloodSplatterBurst === 'function') {
                        createBloodSplatterBurst(20, null, null, 300, 2000);
                    }

                    // Hide loading screen after delay - longer to match music drop
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');

                        // Instead of fading out completely, just reduce volume
                        if (typeof dropMusic !== 'undefined' && typeof fadeAudio === 'function') {
                            fadeAudio(dropMusic, 0.2, 2000);
                        }

                        // Remove loading screen from DOM after transition
                        setTimeout(() => {
                            loadingScreen.remove();
                            
                            // Initialize site features after loading completes
                            initSiteFeatures();
                        }, 1500);
                        
                        // Let drop.mp3 play until it naturally ends
                        if (typeof dropMusic !== 'undefined') {
                            dropMusic.addEventListener('ended', function() {
                                // Fade out music gradually at the end
                                if (typeof fadeAudio === 'function') {
                                    fadeAudio(dropMusic, 0, 1000, function() {
                                        dropMusic.pause();
                                        dropMusic.remove();
                                    });
                                }
                            });
                        }
                    }, 3000); // Longer delay to enjoy the drop
                }, 1000); // Delay to ensure weapon pickup has completed.
            }
        }, 400);
    }

    // Initialize site features (runs for both new and returning visitors)
    function initSiteFeatures() {
        // Initialize any page-specific features
        initPageSpecific();
        
        // Add common site interactions and effects
        initSiteInteractions();
    }
    
    // Site-wide interactive elements
    function initSiteInteractions() {
        // Add hover effects to navigation
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (typeof createBloodSplatter === 'function') {
                    const rect = this.getBoundingClientRect();
                    createBloodSplatter({
                        pageX: rect.left + rect.width/2,
                        pageY: rect.bottom
                    }, {
                        size: '40px',
                        opacity: 0.3
                    });
                }
            });
        });
        
        // Add scroll-to-top button if it doesn't exist
        if (!document.querySelector('.scroll-top')) {
            const scrollButton = document.createElement('div');
            scrollButton.className = 'scroll-top';
            scrollButton.innerHTML = '↑';
            document.body.appendChild(scrollButton);
            
            // Show/hide scroll button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    scrollButton.classList.add('visible');
                } else {
                    scrollButton.classList.remove('visible');
                }
            });
            
            // Scroll to top when clicked
            scrollButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Initialize any page-specific features
    function initPageSpecific() {
        // Check if we're on the music page
        if (document.getElementById('music')) {
            // Initialize music page specific functionality
            initMusicPage();
        }
        
        // Check if we're on the sins page
        if (document.getElementById('sins')) {
            // Initialize sins page specific functionality
            initSinsPage();
        }
        
        // Check if we're on the blog page
        if (document.getElementById('blog')) {
            // Initialize blog page specific functionality
            initBlogPage();
        }
    }

    // Music page specific initialization
    function initMusicPage() {
        // Initialize tab functionality
        initTabs();
        
        // Add event listeners for music controls if they exist
        const expandButtons = document.querySelectorAll('.expand-btn');
        
        expandButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const musicItemId = this.closest('.music-item').id;
                toggleDetails(musicItemId);
            });
        });
    }

    // Tab functionality for music page
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get the target pane ID from the data attribute
                const targetId = this.getAttribute('data-tab-target');
                
                if (!targetId) {
                    console.error('Tab button is missing data-tab-target attribute');
                    return;
                }
                
                // Remove active class from all tab buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Remove active class from all tab panes
                const tabPanes = document.querySelectorAll('.music-tab-pane');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Add active class to targeted pane
                const targetPane = document.querySelector(targetId);
                if (targetPane) {
                    targetPane.classList.add('active');
                    
                    // Create blood splatter effect when switching tabs
                    if (typeof createBloodSplatterBurst === 'function') {
                        const rect = targetPane.getBoundingClientRect();
                        createBloodSplatterBurst(
                            5, 
                            rect.left + rect.width/2, 
                            rect.top + rect.height/4, 
                            100, 
                            1000
                        );
                    }
                } else {
                    console.error(`Target tab pane ${targetId} not found`);
                }
            });
        });
        
        // Make sure at least one tab is active
        if (tabButtons.length > 0 && !document.querySelector('.tab-button.active')) {
            tabButtons[0].click();
        }
    }

    // Function to toggle details section visibility
    function toggleDetails(id) {
        const item = document.getElementById(id);
        if (!item) return;
        
        item.classList.toggle('expanded');
        
        const btn = item.querySelector('.expand-btn');
        if (btn) {
            if (item.classList.contains('expanded')) {
                btn.textContent = 'SHOW LESS';
            } else {
                btn.textContent = 'ANALYZE';
            }
        }
        
        // Create extra blood splatters on expand/collapse
        if (typeof createBloodSplatter === 'function') {
            const rect = item.getBoundingClientRect();
            
            // Create 3 blood splatters at random positions within the element
            for (let i = 0; i < 3; i++) {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                
                createBloodSplatter({pageX: x, pageY: y});
            }
        }
    }

    // Sins page specific initialization
    function initSinsPage() {
        // Add any sins page specific functionality here
        const sinCards = document.querySelectorAll('.sin-card');
        
        sinCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add subtle effects when hovering over sin cards
                if (typeof createBloodSplatter === 'function') {
                    const rect = this.getBoundingClientRect();
                    const x = rect.left + rect.width/2;
                    const y = rect.top + rect.height/2;
                    
                    createBloodSplatter({pageX: x, pageY: y}, {
                        width: '150px',
                        height: '150px',
                        opacity: 0.3,
                        duration: 800
                    });
                }
            });
        });
    }
    
    // Blog page specific initialization
    function initBlogPage() {
        // Blog post previews hover effects
        const blogPosts = document.querySelectorAll('.blog-post-card');
        
        blogPosts.forEach(post => {
            post.addEventListener('mouseenter', function() {
                // Add subtle effects when hovering over blog posts
                if (typeof createBloodSplatter === 'function') {
                    const rect = this.getBoundingClientRect();
                    const x = rect.right - 20;
                    const y = rect.top + 20;
                    
                    createBloodSplatter({pageX: x, pageY: y}, {
                        size: '60px',
                        opacity: 0.2,
                        duration: 1000
                    });
                }
            });
        });
    }
});