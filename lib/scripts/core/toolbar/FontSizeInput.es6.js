class FontSizeInput {
    $el = null;
    $input = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('label');
        this.$el.appendChild(window.document.createTextNode('Font Size: '));
        this.$input = window.document.createElement('input');
        this.$input.type = 'number';
        this.$input.classList.add('executor-font-size');
        this.$input.min = '10';
        this.$input.max = '99';
        this.$el.appendChild(this.$input);
    }

    setup(callback) {
        this.$input.addEventListener('change', () => {
            callback(Number(this.$input.value));
        });
    }
}

export default FontSizeInput;
