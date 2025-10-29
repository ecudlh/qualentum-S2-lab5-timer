import { LitElement, html, css } from 'https://unpkg.com/lit@latest?module';

export class TimerComponent extends LitElement {
    static properties = {
        hours: { type: Number},
        minutes: { type: Number},
        seconds: { type: Number},
        finished: { type: Boolean },
        autostart: { type: Boolean },
        autoreset: { type: Boolean },
        textfinish: { type: String },

        direction: { type: String, reflect: true }, 
        start: { type: Number },
        limit: { type: Number },
    };
    
    constructor() {
        super();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.finished = false;
        this.autostart = false;
        this.autoreset = false;
        this.textfinish = 'Ready!';

        this.direction = 'down';
        this.limit = 0;

        this._initialHours = this.hours;
        this._initialMinutes = this.minutes;
        this._initialSeconds = this.seconds;

        this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
        this.intervalId = null;
    };

    static styles = css `
        :host {
            background-color: #fff;
            padding-inline: 80px;
            padding-block: 60px;
            border-radius: 16px;
            margin-bottom: 80px;
        }

        .timer-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 12px;
        }

        .timer-controls {
            display:flex;
            flex-direction: row;
            justify-content: center;
            gap: 12px;
            padding-top: 32px;
        }

        button {
            padding: 0.6rem 1.2rem;
            font-size: 1rem;
            font-weight: 600;
            width: 100px;
            cursor: pointer;
            border: none;
            border-radius: 0.3rem;
            color: white;
            background-color: #334eff;
        }

        button:hover {
            background-color: #2336afff;
        }

        button:disabled {
            background-color: #999;
            cursor: not-allowed;
        }

        .finished-message {
            font-size: 2.5rem;
            color: #1c1c1c;
            font-weight: bold;
            font-family: sans-serif;
            text-align: center;
            padding-bottom: 24px;
        }

        .separator {
            padding-top: 12px;
            font-size: 30px;
        }
    `;

    firstUpdated() {
        this.totalSeconds = this.start;

        this.updateParts();

        this._initialHours = this.hours;
        this._initialMinutes = this.minutes;
        this._initialSeconds = this.seconds;

        if (this.autostart) {
            this.startTimer();
        }
    }

    render () {
        return html `

            ${this.finished ? html`<div class="finished-message">${this.textfinish}</div>` : ''}

            <div class="timer-container">
                <timer-part-component value=${this.hours} label="hrs"></timer-part-component>
                <div class="separator">:</div>
                <timer-part-component value=${this.minutes} label="min"></timer-part-component>
                <div class="separator">:</div>
                <timer-part-component value=${this.seconds} label="seg"></timer-part-component>
            </div>
            <div class="timer-controls">
                <button @click=${this.startTimer} ?disabled=${this.finished}>Play</button>
                <button @click=${this.pauseTimer} ?disabled=${this.finished}>Pause</button>
                <button @click=${this.resetTimer} ?disabled=${this.finished}>Reset</button>
            </div>

            
        `;
    }

    startTimer = () => {
        if (this.intervalId || this.finished) return;

        this.finished = false;
        this.dispatchEvent(new CustomEvent('timer-play'), {composed: true});
        this.updateParts();
        this.intervalId = setInterval(this.tick, 1000);
    };

    pauseTimer = () => {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.dispatchEvent(new CustomEvent('timer-pause', { composed: true }));
        }
    };

    resetTimer = () => {
        this.pauseTimer();

        // Reset al punto inicial
        if (this.start > 0) {
            this.totalSeconds = this.start;
        } else {
            this.totalSeconds = this._initialHours * 3600 + this._initialMinutes * 60 + this._initialSeconds;
        }

        this.updateParts();

        this.finished = false; 
        this.dispatchEvent(new CustomEvent('timer-reset', { composed: true }));
    };

    tick = () => {
        // Dirección descendente 
        if (this.direction === 'down') {
            if (this.totalSeconds <= this.limit) {
                this.finishTimer();
                return;
            }
            this.totalSeconds--;
        } 
        // Dirección ascendente 
        else if (this.direction === 'up') {
            if (this.totalSeconds >= this.limit) {
                this.finishTimer();
                return;
            }
            this.totalSeconds++;
        }
        this.updateParts();
    };

    finishTimer() {
        this.pauseTimer();
        this.finished = true;
        this.dispatchEvent(new CustomEvent('timer-finish', { bubbles: true, composed: true }));

        if (this.autoreset) {
            setTimeout(() => {
                this.resetTimer();
                this.startTimer();
            }, 1000);
        }
    };

    updateParts() {
        this.hours = Math.floor(this.totalSeconds / 3600);
        this.minutes = Math.floor((this.totalSeconds % 3600) / 60);
        this.seconds = this.totalSeconds % 60;
    }
}

window.customElements.define('timer-component', TimerComponent);