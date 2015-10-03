class LayoutManager {
    $horizontal = null;
    $vertical = null;
    $code = null;
    $board = null;

    constructor($terminal) {
        this.initialize($terminal);
    }

    initialize($terminal) {
        this.$horizontal = $terminal.querySelector(`.terminal-horizontal-icon`);
        this.$vertical = $terminal.querySelector(`.terminal-vertical-icon`);
        this.$code = $terminal.querySelector(`.terminal-console`);
        this.$board = $terminal.querySelector(`.terminal-result`);
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
