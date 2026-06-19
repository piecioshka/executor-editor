export class MaximizeButton {
    $el: DocumentFragment;
    $button: HTMLInputElement;

    constructor() {
        this.$el = window.document.createDocumentFragment();

        this.$button = window.document.createElement('input');
        this.$button.type = 'button';
        this.$button.classList.add('executor-maximize-button');
        this.$button.value = 'Maximize';

        // Helpful, when DOCTYPE is not defined.
        this.$el.appendChild(window.document.createTextNode(' '));
        this.$el.appendChild(this.$button);
    }

    setup(callback: () => void): void {
        this.$button.addEventListener('click', callback);
    }
}
