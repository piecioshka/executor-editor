import { SuperEventEmitter } from 'super-event-emitter';

import { Toolbar } from './gui/toolbar/toolbar';
import { Editor } from './editor';

import { AutoEvaluateCheckbox } from './gui/toolbar/controls/auto-evaluate-checkbox';
import { ExecuteButton } from './gui/toolbar/controls/execute-button';
import { LayoutSwitcherButton } from './gui/toolbar/controls/layout-switcher-button';
import { MaximizeButton } from './gui/toolbar/controls/maximize-button';
import { ResultWindow } from './gui/result/result-window';
import { VersionLabel } from './gui/version-label';

import type { PartialSettings, Settings } from './types';

const DEFAULT_SETTINGS: Settings = {
    autoevaluate: true,
    autofocus: false,
    skin: 'normal',
    layout: 'horizontal',
    maximize: false
};

export class Manager extends SuperEventEmitter {
    static EVENTS = {
        UPDATE: 'Manager.EVENTS.UPDATE'
    };

    settings: Settings;
    toolbar: Toolbar;

    $main: HTMLDivElement;
    $global: HTMLDivElement;

    editor: Editor;

    autoEvaluate: AutoEvaluateCheckbox;
    layoutSwitcher: LayoutSwitcherButton;
    maximizeButton: MaximizeButton;
    executeButton: ExecuteButton;

    resultsWindow: ResultWindow;
    versionLabel: VersionLabel;

    constructor($code: HTMLElement, settings: PartialSettings) {
        super();
        this.settings = { ...DEFAULT_SETTINGS, ...settings };
        this.toolbar = new Toolbar();

        this.$main = window.document.createElement('div');
        this.$main.classList.add('executor-main');

        this.$global = window.document.createElement('div');
        this.$global.classList.add('executor');

        this._setupSkin();
        this._setupMode();

        this.editor = new Editor();
        this._setupEditor($code.textContent ?? '');

        this.autoEvaluate = this.toolbar.add(new AutoEvaluateCheckbox());
        this.layoutSwitcher = this.toolbar.add(new LayoutSwitcherButton());
        this.maximizeButton = this.toolbar.add(new MaximizeButton());
        this.executeButton = this.toolbar.add(new ExecuteButton());

        this.resultsWindow = new ResultWindow();
        this.versionLabel = new VersionLabel();

        this._setupAutoEvaluate();
        this._setupEvents();

        this.render($code);
        this._focus();

        if (this.settings.autoevaluate) {
            this.runCode();
        }
    }

    _setupSkin(): void {
        this.$global.classList.add(`skin-${this.settings.skin}`);
    }

    _setupMode(): void {
        // `horizontal` (default) renders the editor next to the result
        // (column layout); `vertical` stacks the editor above the result.
        if (this.settings.layout !== 'vertical') {
            this.$global.classList.add('executor-column-mode');
        }

        // `maximize` hides the result and lets the editor fill the component,
        // useful to present code without running it.
        if (this.settings.maximize) {
            this.$global.classList.add('executor-maximize-mode');
        }
    }

    _setupEditor(listing: string): void {
        this.editor.setCode(listing);
        this.editor.render(this.$main);
    }

    _setupAutoEvaluate(): void {
        this.autoEvaluate.on(AutoEvaluateCheckbox.EVENTS.CHECK, () => {
            this.settings.autoevaluate = true;
        });
        this.autoEvaluate.on(AutoEvaluateCheckbox.EVENTS.UNCHECK, () => {
            this.settings.autoevaluate = false;
        });

        if (this.settings.autoevaluate) {
            this.autoEvaluate.mark();
        }
    }

    _setupEvents(): void {
        // Ad 1. Auto evaluate
        this.editor.on(Editor.EVENTS.CHANGE, (payload: unknown) => {
            this.emit(Manager.EVENTS.UPDATE, payload);

            if (this.settings.autoevaluate) {
                this.runCode();
            }
        });

        // Ad 2. Layout
        this.layoutSwitcher.setup(() => this._switchLayout());

        // Ad 3. Maximize
        this.maximizeButton.setup(() => this._toggleMaximize());

        // Ad 4. Execute
        this.executeButton.setup(() => this.runCode());
    }

    render($code: Element): void {
        $code.parentNode?.replaceChild(this.$global, $code);
        this.$main.appendChild(this.resultsWindow.$el);

        this.$global.appendChild(this.toolbar.$el);
        this.$global.appendChild(this.$main);
        this.$global.appendChild(this.versionLabel.$el);
    }

    _focus(): void {
        if (this.settings.autofocus) {
            this.$global.querySelector<HTMLElement>('code')?.focus();
        }
    }

    runCode(): void {
        this.resultsWindow.catchConsole();
        const code = this.editor.getCode();

        try {
            // eslint-disable-next-line no-eval
            eval(code);
        } catch (err) {
            console.error(err);
        }

        this.resultsWindow.print();
    }

    _switchLayout(): void {
        this.$global.classList.toggle('executor-column-mode');
        this._resetAfterSwitchLayout();
    }

    _toggleMaximize(): void {
        const maximized = this.$global.classList.toggle('executor-maximize-mode');
        this.settings.maximize = maximized;

        if (maximized) {
            // Drop inline sizes left by `_switchLayout` so the maximize CSS
            // (editor at 100%, result hidden) is not overridden.
            this.editor.$el.style.width = '';
            this.editor.$el.style.height = '';
        } else {
            this._resetAfterSwitchLayout();
        }
    }

    _resetAfterSwitchLayout(): void {
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
