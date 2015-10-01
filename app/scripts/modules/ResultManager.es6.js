class ResultManager {

    buffer = new Set();
    $board = null;

    constructor() {
        this.$board = document.querySelector('.terminal-result');

        this.override();
    }

    override() {
        const methods = ['log', 'info', 'warn', 'error'];

        methods.forEach(name => {
            window.console[name] = this.add.bind(this);
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

export default ResultManager;
