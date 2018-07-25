export default class MaximizeButton {
    $el = null;
    $button = null;

    constructor() {
        this.escapeHandler = null;
        this.clickHandler = null;
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('label');

        this.$button = window.document.createElement('i');
        this.$button.classList.add('executor-icon-maximize');

        this.$el.appendChild(window.document.createTextNode('Maximize: '));
        this.$el.appendChild(this.$button);
    }

    _handleKeyDown(evt) {
        if (!MaximizeButton.isEscape(evt)) {
            return;
        }

        this.escapeHandler();
        window.document.body.removeEventListener('keydown', this._handleKeyDown.bind(this));

        // Fixed embed in presentation slides, ex. shower.js
        evt.stopPropagation();
    }

    _handleMaximizeClick() {
        this.clickHandler();
        window.document.body.addEventListener('keydown', this._handleKeyDown.bind(this));
    }

    setup(escapeHandler, clickHandler) {
        this.escapeHandler = escapeHandler;
        this.clickHandler = clickHandler;
        this.$button.addEventListener('click', this._handleMaximizeClick.bind(this));
    }
}

MaximizeButton.isEscape = function (evt) {
    return evt.keyCode === MaximizeButton.ESCAPE_KEY_CODE;
};

MaximizeButton.ESCAPE_KEY_CODE = 27;
