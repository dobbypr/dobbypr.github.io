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
    
    document.body.appendChild(blood);
    
    setTimeout(() => {
        blood.remove();
    }, options.duration || 1000);
}

document.addEventListener('click', createBloodSplatter);

// Parallax scrolling effect
document.addEventListener('DOMContentLoaded', function() {
    // Create parallax container and layers
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
    
    // Loading screen functionality
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
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const drip = document.createElement('div');
            drip.className = 'blood-drip';
            drip.style.left = Math.random() * 100 + '%';
            drip.style.animationDuration = (1 + Math.random() * 2) + 's';
            bloodDrips.appendChild(drip);
            
            // Remove drip after animation completes
            setTimeout(() => {
                drip.remove();
            }, 3000);
        }, i * 200);
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
    
    // Update loading progress
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = progress + '%';
        
        if (messageIndex < messages.length) {
            loadingMessage.textContent = messages[messageIndex];
            messageIndex++;
        }
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            
            // Final message
            loadingMessage.textContent = "WELCOME TO HELL";
            
            // Hide loading screen after delay
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingScreen.remove();
                }, 1500);
            }, 1000);
        }
    }, 400);
    
    // Terminal mode toggle functionality
    // Create terminal mode toggle
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
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the terminal mode toggle
    const toggle = document.querySelector('.terminal-mode-toggle');
    
    if (toggle) {
        toggle.addEventListener('click', function() {
            if (document.body.classList.contains('terminal-mode')) {
                // Terminal boot sequence
                console.log("Terminal mode activated");
                
                // Add typing effect to section titles and paragraphs
                const elements = document.querySelectorAll('.section-title, #home p, .project-card h3');
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
            }
        });
    }
});

// Terminal mode keyboard commands
document.addEventListener('keydown', function(e) {
    // Only respond to keypresses when in terminal mode
    if (!document.body.classList.contains('terminal-mode')) return;
    
    // Secret key combinations
    if (e.ctrlKey && e.altKey && e.key === 'h') {
        // CTRL+ALT+H - Show hidden message
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
    
    // Terminal command simulation (press backtick to activate)
    if (e.key === '`') {
        e.preventDefault();
        
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
                        - blood: Toggle blood mode
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
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => {
                            const x = Math.random() * window.innerWidth;
                            const y = Math.random() * window.innerHeight;
                            
                            const options = {
                                color: document.body.classList.contains('terminal-mode') ? '#00ff00' : '#ff0000',
                                boxShadow: `0 0 10px ${document.body.classList.contains('terminal-mode') ? '#00ff00' : '#ff0000'}`
                            };
                            
                            createBloodSplatter({pageX: x, pageY: y}, options);
                        }, i * 100);
                    }
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
});