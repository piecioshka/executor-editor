class CodeMirrorHelper {
    $code = null;
    editor = null;

    params = {
        mode: 'text/javascript',
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        theme: 'warsawjs'
    };

    constructor() {
        this.$code = document.querySelector('.terminal-console');
        this.editor = CodeMirror.fromTextArea(this.$code, this.params);
    }
}

export default CodeMirrorHelper;
