export class ExecuteButton {
    $el: DocumentFragment;
    $button: HTMLInputElement;

    constructor() {
        this.$el = window.document.createDocumentFragment();

        this.$button = window.document.createElement('input');
        this.$button.type = 'button';
        this.$button.classList.add('executor-execute-button');
        this.$button.value = 'Execute';

        // Helpful, when DOCTYPE is not defined.
        this.$el.appendChild(window.document.createTextNode(' '));
        this.$el.appendChild(this.$button);
    }

    setup(callback: () => void): void {
        this.$button.addEventListener('click', callback);
    }
}
