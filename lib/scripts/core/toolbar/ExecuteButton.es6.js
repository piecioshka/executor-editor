class ExecuteButton {
    $el = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('input');
        this.$el.type = 'button';
        this.$el.classList.add('executor-execute');
        this.$el.value = 'Execute';
    }

    setup(callback) {
        this.$el.addEventListener('click', callback);
    }
}

export default ExecuteButton;
