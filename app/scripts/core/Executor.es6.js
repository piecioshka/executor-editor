import AceHelper from './AceHelper';
import ExecuteManager from './ExecuteManager';
import MaximizeHelper from './MaximizeHelper';
import LayoutManager from './LayoutManager';
import ResultManager from './ResultManager';

class Executor {
    settings = {
        id: null,
        fontSize: 12,
        timeout: 1000
    };

    ah = null;
    fh = null;
    lm = null;
    rm = null;

    $auto = null;
    $env = null;
    $fontSize = null;
    $execute = null;
    $code = null;

    constructor(settings) {
        this.settings = Object.assign(this.settings, settings);

        const $executor = window.document.querySelector(`#${this.settings.id}`);

        this.ah = new AceHelper($executor);
        this.fh = new MaximizeHelper($executor, this.ah.editor);
        this.lm = new LayoutManager($executor);
        this.rm = new ResultManager($executor);

        this.initialize($executor);
        this.setup();
    }

    initialize($executor) {
        this.$auto = $executor.querySelector('.executor-auto');
        this.$env = $executor.querySelector('.executor-env');
        this.$fontSize = $executor.querySelector('.executor-font-size');
        this.$execute = $executor.querySelector('.executor-execute');
        this.$code = $executor.querySelector('.executor-code');
    }

    setup() {
        this.apply();

        this.fh.setup();
        this.lm.setup();

        this.handleExecutorSwitch();
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

    handleExecutorSwitch() {
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
                delay = window.setTimeout(() => {
                    this.execute(this.$env.value, this.$code.innerText);
                }, this.settings.timeout);
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
            this.rm.save();
            this.rm.override();

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

export default Executor;
