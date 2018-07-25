import ResizeHandleBar from './resize-handle-bar';
import ResultConsole from './result-console';

export default class ResultWindow {
    $el = null;
    buffer = null;

    resizeHandlerBar = null;
    resultConsole = null;

    constructor() {
        this.buffer = new Set();

        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-result');

        this.resizeHandlerBar = new ResizeHandleBar();
        this.$el.appendChild(this.resizeHandlerBar.$el);
        this.resizeHandlerBar.setupDOMListeners();

        this.resizeHandlerBar.on(ResizeHandleBar.EVENTS.RESIZE, (payload) => {
            const editor = this.$el.parentNode.childNodes[0];
            const isVerticalMode = editor.classList.contains('executor-left-column');

            if (isVerticalMode) {
                editor.style.width = `${payload.editorWindowWidth}px`;
                this.$el.style.width = `${payload.resultWindowWidth}px`;
            } else {
                editor.style.height = `${payload.editorWindowHeight}px`;
                this.$el.style.height = `${payload.resultWindowHeight}px`;
            }
        });

        this.resultConsole = new ResultConsole();
        this.$el.appendChild(this.resultConsole.$el);
    }

    catchConsole() {
        ['log', 'info', 'warn', 'error'].forEach((name) => {
            window.console[name] = (...args) => this.buffer.add(args);
        });
    }

    static parse(...buffer) {
        const result = [];

        buffer.forEach((row) => {
            row.forEach((item) => {
                try {
                    if (typeof item === 'string') {
                        result.push(item);
                    } else if (typeof item === 'function') {
                        result.push(item.toString());
                    } else {
                        result.push(`${JSON.stringify(item)} `);
                    }
                } catch (evt) {
                    result.push(evt.message);
                }
            });
            result.push('<br />');
        });

        return result.join('');
    }

    print() {
        this.append(ResultWindow.parse(...this.buffer));
        this.buffer.clear();
    }

    append(text) {
        this.resultConsole.append(text);
    }
}
