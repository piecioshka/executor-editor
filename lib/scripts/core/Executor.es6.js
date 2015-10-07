import Toolbar from './Toolbar';

import ExecuteManager from './common/ExecuteManager';
import AceHelper from './editor/AceHelper';

import AutoEvaluateCheckbox from './toolbar/AutoEvaluateCheckbox';
import ExecuteButton from './toolbar/ExecuteButton';
import FontSizeInput from './toolbar/FontSizeInput';
import LayoutSwitcher from './toolbar/LayoutSwitcher';
import MaximizeButton from './toolbar/MaximizeButton';
import SelectEnvironment from './toolbar/SelectEnvironment';

import ResultsWindow from './result/ResultsWindow';
import VersionLabel from './result/VersionLabel';

class Executor {
    listing = null;

    $code = null;
    $main = null;
    $global = null;

    settings = {
        fontSize: 16,
        timeout: 1000
    };

    toolbar = null;

    aceHelper = null;

    autoEvaluate = null;
    selectEnvironment = null;
    layoutSwitcher = null;
    maximizeButton = null;
    fontSizeInput = null;
    executeButton = null;

    resultsWindow = null;
    versionLabel = null;

    constructor($code, settings) {
        this.listing = $code.innerHTML;
        this.settings = Object.assign(this.settings, settings);
        this.toolbar = new Toolbar();

        this.compile();
        this.render($code);

        this.buildToolbar();
        this.setupEvents();
        this.applySettings();

        this.$global.appendChild(this.toolbar.$el);
        this.$global.appendChild(this.$main);
        this.$global.appendChild(this.versionLabel.$el);
    }

    compile() {
        this.$code = window.document.createElement('pre');
        this.$code.classList.add('executor-code');
        this.$code.innerHTML = this.listing;

        this.$main = window.document.createElement('section');
        this.$main.classList.add('executor-main');
        this.$main.appendChild(this.$code);

        this.$global = window.document.createElement('div');
        this.$global.classList.add('executor');
    }

    render($code) {
        $code.parentNode.replaceChild(this.$global, $code);
    }

    buildToolbar() {
        this.aceHelper = new AceHelper();

        this.autoEvaluate = this.toolbar.add(new AutoEvaluateCheckbox());
        this.selectEnvironment = this.toolbar.add(new SelectEnvironment());
        this.layoutSwitcher = this.toolbar.add(new LayoutSwitcher());
        this.maximizeButton = this.toolbar.add(new MaximizeButton());
        this.fontSizeInput = this.toolbar.add(new FontSizeInput());
        this.executeButton = this.toolbar.add(new ExecuteButton());

        this.resultsWindow = new ResultsWindow();
        this.versionLabel = new VersionLabel();
    }

    setupEvents() {
        let runCode = () => {
            this.resultsWindow.save();
            this.resultsWindow.override();

            this.execute(this.selectEnvironment.getValue(), this.aceHelper.getCode());
        };

        // Toolbar
        // -------

        // Ad 1. Auto evaluate
        this.aceHelper.setup(this.$code);

        this.aceHelper.editor.on('change', () => {
            this.autoEvaluate.setup(runCode, this.settings.timeout);
        });

        // Ad 2. Environment
        this.selectEnvironment.setup(runCode);

        // Ad 3. Layout
        this.layoutSwitcher.setup(() => {
            this.$code.classList.remove('executor-left-column');
            this.resultsWindow.$el.classList.remove('executor-right-column');
            this.aceHelper.editor.resize();
        }, () => {
            this.$code.classList.add('executor-left-column');
            this.resultsWindow.$el.classList.add('executor-right-column');
            this.aceHelper.editor.resize();
        });

        // Ad 4. Maximize
        this.maximizeButton.setup(() => {
            this.toolbar.$el.classList.remove('executor-hidden-item');
            this.$code.classList.remove('executor-maximize');
            this.resultsWindow.$el.classList.remove('executor-hidden-item');
            this.aceHelper.editor.resize();
        }, () => {
            this.toolbar.$el.classList.add('executor-hidden-item');
            this.$code.classList.add('executor-maximize');
            this.resultsWindow.$el.classList.add('executor-hidden-item');
            this.aceHelper.editor.resize();
            this.aceHelper.editor.focus();
        });

        // Ad 5. Font Size
        this.fontSizeInput.setup(size => {
            this.settings.fontSize = size;
            this.applySettings();
        });

        // Ad 6. Execute
        this.executeButton.setup(runCode);

        // Results board
        // -------------

        this.aceHelper.editor.on('focus', () => {
            this.resultsWindow.save();
            this.resultsWindow.override();
        });

        this.aceHelper.editor.on('blur', () => {
            this.resultsWindow.prevent();
        });

        this.$main.appendChild(this.resultsWindow.$el);
    }

    applySettings() {
        let fontSize = this.settings.fontSize;

        this.aceHelper.editor.setFontSize(fontSize);
        this.fontSizeInput.$input.value = fontSize;
        this.resultsWindow.$el.style.fontSize = `${fontSize}px`;
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
