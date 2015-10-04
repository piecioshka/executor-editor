class AceHelper {
    $code = null;
    editor = null;

    constructor($executor) {
        this.initialize($executor);

        this.editor = window.ace.edit(this.$code);
        this.session = this.editor.getSession();

        this.setupEditor();
        this.setupSession();
    }

    initialize($executor) {
        this.$code = $executor.querySelector('.executor-code');
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
        this.session.$useWorker = false;
        this.session.setMode('ace/mode/javascript');
        this.session.setUseSoftTabs(true);
        this.session.setTabSize(4);
    }
}

export default AceHelper;
