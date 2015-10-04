class LayoutManager {
    $horizontal = null;
    $vertical = null;
    $code = null;
    $board = null;

    constructor($executor, editor) {
        this.editor = editor;
        this.initialize($executor);
    }

    initialize($executor) {
        this.$horizontal = $executor.querySelector('.executor-icon-horizontal');
        this.$vertical = $executor.querySelector('.executor-icon-vertical');
        this.$code = $executor.querySelector('.executor-code');
        this.$board = $executor.querySelector('.executor-result');
    }

    setup() {
        this.$horizontal.addEventListener('click', () => {
            this.$code.classList.remove('executor-left-column');
            this.$board.classList.remove('executor-right-column');
            this.editor.resize();
        });

        this.$vertical.addEventListener('click', () => {
            this.$code.classList.add('executor-left-column');
            this.$board.classList.add('executor-right-column');
            this.editor.resize();
        });
    }
}

export default LayoutManager;
