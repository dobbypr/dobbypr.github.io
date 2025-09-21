const fallbackMotionQuery = {
    matches: false,
    addEventListener: () => {},
    addListener: () => {},
};

const prefersReducedMotion =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : fallbackMotionQuery;

function onMotionPreferenceChange(callback) {
    if (typeof prefersReducedMotion.addEventListener === 'function') {
        prefersReducedMotion.addEventListener('change', callback);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
        prefersReducedMotion.addListener(callback);
    }
}

function debugLog(level, message, context = {}) {
    const debuggerChannel = window.machineDebugger;
    if (debuggerChannel && typeof debuggerChannel[level] === 'function') {
        debuggerChannel[level](message, context);
    } else if (typeof console !== 'undefined' && typeof console[level] === 'function') {
        console[level](`[MachineLayer] ${message}`, context);
    }
}

function initLayerRail() {
    const buttons = Array.from(document.querySelectorAll('.layer-rail__item'));
    const sections = buttons
        .map((button) => {
            const id = button.getAttribute('data-target');
            const section = id ? document.getElementById(id) : null;
            if (!section) {
                debugLog('warn', 'Layer rail target missing', { id });
            }
            return { button, section, id };
        })
        .filter((entry) => entry.section);

    if (!sections.length) {
        return;
    }

    const updateActive = (id) => {
        sections.forEach(({ button, section }) => {
            const isMatch = section.id === id;
            button.classList.toggle('is-active', isMatch);
            button.setAttribute('aria-current', isMatch ? 'true' : 'false');
            section.classList.toggle('is-visible', isMatch || section.classList.contains('is-visible'));
        });
    };

    const scrollToSection = (section) => {
        if (!section) return;
        section.scrollIntoView({
            behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
            block: 'start',
        });
    };

    sections.forEach(({ button, section }) => {
        button.addEventListener('click', () => {
            updateActive(section.id);
            scrollToSection(section);
        });

        button.addEventListener('focus', () => {
            updateActive(section.id);
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    updateActive(entry.target.id);
                }
            });
        },
        {
            threshold: 0.45,
            rootMargin: '-20% 0px -40% 0px',
        },
    );

    sections.forEach(({ section }) => observer.observe(section));

    updateActive(sections[0].section.id);
    debugLog('info', 'Layer rail initialised', { layers: sections.length });
}

function initMissionConsole() {
    const consoleEl = document.querySelector('[data-mission-console]');
    if (!consoleEl) {
        return;
    }

    const indicator = consoleEl.querySelector('.mission-console__indicator');
    const headline = consoleEl.querySelector('[data-mission-headline]');
    const copy = consoleEl.querySelector('[data-mission-copy]');
    const list = consoleEl.querySelector('[data-mission-list]');
    const buttons = consoleEl.querySelectorAll('[data-mission-nav]');

    const directives = [
        {
            headline: 'Calibrate the Style Meter',
            copy: 'Bring order to the chaos. Polish the Machine Layer until it gleams, but keep the blood-warm hum that makes ULTRAKILL sing.',
            list: [
                'Audit every layer for clarity and flow.',
                'Route visitors with a rail instead of loose gates.',
                'Let the console breathe with readable type.',
            ],
        },
        {
            headline: 'Deploy Layer Rail',
            copy: 'Guide travellers with a persistent selector. Every glyph is a breadcrumb deeper into the stack.',
            list: [
                'Stick the rail to the viewport for fast switching.',
                'Mark active layers with emissive borders.',
                'Ensure keyboard traversal mirrors pointer control.',
            ],
        },
        {
            headline: 'Ignite the Mission Feed',
            copy: 'Surface the newest transmissions automatically so no one wonders if the Machine Layer still hums.',
            list: [
                'Pull from the blog archive asynchronously.',
                'Fallback gracefully when the uplink sputters.',
                'Log fetch status to the debugging console.',
            ],
        },
        {
            headline: 'Fortify Accessibility',
            copy: 'High-energy does not mean hard to read. Contrast stays lethal, focus stays visible.',
            list: [
                'Respect reduced-motion preferences across animations.',
                'Elevate focus outlines on the rail and tiles.',
                'Increase base type sizes for long-form logs.',
            ],
        },
    ];

    let index = 0;
    let timerId;
    const interval = 9000;

    const render = () => {
        const directive = directives[index];
        if (!directive) {
            return;
        }
        if (indicator) {
            indicator.textContent = `// ${String(index + 1).padStart(2, '0')} //`;
        }
        if (headline) {
            headline.textContent = directive.headline.toUpperCase();
        }
        if (copy) {
            copy.textContent = directive.copy;
        }
        if (list) {
            list.innerHTML = '';
            directive.list.forEach((item) => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
        }
    };

    const startRotation = () => {
        if (prefersReducedMotion.matches) {
            return;
        }
        stopRotation();
        timerId = window.setInterval(() => {
            index = (index + 1) % directives.length;
            render();
        }, interval);
    };

    const stopRotation = () => {
        if (timerId) {
            window.clearInterval(timerId);
            timerId = undefined;
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const direction = button.getAttribute('data-mission-nav');
            if (direction === 'prev') {
                index = (index - 1 + directives.length) % directives.length;
            } else {
                index = (index + 1) % directives.length;
            }
            render();
            startRotation();
        });
    });

    consoleEl.addEventListener('mouseenter', stopRotation);
    consoleEl.addEventListener('mouseleave', startRotation);

    onMotionPreferenceChange(() => {
        if (prefersReducedMotion.matches) {
            stopRotation();
        } else {
            startRotation();
        }
    });

    render();
    startRotation();
    debugLog('info', 'Mission console initialised', { directives: directives.length });
}

