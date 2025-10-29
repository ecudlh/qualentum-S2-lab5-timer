import { LitElement, html, css } from 'https://unpkg.com/lit@latest?module';

export class TimerPartComponent extends LitElement {
    static properties = {
        value: { type: Number, attribute: true },
        label: { type: String, attribute: true }
    }
    
    constructor() {
        super();
        this.value = 0;
        this.label = '';
    }

    static styles = css `
        .timer-part-container{
            display: flex;
            flex-direction: row;
            gap: 16px;
            align
        }
    
        .timer-part {
            font-family: sans-serif;
            text-align: center;
        }

        .value {
            background: #ffffffff;
            box-shadow: 5px 5px;
            border: 1px solid  #1c1c1c;
            color: #1c1c1c;
            font-size: 1.8rem;
            font-weight: bold;
            padding: 0.8rem 1.2rem;
            border-radius: 0.5rem;
        }

        .label {
            font-size: 0.8rem;
            color: #1c1c1c;
            margin-top: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    `;

    formatValue() {
        return this.value.toString().padStart(2, '0');
    }

    render() {
        return html `
            <div class="timer-part-container">
                <div class="timer-part">
                    <div class="value">${this.formatValue()}</div>
                    <div class="label">${this.label}</div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('timer-part-component', TimerPartComponent)