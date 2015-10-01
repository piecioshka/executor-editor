import ResultManager from './modules/ResultManager';
import LayoutManager from './modules/LayoutManager';
import ExecuteManager from './common/ExecuteManager';
import AceHelper from './common/AceHelper';

class Terminal {
    settings = {
        fontSize: 12,
        timeout: 1000
    };

    ah = null;
    rm = null;
    lm = null;

    $auto = null;
    $env = null;
    $fontSize = null;
    $execute = null;
    $code = null;

    constructor(settings) {
        this.settings = Object.assign(this.settings, settings);

        this.ah = new AceHelper();
        this.rm = new ResultManager();
        this.lm = new LayoutManager();

        this.$auto = document.querySelector('.terminal-auto');
        this.$env = document.querySelector('.terminal-env');
        this.$fontSize = document.querySelector('.terminal-font-size');
        this.$execute = document.querySelector('.terminal-execute');
        this.$code = document.querySelector('.terminal-console');

        this.setup();
    }

    setup() {
        this.apply();

        this.lm.setup();

        this.handleChangeFontSize();
        this.handleChangeCode();
        this.handleChangeEnv();
        this.handleExecute();
    }

    apply() {
        this.rm.$board.style.fontSize = `${this.settings.fontSize}px`;
        this.ah.editor.setFontSize(this.settings.fontSize);
        this.$fontSize.value = this.settings.fontSize;
    }

    handleChangeCode() {
        let delay = null;

        this.ah.editor.on('change', () => {
            if (this.$auto.checked) {
                clearTimeout(delay);
                delay = setTimeout(() => this.execute(this.$env.value, this.$code.innerText), this.settings.timeout);
            }
        });
    }

    handleChangeEnv() {
        this.$env.addEventListener('change', () => {
            this.execute(this.$env.value, this.$code.innerText);
        });
    }

    handleExecute() {
        this.$execute.addEventListener('click', () => {
            this.execute(this.$env.value, this.$code.innerText);
        });
    }

    handleChangeFontSize() {
        this.$fontSize.addEventListener('change', () => {
            this.settings.fontSize = Number(this.$fontSize.value);
            this.apply();
        });
    }

    execute(name, code) {
        try {
            ExecuteManager.execute(name, code);
        } catch (e) {
            this.rm.add(e.message);
        }

        this.rm.print();
    }
}

window.addEventListener('load', () => new Terminal({
    fontSize: 26
}));
