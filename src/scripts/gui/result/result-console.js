class ResultConsole {
    $el = null;

    constructor() {
        this.$el = window.document.createElement('pre');
        this.$el.classList.add('executor-result-console');
    }

    append(text) {
        this.$el.innerHTML = text;
    }
}

module.exports = {
    ResultConsole
};
