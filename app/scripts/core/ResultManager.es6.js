class ResultManager {

    buffer = new Set();
    $board = null;
    prevents = null;

    constructor($executor) {
        this.initialize($executor);
    }

    initialize($executor) {
        this.$board = $executor.querySelector('.executor-result');
    }

    save() {
        this.prevents = {};

        ResultManager.METHODS.forEach(name => {
            this.prevents[name] = window.console[name];
        });
    }

    override() {
        ResultManager.METHODS.forEach(name => {
            window.console[name] = this.add.bind(this);
        });
    }

    prevent() {
        ResultManager.METHODS.forEach(name => {
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
            result += `\n`;
        });

        return result;
    }

    print() {
        this.$board.innerText = ResultManager.parse(...this.buffer);
        this.buffer.clear();
    }
}

ResultManager.METHODS = ['log', 'info', 'warn', 'error'];

export default ResultManager;
