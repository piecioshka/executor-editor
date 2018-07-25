import EventEmitter from 'super-event-emitter';

/**
 * Simplest way to get CSS property.
 *
 * @param {HTMLElement} element
 * @param {string} prop
 * @return {string}
 */
function getCSSProperty(element, prop) {
    return window.getComputedStyle(element).getPropertyValue(prop);
}

export default class ResizeHandleBar {
    constructor() {
        EventEmitter.mixin(this);

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

        document.addEventListener('mousemove', (event) => {
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

        document.addEventListener('mouseup', () => {
            drag = false;
        });
    }
}

ResizeHandleBar.EVENTS = { // eslint-disable-line object-curly-newline
    RESIZE: 'ResizeHandleBar.EVENTS.RESIZE'
};
