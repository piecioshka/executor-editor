import ScriptLoader from '../common/ScriptLoader';

class TranspilerManager {
    $element = null;

    setup() {
        this.$element = document.querySelector('.terminal-transpiler');
        this.$element.addEventListener('change', () => this.load());

        this.load();
    }

    load() {
        const name = this.getName();

        switch (name) {
            case 'babel':
                ScriptLoader.remove('traceur');
                ScriptLoader.load('./scripts/vendor/babel/browser.js', 'babel');
                ScriptLoader.load('./scripts/vendor/babel/browser-polyfill.js', 'babel');
                ScriptLoader.load('./scripts/vendor/babel/external-helpers.js', 'babel');
                break;

            case 'traceur':
                ScriptLoader.remove('babel');
                ScriptLoader.load('./scripts/vendor/traceur/traceur.js', 'traceur');
                break;

            default:
                throw new Error(`TranspilerManager#load: 'name' is not correct transpiler name (${name})`);
        }
    }

    getName() {
        return this.$element.value;
    }
}

export default TranspilerManager;
