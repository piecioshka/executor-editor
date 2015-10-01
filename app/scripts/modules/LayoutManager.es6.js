class LayoutManager {
    $horizontal = null;
    $vertical = null;

    constructor() {
        this.$horizontal = document.querySelector('.terminal-horizontal-icon');
        this.$vertical = document.querySelector('.terminal-vertical-icon');
    }

    setup() {
        const $code = document.querySelector('.terminal-console');
        const $board = document.querySelector('.terminal-result');

        this.$horizontal.addEventListener('click', () => {
            $code.classList.remove('terminal-left-column');
            $board.classList.remove('terminal-right-column');
        });

        this.$vertical.addEventListener('click', () => {
            $code.classList.add('terminal-left-column');
            $board.classList.add('terminal-right-column');
        });
    }
}

export default LayoutManager;
