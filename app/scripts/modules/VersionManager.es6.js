import ScriptLoader from '../common/ScriptLoader';

class VersionManager {
    $element = null;

    setup() {
        this.$element = document.querySelector('.terminal-version');
        this.$element.addEventListener('change', this.load.bind(this));

        this.load();
    }

    load() {
        const version = this.getVersion();

        switch (version) {
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

            // no default
        }
    }

    getVersion() {
        return this.$element.value;
    }
}

export default VersionManager;