async function initTransmissions() {
    const card = document.querySelector('[data-transmission-card]');
    if (!card) {
        return;
    }

    const statusEl = card.querySelector('[data-transmission-status]');
    const titleEl = card.querySelector('[data-transmission-title]');
    const summaryEl = card.querySelector('[data-transmission-summary]');
    const dateEl = card.querySelector('[data-transmission-date]');
    const linkEl = card.querySelector('[data-transmission-link]');

    try {
        const response = await fetch('blog_data.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Unexpected status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No transmissions available');
        }
        const latest = data[0];
        if (statusEl) {
            statusEl.textContent = 'LIVE FEED';
        }
        if (titleEl) {
            titleEl.textContent = latest.title || 'Transmission Online';
        }
        if (summaryEl) {
            summaryEl.textContent = latest.summary || 'A new dispatch has arrived from the archive.';
        }
        if (dateEl) {
            dateEl.textContent = latest.date ? `Last ping: ${latest.date}` : 'Last ping: Active';
        }
        if (linkEl) {
            linkEl.href = latest.file || 'blog.html';
            linkEl.textContent = 'Read full log';
        }
        card.dataset.state = 'ready';
        debugLog('info', 'Latest transmission loaded', { title: latest.title });
    } catch (error) {
        card.dataset.state = 'error';
        if (statusEl) {
            statusEl.textContent = 'OFFLINE';
        }
        if (summaryEl) {
            summaryEl.textContent = 'Signal unstable. Check back soon or dive straight into the archive.';
        }
        if (dateEl) {
            dateEl.textContent = 'Last ping: Unknown';
        }
        if (linkEl) {
            linkEl.textContent = 'Open archive';
            linkEl.href = 'blog.html';
        }
        debugLog('error', 'Failed to load latest transmission', { error: error.message });
    }
}

