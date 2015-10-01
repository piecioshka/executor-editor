class AceHelper {
    $code = null;
    editor = null;

    constructor() {
        this.$code = document.querySelector('.terminal-console');

        this.editor = window.ace.edit(this.$code);
        this.session = this.editor.getSession();

        this.setupEditor();
        this.setupSession();
    }

    setupEditor() {
        // Remove warning:
        //   'Automatically scrolling cursor into view after selection change'
        //   'this will be disabled in the next version'
        //   'set editor.$blockScrolling = Infinity to disable this message'
        this.editor.$blockScrolling = Infinity;
        this.editor.setTheme('ace/theme/tomorrow');
        this.editor.setShowPrintMargin(false);
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    }

    setupSession() {
        this.session.setMode('ace/mode/javascript');
        this.session.setUseSoftTabs(true);
        this.session.setTabSize(4);
        this.session.setUseWorker(true);
    }
}

export default AceHelper;
