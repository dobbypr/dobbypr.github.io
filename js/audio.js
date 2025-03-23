// Global audio elements
let introMusic;
let dropMusic;

// Initialize audio functionality
function initAudio() {
    // Create audio elements
    introMusic = document.createElement('audio');
    introMusic.id = 'intro-music';
    introMusic.volume = 0.7;
    introMusic.loop = false; // Ensure it doesn't loop

    dropMusic = document.createElement('audio');
    dropMusic.id = 'drop-music';
    dropMusic.volume = 0.7;
    dropMusic.loop = false;

    // Set source - add proper fallbacks for browser compatibility
    introMusic.innerHTML = `
        <source src="audio/intro.mp3" type="audio/mpeg">
        <source src="audio/intro.ogg" type="audio/ogg">
    `;

    dropMusic.innerHTML = `
        <source src="audio/drop.mp3" type="audio/mpeg">
        <source src="audio/drop.ogg" type="audio/ogg">
    `;

    // Add to document but keep hidden
    document.body.appendChild(introMusic);
    document.body.appendChild(dropMusic);

    // Try to play intro music
    playAudioWithFallback(introMusic);
}

// Function to handle audio playback with fallbacks
function playAudioWithFallback(audioElement) {
    // Promise-based approach for modern browsers
    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Playback started successfully
            console.log("Audio playback started successfully");
        }).catch(error => {
            // Auto-play was prevented
            console.log("Audio playback blocked: ", error);

            // Add a play button as fallback if needed
            if (!document.getElementById('audio-fallback-btn')) {
                const audioBtn = document.createElement('button');
                audioBtn.id = 'audio-fallback-btn';
                audioBtn.textContent = 'ENABLE AUDIO';
                audioBtn.style.position = 'fixed';
                audioBtn.style.bottom = '20px';
                audioBtn.style.right = '20px';
                audioBtn.style.zIndex = '10000';
                audioBtn.style.backgroundColor = '#ff0000';
                audioBtn.style.color = '#ffffff';
                audioBtn.style.border = 'none';
                audioBtn.style.padding = '10px 15px';
                audioBtn.style.cursor = 'pointer';
                audioBtn.style.fontFamily = '"Droid Serif Pro WGL Bold", serif';

                audioBtn.addEventListener('click', function() {
                    audioElement.play();
                    this.remove();
                });

                document.body.appendChild(audioBtn);
            }
        });
    }
}

// Function to fade audio in or out
function fadeAudio(audioElement, targetVolume, duration, callback) {
    const startVolume = audioElement.volume;
    const volumeDelta = targetVolume - startVolume;
    const steps = 20; // Number of steps for the fade
    const stepDuration = duration / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
            audioElement.volume = targetVolume;
            clearInterval(fadeInterval);
            if (callback) callback();
        } else {
            audioElement.volume = startVolume + (volumeDelta * (currentStep / steps));
        }
    }, stepDuration);
}

// Play terminal mode toggle sound
function playTerminalSound() {
    const isTerminalMode = document.body.classList.contains('terminal-mode');

    const sound = document.createElement('audio');
    sound.volume = 0.3;

    // Use different sounds for activation vs deactivation
    if (isTerminalMode) {
        sound.innerHTML = '<source src="audio/terminal-on.mp3" type="audio/mpeg">';
    } else {
        sound.innerHTML = '<source src="audio/terminal-off.mp3" type="audio/mpeg">';
    }

    document.body.appendChild(sound);

    // Play with fallback
    const playPromise = sound.play();
    if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Terminal sound couldn't play: ", e));
    }

    // Remove after playing
    setTimeout(() => {
        sound.remove();
    }, 1000);
}