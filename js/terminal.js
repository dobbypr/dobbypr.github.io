// Terminal mode functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create terminal mode toggle
    initTerminalToggle();
    
    // Add keyboard event listener for terminal commands
    initTerminalKeyboardCommands();
});

// Initialize terminal mode toggle
function initTerminalToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'terminal-mode-toggle';

    const toggleLabel = document.createElement('div');
    toggleLabel.className = 'toggle-label';
    toggleLabel.textContent = 'TERMINAL';

    const toggleSwitch = document.createElement('div');
    toggleSwitch.className = 'toggle-switch';

    toggle.appendChild(toggleLabel);
    toggle.appendChild(toggleSwitch);
    document.body.appendChild(toggle);

    // Terminal mode toggle click handler
    toggle.addEventListener('click', function() {
        document.body.classList.toggle('terminal-mode');

        // Toggle terminal mode classes on the toggle itself
        toggle.classList.toggle('terminal-mode');

        // Create special effect when toggling modes
        const flashEffect = document.createElement('div');
        flashEffect.style.position = 'fixed';
        flashEffect.style.top = '0';
        flashEffect.style.left = '0';
        flashEffect.style.width = '100%';
        flashEffect.style.height = '100%';
        flashEffect.style.backgroundColor = document.body.classList.contains('terminal-mode') ? '#00ff00' : '#ff0000';
        flashEffect.style.opacity = '0.2';
        flashEffect.style.zIndex = '9998';
        flashEffect.style.pointerEvents = 'none';
        document.body.appendChild(flashEffect);

        // Remove the flash effect after animation
        setTimeout(() => {
            flashEffect.remove();
        }, 300);

        // Play a mode switch sound
        if (typeof playTerminalSound === 'function') {
            playTerminalSound();
        }

        // Apply terminal mode enhancements when activated
        if (document.body.classList.contains('terminal-mode')) {
            applyTerminalModeEffects();
        }
    });
}

// Initialize keyboard commands for terminal mode
function initTerminalKeyboardCommands() {
    document.addEventListener('keydown', function(e) {
        // Only respond to keypresses when in terminal mode
        if (!document.body.classList.contains('terminal-mode')) return;

        // Secret key combinations
        if (e.ctrlKey && e.altKey && e.key === 'h') {
            // CTRL+ALT+H - Show hidden message
            showHiddenMessage();
        }

        // Terminal command simulation (press backtick to activate)
        if (e.key === '`') {
            e.preventDefault();
            openTerminalConsole();
        }
    });
}

