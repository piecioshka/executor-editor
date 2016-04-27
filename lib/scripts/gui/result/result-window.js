'use strict';

import ResizeHandleBar from './resize-handle-bar';
import ResultConsole from './result-console';

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

        this.resultConsole = new ResultConsole();
        this.$el.appendChild(this.resultConsole.$el);
    }

    setup() {
        ['log', 'info', 'warn', 'error'].forEach(name => {
            window.console[name] = (...args) => this.buffer.add(args);
        });
    }

    static parse(...buffer) {
        let result = [];

        buffer.forEach(row => {
            row.forEach(item => {
                try {
                    if (typeof item === 'string') {
                        result.push(item);
                    } else if (typeof item === 'function') {
                        result.push(item.toString());
                    } else {
                        result.push(`${JSON.stringify(item)} `);
                    }
                } catch (e) {
                    result.push(e.message);
                }
            });
            result.push(`<br />`);
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

export default ResultWindow;
