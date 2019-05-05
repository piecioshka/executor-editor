const EventEmitter = require('super-event-emitter');

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const ESCAPE = 27;

const IGNORE_KEYS = [LEFT, UP, RIGHT, DOWN, ESCAPE];

class Editor extends EventEmitter {
    $el = null;
    $code = null;

    constructor() {
        super();
        this.$el = document.createElement('pre');
        this.$code = document.createElement('code');
        this.$el.appendChild(this.$code);

        this._buildDOM();
        this._setupKeyboard();
    }

    _buildDOM() {
        this.$el.classList.add('language-javascript');
        this.$el.classList.add('executor-editor');
        this.$el.classList.add('line-numbers');
        this.$code.setAttribute('contentEditable', true);
    }

    _setupKeyboard() {
        let ignore = false;

        this.$code.addEventListener('keydown', (evt) => {
            const { keyCode } = evt;
            const { ctrlKey, metaKey } = evt;

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

    setCode(listing) {
        this.$code.textContent = listing;
    }

    getCode() {
        return this.$code.textContent;
    }

    render($placeHolder) {
        $placeHolder.appendChild(this.$el);
    }
}

Editor.EVENTS = {
    CHANGE: 'Editor.EVENTS.CHANGE'
};

module.exports = {
    Editor
};