// Show hidden message when secret key combination is pressed
function showHiddenMessage() {
    const hiddenMessage = document.createElement('div');
    hiddenMessage.style.position = 'fixed';
    hiddenMessage.style.top = '50%';
    hiddenMessage.style.left = '50%';
    hiddenMessage.style.transform = 'translate(-50%, -50%)';
    hiddenMessage.style.backgroundColor = 'rgba(0, 20, 0, 0.9)';
    hiddenMessage.style.border = '1px solid #00ff00';
    hiddenMessage.style.padding = '20px';
    hiddenMessage.style.color = '#00ff00';
    hiddenMessage.style.fontFamily = 'monospace';
    hiddenMessage.style.zIndex = '9999';
    hiddenMessage.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    hiddenMessage.style.maxWidth = '80%';
    hiddenMessage.style.textAlign = 'center';

    hiddenMessage.innerHTML = `
        <h3>HIDDEN MESSAGE DETECTED</h3>
        <p>CONGRATULATIONS HUMAN, YOU HAVE FOUND A SECRET</p>
        <p>THE MACHINE SEES ALL</p>
        <p style="font-size: 10px">Press ESC to close this message</p>
    `;

    document.body.appendChild(hiddenMessage);

    // Allow closing with ESC key
    const escHandler = function(evt) {
        if (evt.key === 'Escape') {
            hiddenMessage.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };

    document.addEventListener('keydown', escHandler);
}

// Open the terminal console
function openTerminalConsole() {
    // Create terminal input
    const terminal = document.createElement('div');
    terminal.style.position = 'fixed';
    terminal.style.bottom = '0';
    terminal.style.left = '0';
    terminal.style.width = '100%';
    terminal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    terminal.style.padding = '10px';
    terminal.style.color = '#00ff00';
    terminal.style.fontFamily = 'monospace';
    terminal.style.zIndex = '9999';
    terminal.style.borderTop = '1px solid #00ff00';

    const prompt = document.createElement('div');
    prompt.innerHTML = '<span style="color:#00aa00">ultralayer@machine</span>:<span style="color:#0088ff">~</span>$ <span id="terminal-input"></span><span class="cursor" style="animation: cursor-blink 1s infinite; display: inline-block;">█</span>';

    terminal.appendChild(prompt);
    document.body.appendChild(terminal);

    // Focus terminal
    terminal.tabIndex = -1;
    terminal.focus();

    // Terminal input handling
    let input = '';
    const inputSpan = document.querySelector('#terminal-input');

    const terminalHandler = function(evt) {
        // ESC closes the terminal
        if (evt.key === 'Escape') {
            terminal.remove();
            document.removeEventListener('keydown', terminalHandler);
            return;
        }

        // Enter processes the command
        if (evt.key === 'Enter') {
            const response = document.createElement('div');

            // Process commands
            if (input === 'help') {
                response.innerHTML = `
                    Available commands:<br>
                    - help: Show this help<br>
                    - about: Display information about this site<br>
                    - exit: Close terminal<br>
                    - clear: Clear the terminal<br>
                    - blood: Toggle blood mode<br>
                    - music: Play background music<br>
                    - mute: Stop all sounds
                `;
            } else if (input === 'about') {
                response.innerHTML = `
                    ULTRALAYER v1.0<br>
                    A tribute to ULTRAKILL<br>
                    Created with HTML, CSS, and JavaScript<br>
                    MANKIND IS DEAD. BLOOD IS FUEL. WEBSITE IS FULL.
                `;
            } else if (input === 'exit') {
                terminal.remove();
                document.removeEventListener('keydown', terminalHandler);
                return;
            } else if (input === 'clear') {
                // Clear all children except the prompt
                while (terminal.children.length > 1) {
                    terminal.removeChild(terminal.children[0]);
                }
                input = '';
                inputSpan.textContent = input;
                return;
            } else if (input === 'blood') {
                response.textContent = "Toggling blood mode...";

                // Create 20 random blood splatters
                if (typeof createBloodSplatterBurst === 'function') {
                    createBloodSplatterBurst(20, null, null, null, 1500);
                }
            } else if (input === 'music') {
                response.textContent = "Playing background music...";

                // Create and play ambient background music
                const ambientMusic = document.createElement('audio');
                ambientMusic.id = 'ambient-music';
                ambientMusic.volume = 0.3;
                ambientMusic.loop = true;

                ambientMusic.innerHTML = `
                    <source src="audio/ambient.mp3" type="audio/mpeg">
                `;

                document.body.appendChild(ambientMusic);
                ambientMusic.play().catch(e => {
                    response.textContent = "Couldn't play music: " + e.message;
                });
            } else if (input === 'mute') {
                response.textContent = "Muting all sounds...";

                // Find and stop all audio elements
                const audioElements = document.querySelectorAll('audio');
                audioElements.forEach(audio => {
                    audio.pause();
                    audio.currentTime = 0;
                });
            } else if (input.trim() === '') {
                // Empty command, just show a new prompt
            } else {
                response.textContent = `Command not found: ${input}`;
            }

            if (input !== 'clear') {
                terminal.insertBefore(response, prompt);
            }

            // Reset input
            input = '';
            inputSpan.textContent = input;
        } else if (evt.key === 'Backspace') {
            input = input.slice(0, -1);
            inputSpan.textContent = input;
        } else if (evt.key.length === 1) {
            input += evt.key;
            inputSpan.textContent = input;
        }

        evt.preventDefault();
    };

    document.addEventListener('keydown', terminalHandler);
}

// Apply terminal mode special effects
function applyTerminalModeEffects() {
    console.log("Terminal mode activated");

    // Add typing effect to section titles and paragraphs
    const elements = document.querySelectorAll('.section-title, #home p, .project-card h3, #sins .sin-title, #music .music-item h3');
    elements.forEach(element => {
        const originalText = element.textContent;
        let visibleText = '';
        element.textContent = '';

        // Type each character with a slight delay
        const typeEffect = setInterval(() => {
            if (visibleText.length < originalText.length) {
                visibleText += originalText[visibleText.length];
                element.textContent = visibleText + (Math.random() > 0.7 ? '█' : '');
            } else {
                clearInterval(typeEffect);
                element.textContent = originalText;
            }
        }, 30);
    });

    // Add binary data stream effect on the right side
    const dataStream = document.createElement('div');
    dataStream.className = 'terminal-data-stream';
    dataStream.style.position = 'fixed';
    dataStream.style.top = '0';
    dataStream.style.right = '0';
    dataStream.style.width = '150px';
    dataStream.style.height = '100%';
    dataStream.style.background = 'transparent';
    dataStream.style.zIndex = '999';
    dataStream.style.pointerEvents = 'none';
    dataStream.style.overflow = 'hidden';
    document.body.appendChild(dataStream);

    // Create falling binary digits
    const streamInterval = setInterval(() => {
        if (!document.body.classList.contains('terminal-mode')) {
            clearInterval(streamInterval);
            dataStream.remove();
            return;
        }

        const dataChar = document.createElement('div');
        dataChar.textContent = Math.random() > 0.5 ? '1' : '0';
        dataChar.style.position = 'absolute';
        dataChar.style.color = '#00ff00';
        dataChar.style.opacity = '0.5';
        dataChar.style.fontSize = '10px';
        dataChar.style.top = '-20px';
        dataChar.style.left = Math.floor(Math.random() * 150) + 'px';
        dataStream.appendChild(dataChar);

        let pos = -20;
        const fall = setInterval(() => {
            pos += 2;
            dataChar.style.top = pos + 'px';
            if (pos > window.innerHeight) {
                clearInterval(fall);
                dataChar.remove();
            }
        }, 30);
    }, 100);

    // Add terminal message effect to the console
    const terminalMessages = [
        "%c[SYSTEM] Terminal mode activated",
        "%c[SYSTEM] Loading modules...",
        "%c[SYSTEM] HOME module loaded",
        "%c[SYSTEM] ABOUT module loaded",
        "%c[SYSTEM] PROJECTS module loaded",
        "%c[SYSTEM] MUSIC module loaded",
        "%c[SYSTEM] SINS module loaded",
        "%c[SYSTEM] CONTACT module loaded",
        "%c[SYSTEM] System ready"
    ];

    terminalMessages.forEach((message, index) => {
        setTimeout(() => {
            console.log(message, "color: #00ff00; font-family: monospace;");
        }, index * 200);
    });

    // Create "scan line" effect that moves down the page once
    const scanLine = document.createElement('div');
    scanLine.style.position = 'fixed';
    scanLine.style.top = '0';
    scanLine.style.left = '0';
    scanLine.style.width = '100%';
    scanLine.style.height = '2px';
    scanLine.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
    scanLine.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.7)';
    scanLine.style.zIndex = '1000';
    scanLine.style.pointerEvents = 'none';
    document.body.appendChild(scanLine);

    let scanPos = 0;
    const scanInterval = setInterval(() => {
        scanPos += 5;
        scanLine.style.top = scanPos + 'px';

        if (scanPos > window.innerHeight) {
            clearInterval(scanInterval);
            scanLine.remove();
        }
    }, 10);
    
    // Add special terminal mode effects for specific pages
    if (document.getElementById('sins')) {
        applyTerminalSinsEffects();
    }
    
    if (document.getElementById('music')) {
        applyTerminalMusicEffects();
    }
}

