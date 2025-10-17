import { LitElement, html, css } from 'https://unpkg.com/lit@latest?module';

export class TimerComponent extends LitElement {
    static properties = {
        hours: { type: Number},
        minutes: { type: Number},
        seconds: { type: Number},
    };
    
    constructor() {
        super();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    };

    static styles = css `
        .timer-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 12px;
            padding-top: 160px;
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
    `;

    render () {
        return html `
            <div class="timer-container">
                <timer-part-component value=${this.hours} label="hrs"></timer-part-component>
                <timer-part-component value=${this.minutes} label="min"></timer-part-component>
                <timer-part-component value=${this.seconds} label="seg"></timer-part-component>
            </div>
            <div class="timer-controls">
                <button @click=${() => console.log('Play')}>Play</button>
                <button @click=${() => console.log('Pause')}>Pause</button>
                <button @click=${() => console.log('Reset')}>Reset</button>
            </div>
        `;
    }
}

window.customElements.define('timer-component', TimerComponent);