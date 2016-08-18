export default class ResultConsole {
    $el = null;

    constructor() {
        this.buffer = new Set();

        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-result-console');
    }

    append(text) {
        this.$el.innerHTML = text;
    }
}
