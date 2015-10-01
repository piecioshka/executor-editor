import TranspilerManager from './modules/TranspilerManager';
import ExecuteManager from './common/ExecuteManager';
import CodeMirrorHelper from './common/CodeMirrorHelper';

const TIME_TO_WAIT_BEFORE_AUTO_EXECUTE = 1000;

class Terminal {
    tm = null;
    cmh = null;

    constructor() {
        this.tm = new TranspilerManager();
        this.cmh = new CodeMirrorHelper();

        this.setup();
    }

    setup() {
        let delay = null;
        const $auto = document.querySelector('.terminal-auto');
        const $execute = document.querySelector('.terminal-execute');
        const $code = document.querySelector('.terminal-console');

        this.tm.setup();
        $execute.addEventListener('click', () => this.execute($code.innerText));

        this.cmh.editor.on('change', () => {
            $code.innerText = this.cmh.editor.getValue();

            if ($auto.checked) {
                clearTimeout(delay);
                delay = setTimeout(() => this.execute($code.innerText), TIME_TO_WAIT_BEFORE_AUTO_EXECUTE);
            }
        });
    }

    execute(code) {
        ExecuteManager.execute(this.tm.getName(), code);
    }
}

window.addEventListener('load', () => new Terminal());
