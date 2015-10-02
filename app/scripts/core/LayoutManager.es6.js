class LayoutManager {
    $horizontal = null;
    $vertical = null;
    $code = null;
    $board = null;

    constructor(id) {
        this.initialize(id);
    }

    initialize(id) {
        this.$horizontal = document.querySelector(`#${id} .terminal-horizontal-icon`);
        this.$vertical = document.querySelector(`#${id} .terminal-vertical-icon`);
        this.$code = document.querySelector(`#${id} .terminal-console`);
        this.$board = document.querySelector(`#${id} .terminal-result`);
    }

    setup() {
        this.$horizontal.addEventListener('click', () => {
            this.$code.classList.remove('terminal-left-column');
            this.$board.classList.remove('terminal-right-column');
        });

        this.$vertical.addEventListener('click', () => {
            this.$code.classList.add('terminal-left-column');
            this.$board.classList.add('terminal-right-column');
        });
    }
}

export default LayoutManager;
