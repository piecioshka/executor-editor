const EventEmitter = require('super-event-emitter');
const { getCSSProperty } = require('../../helpers/get-css-property');

class ResizeHandleBar extends EventEmitter {
    constructor() {
        super();

        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-resize-handle-bar');
    }

    setupDOMListeners() {
        let drag = false;
        let initialPosition = null;
        let initialHeights = null;

        this.$el.addEventListener('mousedown', (event) => {
            drag = true;

            const editor = this.$el.parentNode.parentNode.childNodes[0];
            const result = this.$el.parentNode.parentNode.childNodes[1];

            initialHeights = {
                editorHeight: parseInt(getCSSProperty(editor, 'height'), 10),
                resultHeight: parseInt(getCSSProperty(result, 'height'), 10),
                editorWidth: parseInt(getCSSProperty(editor, 'width'), 10),
                resultWidth: parseInt(getCSSProperty(result, 'width'), 10)
            };

            initialPosition = {
                x: event.clientX,
                y: event.clientY
            };
        });

        window.document.addEventListener('mousemove', (event) => {
            if (!drag) {
                return;
            }

            const deltaX = initialPosition.x - event.clientX;
            const deltaY = initialPosition.y - event.clientY;

            const payload = {
                editorWindowHeight: initialHeights.editorHeight - deltaY,
                resultWindowHeight: initialHeights.resultHeight + deltaY,
                editorWindowWidth: initialHeights.editorWidth - deltaX,
                resultWindowWidth: initialHeights.resultWidth + deltaX
            };

            this.emit(ResizeHandleBar.EVENTS.RESIZE, payload);
        });

        window.document.addEventListener('mouseup', () => {
            drag = false;
        });
    }
}

ResizeHandleBar.EVENTS = {
    RESIZE: 'ResizeHandleBar.EVENTS.RESIZE'
};

module.exports = {
    ResizeHandleBar
};
