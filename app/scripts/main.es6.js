import VersionManager from './modules/VersionManager';
import AutomaticManager from './modules/AutomaticManager';
import ExecuteManager from './common/ExecuteManager';

class Terminal {
    vm = null;
    am = null;

    constructor() {
        this.vm = new VersionManager();
        this.am = new AutomaticManager();
    }

    setup() {
        const $run = document.querySelector('.terminal-execute');

        this.vm.setup();
        this.am.setup(this.run.bind(this));

        $run.addEventListener('click', this.run.bind(this));
    }

    run() {
        const $code = document.querySelector('.terminal-console');

        ExecuteManager.execute(this.vm.getVersion(), $code.innerText);
    }
}

window.addEventListener('load', () => {
    const terminal = new Terminal();

    terminal.setup();
});
