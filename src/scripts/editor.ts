import { SuperEventEmitter } from 'super-event-emitter';

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const ESCAPE = 27;

const IGNORE_KEYS = [LEFT, UP, RIGHT, DOWN, ESCAPE];

export class Editor extends SuperEventEmitter {
    static EVENTS = {
        CHANGE: 'Editor.EVENTS.CHANGE'
    };

    $el: HTMLPreElement;
    $code: HTMLElement;

    constructor() {
        super();
        this.$el = window.document.createElement('pre');
        this.$code = window.document.createElement('code');
        this.$el.appendChild(this.$code);

        this._buildDOM();
        this._setupKeyboard();
    }

    _buildDOM(): void {
        this.$el.classList.add('language-javascript');
        this.$el.classList.add('executor-editor');
        this.$el.classList.add('line-numbers');
        this.$code.setAttribute('contentEditable', 'true');
    }

    _setupKeyboard(): void {
        let ignore = false;

        this.$code.addEventListener('keydown', (evt) => {
            const { keyCode, ctrlKey, metaKey } = evt;

            if (ctrlKey || metaKey) {
                // Ignore when CTRL or CMD are pressed
                ignore = true;
                return;
            }

            if (IGNORE_KEYS.includes(keyCode)) {
                // Ignore keys what don't input values
                ignore = true;
                return;
            }

            ignore = false;
        });

        this.$code.addEventListener('keyup', (evt) => {
            if (ignore) {
                return;
            }
            this.emit(Editor.EVENTS.CHANGE, evt);
        });
    }

    setCode(listing: string): void {
        this.$code.textContent = listing;
    }

    getCode(): string {
        return this.$code.textContent ?? '';
    }

    render($placeHolder: Element): void {
        $placeHolder.appendChild(this.$el);
    }
}