function initLoreTablet() {
    const tablet = document.querySelector('[data-lore-tablet]');
    if (!tablet) {
        return;
    }

    const output = tablet.querySelector('[data-lore-output]');
    const buttons = tablet.querySelectorAll('[data-lore-nav]');

    const directives = [
        '// DIRECTIVE 01: MANKIND IS DEAD. THEIR REIGN IS OVER. ONLY THE ECHO REMAINS. //',
        '// DIRECTIVE 02: BLOOD IS FUEL. THE ESSENCE OF THE FALLEN POWERS THE MACHINE. //',
        '// DIRECTIVE 03: HELL IS FULL. THERE IS ALWAYS ROOM FOR ONE MORE LAYER. //',
        '// DIRECTIVE 04: STYLE IS LAW. CHAOS WITHOUT FORM IS JUST NOISE. //',
    ];

    let index = 0;
    let timerId;
    const interval = 7000;

    const render = () => {
        if (output) {
            output.textContent = directives[index];
        }
    };

    const startRotation = () => {
        if (prefersReducedMotion.matches) {
            return;
        }
        stopRotation();
        timerId = window.setInterval(() => {
            index = (index + 1) % directives.length;
            render();
        }, interval);
    };

    const stopRotation = () => {
        if (timerId) {
            window.clearInterval(timerId);
            timerId = undefined;
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const direction = button.getAttribute('data-lore-nav');
            if (direction === 'prev') {
                index = (index - 1 + directives.length) % directives.length;
            } else {
                index = (index + 1) % directives.length;
            }
            render();
            startRotation();
        });
    });

    onMotionPreferenceChange(() => {
        if (prefersReducedMotion.matches) {
            stopRotation();
        } else {
            startRotation();
        }
    });

    render();
    startRotation();
}

function initContactConsole() {
    const buttons = document.querySelectorAll('[data-copy-button]');
    if (!buttons.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            const tile = button.closest('.contact-tile');
            if (!tile) return;
            const valueEl = tile.querySelector('[data-contact-value]');
            const hint = tile.querySelector('.contact-tile__hint');
            const value = valueEl ? valueEl.textContent.trim() : '';
            if (!value) {
                debugLog('warn', 'Contact value missing', { tile: tile.dataset.channel });
                if (hint) {
                    hint.textContent = 'No value to copy';
                }
                return;
            }
            if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
                debugLog('warn', 'Clipboard API not available', { channel: tile.dataset.channel });
                if (hint) {
                    hint.textContent = 'Clipboard unavailable';
                }
                return;
            }

            try {
                await navigator.clipboard.writeText(value);
                if (hint) {
                    hint.textContent = 'Copied to clipboard';
                }
                tile.classList.add('copied');
                debugLog('info', 'Copied contact value', { channel: tile.dataset.channel });
                window.setTimeout(() => {
                    tile.classList.remove('copied');
                    if (hint) {
                        hint.textContent = 'Tap to copy';
                    }
                }, 2500);
            } catch (error) {
                debugLog('error', 'Clipboard write failed', { error: error.message });
                if (hint) {
                    hint.textContent = 'Copy failed — check console';
                }
            }
        });
    });
}

function initStyleMeter() {
    const bar = document.querySelector('.style-meter__bar');
    const rankEl = document.querySelector('[data-style-rank]');
    if (!bar || !rankEl) {
        return;
    }

    const ranks = [
        { threshold: 82, label: 'DESTRUCTIVE' },
        { threshold: 86, label: 'BRUTAL' },
        { threshold: 92, label: 'SSSHATTERING' },
    ];

    const adjustMeter = () => {
        const level = Math.floor(82 + Math.random() * 12);
        bar.style.setProperty('--style-level', `${level}%`);
        bar.setAttribute('aria-valuenow', String(level));
        const currentRank = ranks.reduce((acc, item) => (level >= item.threshold ? item.label : acc), ranks[0].label);
        rankEl.textContent = currentRank;
    };

    adjustMeter();

    let intervalId;
    const start = () => {
        if (prefersReducedMotion.matches || intervalId) {
            return;
        }
        intervalId = window.setInterval(adjustMeter, 8000);
    };

    const stop = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = undefined;
        }
    };

    start();
    onMotionPreferenceChange(() => {
        if (prefersReducedMotion.matches) {
            stop();
        } else {
            start();
        }
    });
}

function initHomePage() {
    initLayerRail();
    initMissionConsole();
    initTransmissions();
    initLoreTablet();
    initContactConsole();
    initStyleMeter();
    debugLog('info', 'Home page modules ready');
}

document.addEventListener('DOMContentLoaded', initHomePage);
