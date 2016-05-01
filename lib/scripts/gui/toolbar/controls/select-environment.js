'use strict';

class SelectEnvironment {
    $el = null;
    $select = null;

    constructor() {
        this.compile();
    }

    compile() {
        this.$el = window.document.createElement('label');

        this.$select = window.document.createElement('select');
        this.$select.classList.add('executor-env');

        let $babel = window.document.createElement('option');

        $babel.value = 'babel';
        $babel.appendChild(window.document.createTextNode('Babel.js (ES6 + ES7)'));
        this.$select.appendChild($babel);

        let $browser = window.document.createElement('option');

        $browser.value = 'browser';
        $browser.appendChild(window.document.createTextNode('Current browser'));

        this.$select.appendChild($browser);

        this.$el.appendChild(window.document.createTextNode('Env: '));
        this.$el.appendChild(this.$select);
    }

    setup(callback) {
        this.$select.addEventListener('change', callback);
    }

    getValue() {
        return this.$select.value;
    }
}

export default SelectEnvironment;
