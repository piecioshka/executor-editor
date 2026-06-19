import { SuperEventEmitter } from 'super-event-emitter';
import { getCSSProperty } from '../../helpers/get-css-property';

export interface ResizePayload {
    editorWindowHeight: number;
    resultWindowHeight: number;
    editorWindowWidth: number;
    resultWindowWidth: number;
}

interface InitialSizes {
    editorHeight: number;
    resultHeight: number;
    editorWidth: number;
    resultWidth: number;
}

interface InitialPosition {
    x: number;
    y: number;
}

export class ResizeHandleBar extends SuperEventEmitter {
    static EVENTS = {
        RESIZE: 'ResizeHandleBar.EVENTS.RESIZE'
    };

    $el: HTMLDivElement;

    constructor() {
        super();

        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-resize-handle-bar');
    }

    setupDOMListeners(): void {
        let drag = false;
        let initialPosition: InitialPosition | null = null;
        let initialSizes: InitialSizes | null = null;

        this.$el.addEventListener('mousedown', (event) => {
            const $row = this.$el.parentElement?.parentElement;
            const editor = $row?.children[0];
            const result = $row?.children[1];

            if (!editor || !result) {
                return;
            }

            drag = true;

            initialSizes = {
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
            if (!drag || initialPosition === null || initialSizes === null) {
                return;
            }

            const deltaX = initialPosition.x - event.clientX;
            const deltaY = initialPosition.y - event.clientY;

            const payload: ResizePayload = {
                editorWindowHeight: initialSizes.editorHeight - deltaY,
                resultWindowHeight: initialSizes.resultHeight + deltaY,
                editorWindowWidth: initialSizes.editorWidth - deltaX,
                resultWindowWidth: initialSizes.resultWidth + deltaX
            };

            this.emit(ResizeHandleBar.EVENTS.RESIZE, payload);
        });

        window.document.addEventListener('mouseup', () => {
            drag = false;
        });
    }
}