// Apply terminal mode effects specifically for sins page
function applyTerminalSinsEffects() {
    // Add terminal style headers to sin cards
    const sinCards = document.querySelectorAll('.sin-card');
    
    sinCards.forEach((card, index) => {
        // Add a data section at the top of each card
        const dataSection = document.createElement('div');
        dataSection.style.position = 'absolute';
        dataSection.style.top = '5px';
        dataSection.style.left = '5px';
        dataSection.style.fontSize = '10px';
        dataSection.style.fontFamily = 'monospace';
        dataSection.style.color = 'var(--terminal-highlight)';
        dataSection.style.opacity = '0.7';
        dataSection.style.zIndex = '2';
        
        // Different ID for each sin
        const sinType = card.classList[1] || 'unknown';
        dataSection.textContent = `sin_id: ${sinType}_${index+1}`;
        
        card.appendChild(dataSection);
        
        // Add random data blips that appear and disappear
        setInterval(() => {
            if (!document.body.classList.contains('terminal-mode')) return;
            
            const blip = document.createElement('div');
            blip.style.position = 'absolute';
            blip.style.top = Math.random() * 100 + '%';
            blip.style.left = Math.random() * 100 + '%';
            blip.style.fontSize = '8px';
            blip.style.fontFamily = 'monospace';
            blip.style.color = 'var(--terminal-highlight)';
            blip.style.opacity = '0.5';
            blip.style.zIndex = '1';
            
            // Random binary or hex code
            if (Math.random() > 0.5) {
                blip.textContent = Math.random().toString(2).substring(2, 10);
            } else {
                blip.textContent = Math.random().toString(16).substring(2, 6);
            }
            
            card.appendChild(blip);
            
            // Remove after a short time
            setTimeout(() => {
                blip.remove();
            }, 1000 + Math.random() * 2000);
        }, 2000 + Math.random() * 3000);
    });
}

// Apply terminal mode effects specifically for music page
function applyTerminalMusicEffects() {
    // Add terminal-style track info to music items
    const musicItems = document.querySelectorAll('.music-item');
    
    musicItems.forEach((item) => {
        // Add data section for each track
        const trackList = item.querySelector('.track-list');
        
        if (trackList) {
            const tracks = trackList.querySelectorAll('li');
            
            tracks.forEach((track, index) => {
                // Create formatted terminal-style track info
                const trackInfo = document.createElement('span');
                trackInfo.style.fontSize = '9px';
                trackInfo.style.fontFamily = 'monospace';
                trackInfo.style.color = 'var(--terminal-highlight)';
                trackInfo.style.opacity = '0.7';
                trackInfo.style.display = 'block';
                
                // Random file size and bit rate
                const fileSize = (2 + Math.random() * 8).toFixed(1);
                const bitRate = Math.floor(128 + Math.random() * 192);
                
                trackInfo.textContent = `[${fileSize}MB | ${bitRate}kbps | track_${index+1}.mp3]`;
                
                // Add to track element
                track.appendChild(trackInfo);
            });
        }
    });
}