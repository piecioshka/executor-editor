const escape = require('escape-html');

const { ResizeHandleBar } = require('./resize-handle-bar');
const { ResultConsole } = require('./result-console');

class ResultWindow {
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
            const $executor = this.$el.parentNode.parentNode;
            const $editor = this.$el.parentNode.querySelector('.executor-editor');
            const $result = this.$el;
            const isColumnMode = $executor.classList.contains('executor-column-mode');

            if (isColumnMode) {
                $editor.style.width = `${payload.editorWindowWidth}px`;
                $editor.style.height = '100%';
                $result.style.width = `${payload.resultWindowWidth}px`;
                $result.style.height = '100%';
            } else {
                $editor.style.height = `${payload.editorWindowHeight}px`;
                $editor.style.width = '100%';
                $result.style.height = `${payload.resultWindowHeight}px`;
                $result.style.width = '100%';
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

    static parseSingle(item) {
        if (typeof item === 'string') {
            return { value: item, type: 'normal' };
        } else if (typeof item === 'function') {
            return { value: item.toString(), type: 'normal' };
        } else if (item instanceof Error) {
            return { value: item.stack, type: 'error' };
        }
        return { value: `${JSON.stringify(item)}`, type: 'normal' };
    }

    static parse(...buffer) {
        const result = [];

        buffer.forEach((row) => {
            row.forEach((item) => {
                let record = null;

                try {
                    record = ResultWindow.parseSingle(item);
                } catch (evt) {
                    record = { value: evt.message, type: 'error' };
                }

                let value = escape(record.value);

                if (record.type === 'error') {
                    value = `<span class="executor-error">${value}</span>`;
                }

                result.push(value);
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

module.exports = {
    ResultWindow
};
