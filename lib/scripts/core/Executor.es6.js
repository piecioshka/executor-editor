import ExecuteManager from './common/ExecuteManager';
import AceHelper from './editor/AceHelper';

import AutoEvaluateCheckbox from './menu/AutoEvaluateCheckbox';
import ExecuteButton from './menu/ExecuteButton';
import FontSizeInput from './menu/FontSizeInput';
import LayoutSwitcher from './menu/LayoutSwitcher';
import MaximizeButton from './menu/MaximizeButton';
import SelectEnvironment from './menu/SelectEnvironment';

import ResultsWindow from './result/ResultsWindow';

class Executor {
    $el = null;

    settings = {
        fontSize: 16,
        timeout: 1000
    };

    aceHelper = null;

    autoEvaluate = null;
    selectEnvironment = null;
    layoutSwitcher = null;
    maximizeButton = null;
    fontSizeInput = null;
    executeButton = null;

    resultsWindow = null;

    constructor($executor, settings) {
        this.$el = $executor;
        this.settings = Object.assign(this.settings, settings);

        this.buildToolbar();
        this.setupEvents();
        this.applySettings();
    }

    buildToolbar() {
        // Ace Editor
        // ----------

        this.aceHelper = new AceHelper(this.$el);

        // Toolbar
        // -------

        // 1. Auto evaluate
        this.autoEvaluate = new AutoEvaluateCheckbox(this.$el);
        // 2. Environment
        this.selectEnvironment = new SelectEnvironment(this.$el);
        // 3. Layout
        this.layoutSwitcher = new LayoutSwitcher(this.$el, this.aceHelper.editor);
        // 4. Maximize
        this.maximizeButton = new MaximizeButton(this.$el, this.aceHelper.editor);
        // 5. Font Size
        this.fontSizeInput = new FontSizeInput(this.$el);
        // 6. Execute
        this.executeButton = new ExecuteButton(this.$el);

        // Results board
        // -------------

        this.resultsWindow = new ResultsWindow(this.$el);
    }

    setupEvents() {
        // Toolbar
        // -------

        // Ad 1. Auto evaluate
        this.aceHelper.editor.on('change', () => {
            this.autoEvaluate.setup(() => {
                this.execute(this.selectEnvironment.getValue(), this.aceHelper.getCode());
            }, this.settings.timeout);
        });

        // Ad 2. Environment
        this.selectEnvironment.setup(() => {
            this.execute(this.selectEnvironment.getValue(), this.aceHelper.getCode());
        });

        // Ad 3. Layout
        this.layoutSwitcher.setup();

        // Ad 4. Maximize
        this.maximizeButton.setup();

        // Ad 5. Font Size
        this.fontSizeInput.setup(size => {
            this.settings.fontSize = size;
            this.applySettings();
        });

        // Ad 6. Execute
        this.executeButton.setup(() => {
            this.resultsWindow.save();
            this.resultsWindow.override();

            this.execute(this.selectEnvironment.getValue(), this.aceHelper.getCode());
        });

        // Results board
        // -------------

        this.aceHelper.editor.on('focus', () => {
            this.resultsWindow.save();
            this.resultsWindow.override();
        });

        this.aceHelper.editor.on('blur', () => {
            this.resultsWindow.prevent();
        });
    }

    applySettings() {
        const fontSize = this.settings.fontSize;

        // Editor
        this.aceHelper.editor.setFontSize(fontSize);
        // Toolbar
        this.fontSizeInput.$input.value = fontSize;
        // Results Window
        this.resultsWindow.$board.style.fontSize = `${fontSize}px`;
    }

    execute(name, code) {
        try {
            ExecuteManager.execute(name, code);
        } catch (e) {
            this.resultsWindow.add(e.message);
        }

        this.resultsWindow.print();
    }
}

export default Executor;
