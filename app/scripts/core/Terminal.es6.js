import ResultManager from './ResultManager';
import LayoutManager from './LayoutManager';
import ExecuteManager from './ExecuteManager';
import AceHelper from './AceHelper';

class Terminal {
    settings = {
        id: null,
        fontSize: 12,
        timeout: 1000
    };

    ah = null;
    rm = null;
    lm = null;

    $auto = null;
    $environment = null;
    $fontSize = null;
    $execute = null;
    $code = null;

    constructor(settings) {
        this.settings = Object.assign(this.settings, settings);

        const $terminal = document.querySelector(`#${this.settings.id}`);

        this.ah = new AceHelper($terminal);
        this.rm = new ResultManager($terminal);
        this.lm = new LayoutManager($terminal);

        this.initialize($terminal);
        this.setup();
    }

    initialize($terminal) {
        this.$auto = $terminal.querySelector(`.terminal-auto`);
        this.$environment = $terminal.querySelector(`.terminal-environment`);
        this.$fontSize = $terminal.querySelector(`.terminal-font-size`);
        this.$execute = $terminal.querySelector(`.terminal-execute`);
        this.$code = $terminal.querySelector(`.terminal-console`);
    }

    setup() {
        this.apply();

        this.lm.setup();

        this.handleTerminalSwitch();
        this.handleChangeFontSize();
        this.handleChangeCode();
        this.handleChangeEnv();
        this.handleExecute();
    }

    apply() {
        const fontSize = this.settings.fontSize;

        this.rm.$board.style.fontSize = `${fontSize}px`;
        this.ah.editor.setFontSize(fontSize);
        this.$fontSize.value = fontSize;
    }

    handleTerminalSwitch() {
        const holder = this.ah.editor;

        holder.on('focus', () => {
            this.rm.save();
            this.rm.override();
        });

        holder.on('blur', () => {
            this.rm.prevent();
        });
    }

    handleChangeCode() {
        let delay = null;

        this.ah.editor.on('change', () => {
            if (this.$auto.checked) {
                clearTimeout(delay);
                delay = setTimeout(() => {
                    this.execute(this.$environment.value, this.$code.innerText);
                }, this.settings.timeout);
            }
        });
    }

    handleChangeEnv() {
        this.$environment.addEventListener('change', () => {
            this.execute(this.$environment.value, this.$code.innerText);
        });
    }

    handleExecute() {
        this.$execute.addEventListener('click', () => {
            this.rm.save();
            this.rm.override();

            this.execute(this.$environment.value, this.$code.innerText);
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

export default Terminal;
