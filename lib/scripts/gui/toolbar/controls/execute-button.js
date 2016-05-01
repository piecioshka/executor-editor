'use strict';

class ExecuteButton {
    $el = null;
    $button = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('label');
        this.$el.appendChild(window.document.createTextNode(''));
        this.$button = window.document.createElement('input');
        this.$button.type = 'button';
        this.$button.classList.add('executor-execute');
        this.$button.value = 'Execute';
        this.$el.appendChild(this.$button);
    }

    setup(callback) {
        this.$button.addEventListener('click', callback);
    }
}

export default ExecuteButton;
