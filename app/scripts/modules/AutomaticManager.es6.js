class AutomaticManager {
    $code = null;
    $element = null;

    callback = null;
    delay = null;

    setup(callback) {
        this.$code = document.querySelector('.terminal-console');
        this.$element = document.querySelector('.terminal-automatic');
        this.callback = callback;

        const handler = () => {
            clearTimeout(this.delay);
            this.delay = setTimeout(this.callback, 1500);
        };

        this.$element.addEventListener('click', () => {
            if (this.getState()) {
                this.$code.addEventListener('keypress', handler);
            } else {
                this.$code.removeEventListener('keypress', handler);
            }
        });
    }

    getState() {
        return this.$element.checked;
    }
}

export default AutomaticManager;
