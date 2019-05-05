const EventEmitter = require('super-event-emitter');

class AutoEvaluateCheckbox extends EventEmitter {
    $el = null;
    $checkbox = null;

    constructor() {
        super();
        this._buildDOM();
    }

    _buildDOM() {
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

    mark() {
        this.$checkbox.checked = 'checked';
    }
}

AutoEvaluateCheckbox.EVENTS = {
    CHECK: 'AutoEvaluateCheckbox.EVENTS.CHECK',
    UNCHECK: 'AutoEvaluateCheckbox.EVENTS.UNCHECK'
};

module.exports = {
    AutoEvaluateCheckbox
};
