'use strict';

class AceEditorWrapper {
    editor = null;
    session = null;

    setup($code) {
        this.editor = window.ace.edit($code);
        this.session = this.editor.getSession();

        this.setupEditor();
        this.setupSession();
    }

    setupEditor() {
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

    getCode() {
        return this.editor.getValue();
    }
}

export default AceEditorWrapper;
