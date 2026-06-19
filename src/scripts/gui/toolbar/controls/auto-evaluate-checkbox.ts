import { SuperEventEmitter } from 'super-event-emitter';

export class AutoEvaluateCheckbox extends SuperEventEmitter {
    static EVENTS = {
        CHECK: 'AutoEvaluateCheckbox.EVENTS.CHECK',
        UNCHECK: 'AutoEvaluateCheckbox.EVENTS.UNCHECK'
    };

    $el: HTMLLabelElement;
    $checkbox: HTMLInputElement;

    constructor() {
        super();

        this.$el = window.document.createElement('label');
        this.$el.classList.add('executor-autoevaluate-label');

        this.$checkbox = window.document.createElement('input');
        this.$checkbox.type = 'checkbox';
        this.$checkbox.classList.add('executor-autoevaluate-checkbox');

        this.$checkbox.addEventListener('click', () => {
            if (this.$checkbox.checked) {
                this.emit(AutoEvaluateCheckbox.EVENTS.CHECK);
            } else {
                this.emit(AutoEvaluateCheckbox.EVENTS.UNCHECK);
            }
        });

        this.$el.appendChild(window.document.createTextNode('Auto-evaluate: '));
        this.$el.appendChild(this.$checkbox);
    }

    mark(): void {
        this.$checkbox.checked = true;
    }
}
