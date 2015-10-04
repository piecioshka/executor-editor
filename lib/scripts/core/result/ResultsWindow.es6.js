class ResultsWindow {
    $el = null;
    buffer = new Set();
    prevents = null;

    constructor() {
        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-result');
    }

    save() {
        this.prevents = {};

        ResultsWindow.METHODS.forEach(name => {
            this.prevents[name] = window.console[name];
        });
    }

    override() {
        ResultsWindow.METHODS.forEach(name => {
            window.console[name] = this.add.bind(this);
        });
    }

    prevent() {
        ResultsWindow.METHODS.forEach(name => {
            window.console[name] = this.prevents[name];
        });
    }

    add(...text) {
        this.buffer.add(text);
    }

    static parse(...buffer) {
        let result = '';

        buffer.forEach(row => {
            row.forEach(item => {
                try {
                    result += `${JSON.stringify(item)} `;
                } catch (e) {
                    result += e.message;
                }
            });
            result += `<br />`;
        });

        return result;
    }

    print() {
        this.append(ResultsWindow.parse(...this.buffer));
        this.buffer.clear();
    }

    append(text) {
        this.$el.innerHTML = text;
    }
}

ResultsWindow.METHODS = ['log', 'info', 'warn', 'error'];

export default ResultsWindow;
