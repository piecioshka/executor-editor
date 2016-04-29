'use strict';

import EventEmitter from 'super-event-emitter';

function getCSSProperty(element, prop) {
    return window.getComputedStyle(element).getPropertyValue(prop);
}

class ResizeHandleBar {
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

            let editor = this.$el.parentNode.parentNode.childNodes[0];
            let result = this.$el.parentNode.parentNode.childNodes[1];

            initialHeights = {
                editorHeight: parseInt(getCSSProperty(editor, 'height')),
                resultHeight: parseInt(getCSSProperty(result, 'height'))
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

            // let deltaX = initialPosition.x - event.clientX;
            let deltaY = initialPosition.y - event.clientY;

            this.emit(ResizeHandleBar.EVENTS.RESIZE, {
                editorWindowHeight: initialHeights.editorHeight - deltaY,
                resultWindowHeight: initialHeights.resultHeight + deltaY
            });
        });

        document.addEventListener('mouseup', () => {
            drag = false;
        });
    }
}

ResizeHandleBar.EVENTS = {
    RESIZE: 'ResizeHandleBar.EVENTS.RESIZE'
};

export default ResizeHandleBar;
