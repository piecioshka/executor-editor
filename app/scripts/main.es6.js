import TranspilerManager from './modules/TranspilerManager';
import AutomaticManager from './modules/AutomaticManager';
import ExecuteManager from './common/ExecuteManager';

class Terminal {
    tm = null;
    am = null;

    constructor() {
        this.tm = new TranspilerManager();
        this.am = new AutomaticManager();
    }

    setup() {
        const $run = document.querySelector('.terminal-execute');

        this.tm.setup();
        this.am.setup(this.run.bind(this));

        $run.addEventListener('click', this.run.bind(this));
    }

    run() {
        const $code = document.querySelector('.terminal-console');

        ExecuteManager.execute(this.tm.getName(), $code.innerText);
    }
}

window.addEventListener('load', () => {
    const terminal = new Terminal();

    terminal.setup();
});
