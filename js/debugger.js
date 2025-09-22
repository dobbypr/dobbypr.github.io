(function (global) {
    class MachineDebugger {
        constructor(options = {}) {
            this.maxLogs = Number.isInteger(options.maxLogs) ? options.maxLogs : 100;
            this.logs = [];
            this.visible = false;
            this.autoAttach = options.autoAttach !== false;
            this.showToggle = options.showToggle === true;
            this.startVisible = options.startVisible === true;
            this.enableShortcut = options.enableShortcut !== false;
            this.hasDOM = typeof document !== 'undefined' && !!document.body;
            this.boundShortcutHandler = null;

            if (this.hasDOM) {
                this.setupUI();
                if (this.showToggle) {
                    this.setupToggle();
                }
                if (this.enableShortcut) {
                    this.setupShortcut();
                }
                if (this.autoAttach) {
                    this.attachGlobalHandlers();
                }
                if (this.startVisible) {
                    this.show();
                }
            this.hasDOM = typeof document !== 'undefined' && !!document.body;

            if (this.hasDOM) {
                this.setupUI();
                this.setupToggle();
                if (this.autoAttach) {
                    this.attachGlobalHandlers();
                }
            }
        }

        setupUI() {
            this.panel = document.createElement('section');
            this.panel.className = 'machine-debugger';
            this.panel.setAttribute('role', 'region');
            this.panel.setAttribute('aria-live', 'polite');

            const header = document.createElement('div');
            header.className = 'machine-debugger__header';
            header.innerHTML = '<span>Diagnostics</span>';

            const actions = document.createElement('div');
            actions.className = 'machine-debugger__actions';

            this.clearButton = document.createElement('button');
            this.clearButton.type = 'button';
            this.clearButton.textContent = 'Clear';
            this.clearButton.className = 'machine-debugger__button';
            this.clearButton.addEventListener('click', () => this.clear());

            this.collapseButton = document.createElement('button');
            this.collapseButton.type = 'button';
            this.collapseButton.textContent = 'Hide';
            this.collapseButton.className = 'machine-debugger__button';
            this.collapseButton.addEventListener('click', () => this.hide());

            actions.appendChild(this.clearButton);
            actions.appendChild(this.collapseButton);
            header.appendChild(actions);

            this.logList = document.createElement('div');
            this.logList.className = 'machine-debugger__logs';
            this.logList.dataset.state = 'empty';
            this.logList.innerHTML = '<div class="machine-debugger__empty">Awaiting logs</div>';

            this.panel.appendChild(header);
            this.panel.appendChild(this.logList);
            document.body.appendChild(this.panel);
        }

        setupToggle() {
            this.toggle = document.createElement('button');
            this.toggle.className = 'machine-debugger__toggle';
            this.toggle.type = 'button';
            this.toggle.setAttribute('aria-expanded', 'false');
            this.toggle.textContent = 'DBG';
            this.toggle.addEventListener('click', () => {
                this.visible ? this.hide() : this.show();
            });

            document.body.appendChild(this.toggle);
        }

        setupShortcut() {
            this.boundShortcutHandler = (event) => {
                if (event.key.toLowerCase() === 'd' && event.ctrlKey && event.altKey) {
                    event.preventDefault();
                    this.visible ? this.hide() : this.show();
                }
            };
            document.addEventListener('keydown', this.boundShortcutHandler);

            document.addEventListener('keydown', (event) => {
                if (event.key.toLowerCase() === 'd' && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    this.visible ? this.hide() : this.show();
                }
        }

        attachGlobalHandlers() {
            if (typeof window !== 'undefined') {
                window.addEventListener('error', (event) => {
                    this.error('Unhandled error', {
                        message: event.message,
                        source: event.filename,
                        line: event.lineno,
                    });
                });

                window.addEventListener('unhandledrejection', (event) => {
                    this.error('Unhandled promise rejection', {
                        reason: event.reason && event.reason.message ? event.reason.message : String(event.reason),
                    });
                });
            }
        }

        createLogEntry(level, message, context, timestamp) {
            if (!this.hasDOM) {
                return null;
            }
            const wrapper = document.createElement('div');
            wrapper.className = 'machine-debugger__log';
            wrapper.dataset.level = level;

            const meta = document.createElement('div');
            meta.className = 'machine-debugger__meta';
            meta.innerHTML = `<span>${level}</span><span>${timestamp.toLocaleTimeString()}</span>`;

            const messageEl = document.createElement('div');
            messageEl.className = 'machine-debugger__message';
            messageEl.textContent = message;

            wrapper.appendChild(meta);
            wrapper.appendChild(messageEl);

            if (context && Object.keys(context).length > 0) {
                const contextEl = document.createElement('div');
                contextEl.className = 'machine-debugger__context';
                contextEl.textContent = MachineDebugger.stringifyContext(context);
                wrapper.appendChild(contextEl);
            }

            return wrapper;
        }

        log(level, message, context = {}) {
            const timestamp = new Date();
            const entry = { level, message, context, timestamp };
            this.logs.push(entry);
            if (this.logs.length > this.maxLogs) {
                this.logs.shift();
                if (this.hasDOM && this.logList.firstChild) {
                    this.logList.removeChild(this.logList.firstChild);
                }
            }

            if (this.hasDOM && this.logList) {
                if (this.logList.dataset.state === 'empty') {
                    this.logList.dataset.state = 'ready';
                    this.logList.innerHTML = '';
                }
                const domEntry = this.createLogEntry(level, message, context, timestamp);
                if (domEntry) {
                    this.logList.appendChild(domEntry);
                    this.logList.scrollTop = this.logList.scrollHeight;
                }
            }
            return entry;
        }

        info(message, context) {
            return this.log('info', message, context);
        }

        warn(message, context) {
            return this.log('warn', message, context);
        }

        error(message, context) {
            return this.log('error', message, context);
        }

        clear() {
            this.logs = [];
            if (this.hasDOM && this.logList) {
                this.logList.dataset.state = 'empty';
                this.logList.innerHTML = '<div class="machine-debugger__empty">Awaiting logs</div>';
            }
        }

        show() {
            if (!this.hasDOM) return;
            this.visible = true;
            this.panel.classList.add('is-visible');
            if (this.toggle) {
                this.toggle.setAttribute('aria-expanded', 'true');
            }
            this.toggle.setAttribute('aria-expanded', 'true');
        }

        hide() {
            if (!this.hasDOM) return;
            this.visible = false;
            this.panel.classList.remove('is-visible');
            if (this.toggle) {
                this.toggle.setAttribute('aria-expanded', 'false');
            }
            this.toggle.setAttribute('aria-expanded', 'false');
        }

        static stringifyContext(context) {
            try {
                return JSON.stringify(context, null, 2);
            } catch (error) {
                return '[Unserializable context]';
            }
        }
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { MachineDebugger };
    }

    if (global && typeof global.document !== 'undefined') {
        const boot = (options = {}) => {
            if (!global.machineDebugger) {
                global.machineDebugger = new MachineDebugger(options);
            }
            return global.machineDebugger;
        };

        global.enableMachineDebugger = (options = {}) => boot({ startVisible: true, ...options });

        const search = global.location && typeof global.location.search === 'string' ? global.location.search : '';
        const hash = global.location && typeof global.location.hash === 'string' ? global.location.hash : '';
        const fromStorage = (() => {
            try {
                return global.localStorage && global.localStorage.getItem('machineDebugger') === '1';
            } catch (error) {
                return false;
            }
        })();

        const shouldBoot = /[?&]debug=1/.test(search) || hash.includes('debug') || fromStorage;

        if (shouldBoot) {
            const start = () => boot({ showToggle: true, startVisible: true });
            if (global.document.readyState === 'loading') {
                global.document.addEventListener('DOMContentLoaded', start);
            } else {
                start();
            }
        const boot = () => {
            if (!global.machineDebugger) {
                global.machineDebugger = new MachineDebugger();
            }
        };

        if (global.document.readyState === 'loading') {
            global.document.addEventListener('DOMContentLoaded', boot);
        } else {
            boot();
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
