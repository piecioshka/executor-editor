'use strict';

class ResultsWindow {
    $el = null;
    buffer = null;

    constructor() {
        this.buffer = new Set();

        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-result');
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
        this.append(ResultsWindow.parse(...this.buffer));
        this.buffer.clear();
    }

    append(text) {
        this.$el.innerHTML = text;
    }
}

export default ResultsWindow;
