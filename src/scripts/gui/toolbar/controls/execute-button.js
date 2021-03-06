class ExecuteButton {
    $el = null;
    $button = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createDocumentFragment();

        this.$button = window.document.createElement('input');
        this.$button.type = 'button';
        this.$button.classList.add('executor-execute-button');
        this.$button.value = 'Execute';

        // Helpful, when DOCTYPE is not defined.
        this.$el.appendChild(window.document.createTextNode(' '));
        this.$el.appendChild(this.$button);
    }

    setup(callback) {
        this.$button.addEventListener('click', callback);
    }
}

module.exports = {
    ExecuteButton
};
