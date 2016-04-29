'use strict';

import EventEmitter from 'super-event-emitter';

import Toolbar from './gui/toolbar/toolbar';

import ExecuteManager from './helpers/execute-manager';
import AceEditorWrapper from './editor/ace-editor-wrapper';

import AutoEvaluateCheckbox from './gui/toolbar/controls/auto-evaluate-checkbox';
import ExecuteButton from './gui/toolbar/controls/execute-button';
import FontSizeInput from './gui/toolbar/controls/font-size-input';
import LayoutSwitcher from './gui/toolbar/controls/layout-switcher';
import MaximizeButton from './gui/toolbar/controls/maximize-button';
import SelectEnvironment from './gui/toolbar/controls/select-environment';
import ResultWindow from './gui/result/result-window';
import ResizeHandleBar from './gui/result/resize-handle-bar';
import VersionLabel from './gui/version-label';

class ExecutorManager {
    listing = null;

    $code = null;
    $main = null;
    $global = null;

    settings = {
        fontSize: 16,
        timeout: 1000,
        width: 800,
        height: 460
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
        EventEmitter.mixin(this);

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
        this.aceHelper = new AceEditorWrapper();

        this.autoEvaluate = this.toolbar.add(new AutoEvaluateCheckbox());
        this.selectEnvironment = this.toolbar.add(new SelectEnvironment());
        this.layoutSwitcher = this.toolbar.add(new LayoutSwitcher());
        this.maximizeButton = this.toolbar.add(new MaximizeButton());
        this.fontSizeInput = this.toolbar.add(new FontSizeInput());
        this.executeButton = this.toolbar.add(new ExecuteButton());

        this.resultsWindow = new ResultWindow();
        this.resultsWindow.resizeHandlerBar.on(ResizeHandleBar.EVENTS.RESIZE, () => {
            this.aceHelper.editor.resize();
        });
        this.versionLabel = new VersionLabel();
    }

    setupEvents() {
        let runCode = () => {
            this.resultsWindow.catchConsole();
            this.execute(this.selectEnvironment.getValue(), this.aceHelper.getCode());
        };

        // Toolbar
        // -------

        // Ad 1. Auto evaluate
        this.aceHelper.setup(this.$code);

        // Ad 1. b) Resize editor due to settings
        this.$global.style.width = `${this.settings.width}px`;
        this.$global.style.height = `${this.settings.height}px`;
        this.aceHelper.editor.resize();

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

            this.$code.style.width = '';
            this.resultsWindow.$el.style.width = '';

            this.emit(ExecutorManager.EVENTS.LAYOUT.HORIZONTAL);
        }, () => {
            this.$code.classList.add('executor-left-column');
            this.resultsWindow.$el.classList.add('executor-right-column');
            this.aceHelper.editor.resize();

            this.$code.style.height = '';
            this.resultsWindow.$el.style.height = '';

            this.emit(ExecutorManager.EVENTS.LAYOUT.VERTICAL);
        });

        // Ad 4. Maximize
        this.maximizeButton.setup(() => {
            this.toolbar.$el.classList.remove('executor-hidden-item');
            this.$code.parentNode.classList.remove('executor-maximize');
            this.resultsWindow.$el.classList.remove('executor-hidden-item');
            this.aceHelper.editor.resize();
        }, () => {
            this.toolbar.$el.classList.add('executor-hidden-item');
            this.$code.parentNode.classList.add('executor-maximize');
            this.resultsWindow.$el.classList.add('executor-hidden-item');
            this.aceHelper.editor.resize();
            this.aceHelper.editor.focus();

            this.$code.style.width = '';
            this.$code.style.height = '';

            this.aceHelper.editor.resize();
        });

        // Ad 5. Font Size
        this.fontSizeInput.setup(size => {
            this.settings.fontSize = size;
            this.applySettings();
        });

        // Ad 6. Execute
        this.executeButton.setup(runCode);

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
        } catch (error) {
            console.error(error.message);
        }

        this.resultsWindow.print();
    }
}

ExecutorManager.EVENTS = {
    LAYOUT: {
        HORIZONTAL: 'ExecutorManager.EVENTS.LAYOUT.HORIZONTAL',
        VERTICAL: 'ExecutorManager.EVENTS.LAYOUT.VERTICAL'
    }
};

export default ExecutorManager;
