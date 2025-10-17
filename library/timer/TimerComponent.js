import { LitElement, html, css } from 'https://unpkg.com/lit@latest?module';

export class TimerComponent extends LitElement {
    static properties = {
        hours: { type: Number},
        minutes: { type: Number},
        seconds: { type: Number},
        finished: { type: Boolean }
    };
    
    constructor() {
        super();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.finished = false;

        this._initialHours = this.hours;
        this._initialMinutes = this.minutes;
        this._initialSeconds = this.seconds;

        this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
        this.intervalId = null;
    };

    static styles = css `
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
    `;

    // Save initial data 
    firstUpdated() {
        this._initialHours = this.hours;
        this._initialMinutes = this.minutes;
        this._initialSeconds = this.seconds;
        this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
    }

    render () {
        return html `

            ${this.finished ? html`<div class="finished-message">Ready!</div>` : ''}

            <div class="timer-container">
                <timer-part-component value=${this.hours} label="hrs"></timer-part-component>
                <timer-part-component value=${this.minutes} label="min"></timer-part-component>
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
        this.hours = this._initialHours;
        this.minutes = this._initialMinutes;
        this.seconds = this._initialSeconds;
        this.totalSeconds = this.hours * 3600 + this.minutes * 60 + this.seconds;
        this.finished = false; 
        this.dispatchEvent(new CustomEvent('timer-reset', { composed: true }));
    };

    tick = () => {
        if (this.totalSeconds <= 0) {
            this.pauseTimer();
            this.finished = true;
            this.dispatchEvent(new CustomEvent('timer-finish', { composed: true }));
            return;
        }

        this.totalSeconds--;
        this.updateParts();
    };

    updateParts() {
        this.hours = Math.floor(this.totalSeconds / 3600);
        this.minutes = Math.floor((this.totalSeconds % 3600) / 60);
        this.seconds = this.totalSeconds % 60;
    }
}

window.customElements.define('timer-component', TimerComponent);