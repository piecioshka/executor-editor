class FontSizeInput {
    $input = null;

    constructor($executor) {
        this.$input = $executor.querySelector('.executor-font-size');
    }

    setup(cb) {
        this.$input.addEventListener('change', () => {
            cb(Number(this.$input.value));
        });
    }
}

export default FontSizeInput;
