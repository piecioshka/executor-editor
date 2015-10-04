class AutoEvaluateCheckbox {
    $el = null;
    $checkbox = null;
    delay = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('label');
        this.$el.appendChild(window.document.createTextNode('Evaluate: '));
        this.$checkbox = window.document.createElement('input');
        this.$checkbox.type = 'checkbox';
        this.$checkbox.classList.add('executor-auto');
        this.$checkbox.checked = 'checked';
        this.$el.appendChild(this.$checkbox);
    }

    setup(callback, timeout) {
        if (this.$checkbox.checked) {
            clearTimeout(this.delay);
            this.delay = window.setTimeout(callback, timeout);
        }
    }
}

export default AutoEvaluateCheckbox;
