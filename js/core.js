// Main initialization and core functionality
document.addEventListener('DOMContentLoaded', function() {
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

        // Try to play intro music after user interaction
        if (typeof initAudio === 'function') {
            initAudio();
        }

        // Start the loading sequence
        initLoadingScreen();
    });

    // Initialize the loading screen
    function initLoadingScreen() {
        // Create loading screen elements
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';

        const loadingTitle = document.createElement('div');
        loadingTitle.className = 'loading-title';
        loadingTitle.textContent = 'ULTRALAYER';

        const loadingBarContainer = document.createElement('div');
        loadingBarContainer.className = 'loading-bar-container';

        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';

        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-message';

        const bloodDrips = document.createElement('div');
        bloodDrips.className = 'blood-drips';

        // Assemble loading screen
        loadingBarContainer.appendChild(loadingBar);
        loadingScreen.appendChild(loadingTitle);
        loadingScreen.appendChild(loadingBarContainer);
        loadingScreen.appendChild(loadingMessage);
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
            "PREPARING YOUR DESCENT...",
            "MANKIND IS DEAD...",
            "BLOOD IS FUEL...",
            "WEBSITE IS FULL..."
        ];

        let messageIndex = 0;
        let progress = 0;
        let musicPaused = false;

        // Update loading progress
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;

            loadingBar.style.width = progress + '%';

            if (messageIndex < messages.length) {
                loadingMessage.textContent = messages[messageIndex];
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
                        weaponPickup.innerHTML = `<div class="weapon-icon"></div><div class="pickup-text">REVOLVER ACQUIRED</div>`;
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
                    loadingMessage.textContent = "WELCOME TO HELL";

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
    }

    // Music page specific initialization
    function initMusicPage() {
        // Add event listeners for music controls if they exist
        const expandButtons = document.querySelectorAll('.expand-btn');
        
        expandButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const musicItemId = this.closest('.music-item').id;
                toggleDetails(musicItemId);
            });
        });

        // Function to toggle details section visibility
        function toggleDetails(id) {
            const item = document.getElementById(id);
            item.classList.toggle('expanded');
            
            const btn = item.querySelector('.expand-btn');
            if (item.classList.contains('expanded')) {
                btn.textContent = 'SHOW LESS';
            } else {
                btn.textContent = 'SHOW MORE';
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

    // Call page specific initializations
    initPageSpecific();
});