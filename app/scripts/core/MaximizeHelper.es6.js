class MaximizeHelper {
    $executor = null;
    $maximize = null;
    $tools = null;
    $code = null;
    $result = null;

    constructor($executor, editor) {
        this.editor = editor;
        this.initialize($executor);
    }

    initialize($executor) {
        this.$executor = $executor;
        this.$maximize = $executor.querySelector('.executor-icon-maximize');
        this.$tools = $executor.querySelector('.executor-tools');
        this.$code = $executor.querySelector('.executor-code');
        this.$result = $executor.querySelector('.executor-result');
    }

    setup() {
        const handleKeydown = evt => {
            if (!MaximizeHelper.isEscape(evt)) {
                return;
            }

            this.$tools.classList.remove('executor-hidden-item');
            this.$code.classList.remove('executor-maximize');
            this.$result.classList.remove('executor-hidden-item');

            this.editor.resize();

            window.document.body.removeEventListener('keydown', handleKeydown);
        };

        const handleMaximizeClick = () => {
            this.$tools.classList.add('executor-hidden-item');
            this.$code.classList.add('executor-maximize');
            this.$result.classList.add('executor-hidden-item');

            this.editor.resize();
            this.editor.focus();

            window.document.body.addEventListener('keydown', handleKeydown);
        };

        this.$maximize.addEventListener('click', handleMaximizeClick);
    }

    static isEscape(evt) {
        return evt.keyCode === MaximizeHelper.ESCAPE_KEY_CODE;
    }
}

MaximizeHelper.ESCAPE_KEY_CODE = 27;

export default MaximizeHelper;
