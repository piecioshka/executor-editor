export class ResultConsole {
    $el: HTMLPreElement;

    constructor() {
        this.$el = window.document.createElement('pre');
        this.$el.classList.add('executor-result-console');
    }

    append(text: string): void {
        this.$el.innerHTML = text;
    }
}
