class AutoEvaluateCheckbox {
    $checkbox = null;
    delay = null;

    constructor($executor) {
        this.$checkbox = $executor.querySelector('.executor-auto');
    }

    setup(cb, timeout) {
        if (this.$checkbox.checked) {
            clearTimeout(this.delay);
            this.delay = window.setTimeout(cb, timeout);
        }
    }
}

export default AutoEvaluateCheckbox;
