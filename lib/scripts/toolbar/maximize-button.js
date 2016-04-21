'use strict';

class MaximizeButton {
    $el = null;
    $button = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('label');
        this.$el.appendChild(window.document.createTextNode('Maximize: '));
        this.$button = window.document.createElement('i');
        this.$button.classList.add('executor-icon-maximize');
        this.$el.appendChild(this.$button);
    }

    setup(escapeHandler, clickHandler) {
        let handleKeyDown = (evt) => {
            if (!MaximizeButton.isEscape(evt)) {
                return;
            }

            escapeHandler();
            window.document.body.removeEventListener('keydown', handleKeyDown);

            // Fixed embed in presentation slides, ex. shower.js
            evt.stopPropagation();
        };

        function handleMaximizeClick() {
            clickHandler();
            window.document.body.addEventListener('keydown', handleKeyDown);
        }

        this.$button.addEventListener('click', handleMaximizeClick);
    }
}

MaximizeButton.isEscape = function (evt) {
    return evt.keyCode === MaximizeButton.ESCAPE_KEY_CODE;
};

MaximizeButton.ESCAPE_KEY_CODE = 27;

export default MaximizeButton;
