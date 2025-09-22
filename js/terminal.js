class MachineTerminal {
    constructor() {
        this.overlay = null;
        this.output = null;
        this.input = null;
        this.history = [];
        this.historyIndex = 0;
        this.promptSymbol = '>';
        this.boundHistoryHandler = null;
        this.boundEscapeHandler = null;
        this.boundShortcutHandler = this.handleShortcut.bind(this);
    }

    boot() {
        this.attachLaunchers();
        document.addEventListener('keydown', this.boundShortcutHandler);
    }

    attachLaunchers() {
        const triggers = document.querySelectorAll('[data-terminal-launch]');
        triggers.forEach((trigger) => {
            if (trigger.dataset.terminalBound === 'true') {
                return;
            }
            trigger.dataset.terminalBound = 'true';
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                this.open();
            });
        });
    }

    handleShortcut(event) {
        if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 't') {
            event.preventDefault();
            this.open();
        }
    }

    open() {
        if (this.overlay) {
            this.focusInput();
            return;
        }

        this.render();
        this.printLines(['// MACHINE TERMINAL READY //'], 'terminal-system');
        this.printLines(['Type HELP for available commands.'], 'terminal-system');
    }

    render() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'terminal-overlay';
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');

        const windowEl = document.createElement('div');
        windowEl.className = 'terminal-window';

        const header = document.createElement('header');
        header.className = 'terminal-header';

        const title = document.createElement('h2');
        title.textContent = 'MACHINE TERMINAL';
        header.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'terminal-close';
        closeButton.textContent = 'EXIT';
        closeButton.addEventListener('click', () => this.close());
        header.appendChild(closeButton);

        const output = document.createElement('div');
        output.className = 'terminal-output';
        windowEl.appendChild(header);
        windowEl.appendChild(output);

        const form = document.createElement('form');
        form.className = 'terminal-form';
        form.setAttribute('aria-label', 'Terminal command input');

        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = this.promptSymbol;
        form.appendChild(prompt);

        const input = document.createElement('input');
        input.className = 'terminal-input';
        input.type = 'text';
        input.autocomplete = 'off';
        input.autocapitalize = 'none';
        input.spellcheck = false;
        input.setAttribute('aria-label', 'Terminal command');
        form.appendChild(input);

        windowEl.appendChild(form);

        const hint = document.createElement('p');
        hint.className = 'terminal-hint';
        hint.textContent = 'CTRL + ALT + T opens the terminal from anywhere.';
        windowEl.appendChild(hint);

        this.overlay.appendChild(windowEl);
        document.body.appendChild(this.overlay);

        this.output = output;
        this.input = input;
        this.history = [];
        this.historyIndex = 0;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const command = input.value.trim();
            if (!command) {
                return;
            }
            this.recordCommand(command);
            this.executeCommand(command);
            input.value = '';
        });

        this.boundHistoryHandler = (event) => this.handleHistory(event);
        input.addEventListener('keydown', this.boundHistoryHandler);

        this.boundEscapeHandler = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.close();
            }
        };
        this.overlay.addEventListener('keydown', this.boundEscapeHandler);

        this.overlay.addEventListener('click', (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });

        this.focusInput();
    }

    focusInput() {
        if (this.input) {
            this.input.focus();
        }
    }

    close() {
        if (!this.overlay) {
            return;
        }
        if (this.input && this.boundHistoryHandler) {
            this.input.removeEventListener('keydown', this.boundHistoryHandler);
        }
        if (this.overlay && this.boundEscapeHandler) {
            this.overlay.removeEventListener('keydown', this.boundEscapeHandler);
        }
        this.overlay.remove();
        this.overlay = null;
        this.output = null;
        this.input = null;
        this.historyIndex = 0;
    }

    recordCommand(command) {
        this.history.push(command);
        this.historyIndex = this.history.length;
        this.printLines([`${this.promptSymbol} ${command}`], 'terminal-user');
    }

    handleHistory(event) {
        if (!['ArrowUp', 'ArrowDown'].includes(event.key)) {
            return;
        }
        event.preventDefault();
        if (event.key === 'ArrowUp') {
            this.historyIndex = Math.max(0, this.historyIndex - 1);
        } else if (event.key === 'ArrowDown') {
            this.historyIndex = Math.min(this.history.length, this.historyIndex + 1);
        }

        if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
            this.input.value = this.history[this.historyIndex];
        } else {
            this.input.value = '';
        }
    }

    executeCommand(rawCommand) {
        const command = rawCommand.trim();
        const normalized = command.toLowerCase();

        switch (normalized) {
            case 'help':
                this.printLines([
                    'AVAILABLE COMMANDS:',
                    'HELP — LIST COMMANDS',
                    'ABOUT — MACHINE SUMMARY',
                    'LINKS — PRIMARY ROUTES',
                    'CONTACT — ACTIVE CHANNELS',
                    'MODE — TOGGLE TERMINAL MODE',
                    'CLEAR — WIPE OUTPUT',
                    'EXIT — CLOSE TERMINAL',
                ], 'terminal-system');
                break;
            case 'about':
                this.printLines([
                    'ULTRALAYER // MACHINE LAYER',
                    'INSPIRED BY ULTRAKILL'S GOD-MACHINE AESTHETICS.',
                    'CODE, MUSIC, AND WRITING ENGINEERED FOR MAXIMUM CATHARSIS.'
                ]);
                break;
            case 'links':
                this.printLines([
                    'PRIMARY ROUTES:',
                    '- HOME // INDEX.HTML',
                    '- MUSIC RACK // MUSIC.HTML',
                    '- TRANSMISSION LOG // BLOG.HTML',
                    '- SINS DOSSIER // SINS.HTML',
                    '- PONG SIMULATION // PONG.HTML'
                ]);
                break;
            case 'contact':
                this.printLines([
                    'CONTACT CHANNELS:',
                    '- BLUESKY // @NITO4.BSKY.SOCIAL',
                    '- EMAIL // ULTRALAYER@PROTONMAIL.COM'
                ]);
                break;
            case 'mode':
            case 'mode on':
                document.body.classList.add('terminal-mode');
                this.printLines(['TERMINAL MODE ENGAGED.'], 'terminal-system');
                break;
            case 'mode off':
                document.body.classList.remove('terminal-mode');
                this.printLines(['TERMINAL MODE DISENGAGED.'], 'terminal-system');
                break;
            case 'clear':
                if (this.output) {
                    this.output.innerHTML = '';
                }
                break;
            case 'exit':
            case 'close':
                this.printLines(['CLOSING TERMINAL.'], 'terminal-system');
                this.close();
                break;
            default:
                this.printLines([
                    `UNKNOWN COMMAND: ${command.toUpperCase()}`,
                    'TYPE HELP TO LIST AVAILABLE COMMANDS.'
                ], 'terminal-warning');
                break;
        }
    }

    printLines(lines, className) {
        if (!this.output) {
            return;
        }
        lines.forEach((line) => {
            const paragraph = document.createElement('p');
            if (className) {
                paragraph.classList.add(className);
            }
            paragraph.textContent = line;
            this.output.appendChild(paragraph);
        });
        this.output.scrollTop = this.output.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const terminal = new MachineTerminal();
    terminal.boot();
    window.machineTerminal = terminal;
});
