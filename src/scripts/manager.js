const EventEmitter = require('super-event-emitter');

const { Toolbar } = require('./gui/toolbar/toolbar');
const { Editor } = require('./editor');

const { AutoEvaluateCheckbox } = require('./gui/toolbar/controls/auto-evaluate-checkbox');
const { ExecuteButton } = require('./gui/toolbar/controls/execute-button');
const { LayoutSwitcherButton } = require('./gui/toolbar/controls/layout-switcher-button');
const { ResultWindow } = require('./gui/result/result-window');
const { VersionLabel } = require('./gui/version-label');

class Manager extends EventEmitter {

    $main = null;
    $global = null;

    settings = {
        autoevaluate: true,
        autofocus: false,
        skin: 'normal'
    };

    toolbar = null;

    editor = null;

    autoEvaluateCheckbox = null;
    layoutSwitcher = null;
    executeButton = null;

    resultsWindow = null;
    versionLabel = null;

    constructor($code, settings) {
        super();
        this.settings = Object.assign(this.settings, settings);
        this.toolbar = new Toolbar();

        this._buildBaseDOM();
        this._setupSkin();
        this._setupMode();
        this._setupEditor($code.textContent);
        this._buildDOM();
        this._setupEvents();

        this.render($code);
        this._focus();

        if (this.settings.autoevaluate) {
            this.runCode();
        }
    }

    _buildBaseDOM() {
        this.$main = window.document.createElement('div');
        this.$main.classList.add('executor-main');

        this.$global = window.document.createElement('div');
        this.$global.classList.add('executor');
    }

    _setupSkin() {
        this.$global.classList.add(`skin-${this.settings.skin}`);
    }

    _setupMode() {
        this.$global.classList.add('executor-column-mode');
    }

    _setupEditor(listing) {
        this.editor = new Editor();
        this.editor.setCode(listing);
        this.editor.render(this.$main);
    }

    _buildDOM() {
        this.autoEvaluateCheckbox = this.toolbar.add(new AutoEvaluateCheckbox());
        this.autoEvaluateCheckbox.on(AutoEvaluateCheckbox.EVENTS.CHECK, () => {
            this.settings.autoevaluate = true;
        });
        this.autoEvaluateCheckbox.on(AutoEvaluateCheckbox.EVENTS.UNCHECK, () => {
            this.settings.autoevaluate = false;
        });

        if (this.settings.autoevaluate) {
            this.autoEvaluateCheckbox.mark();
        }

        this.layoutSwitcher = this.toolbar.add(new LayoutSwitcherButton());
        this.executeButton = this.toolbar.add(new ExecuteButton());

        this.resultsWindow = new ResultWindow();
        this.versionLabel = new VersionLabel();
    }

    _setupEvents() {
        // Ad 1. Auto evaluate
        this.editor.on(Editor.EVENTS.CHANGE, (payload) => {
            this.emit(Manager.EVENTS.UPDATE, payload);

            if (this.settings.autoevaluate) {
                this.runCode();
            }
        });

        // Ad 2. Layout
        this.layoutSwitcher.setup(() => this._switchLayout());

        // Ad 3. Execute
        this.executeButton.setup(() => this.runCode());
    }

    render($code) {
        $code.parentNode.replaceChild(this.$global, $code);
        this.$main.appendChild(this.resultsWindow.$el);

        this.$global.appendChild(this.toolbar.$el);
        this.$global.appendChild(this.$main);
        this.$global.appendChild(this.versionLabel.$el);
    }

    _focus() {
        if (this.settings.autofocus) {
            this.$global.querySelector('code').focus();
        }
    }

    runCode() {
        this.resultsWindow.catchConsole();
        const code = this.editor.getCode();

        try {
            // eslint-disable-next-line
            eval(code);
        } catch (err) {
            console.error(err);
        }

        this.resultsWindow.print();
    }

    _switchLayout() {
        this.$global.classList.toggle('executor-column-mode');
        this._resetAfterSwitchLayout();
    }

    _resetAfterSwitchLayout() {
        const $editor = this.editor.$el;
        const $result = this.resultsWindow.$el;

        if (this.$global.classList.contains('executor-column-mode')) {
            $editor.style.width = '50%';
            $editor.style.height = '100%';
            $result.style.width = '50%';
            $result.style.height = '100%';
        } else {
            $editor.style.width = '100%';
            $editor.style.height = '50%';
            $result.style.width = '100%';
            $result.style.height = '50%';
        }
    }
}

Manager.EVENTS = {
    UPDATE: 'Manager.EVENTS.UPDATE'
};

module.exports = {
    Manager
};
