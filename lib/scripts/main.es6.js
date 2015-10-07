// Import default styles.
require('../styles/executor.css');

// Browser polyfills.
require('./vendor/polyfills');

// Defined default layout for JavaScript mode in Ace editor.
require('../../bower_components/ace-builds/src-min/ace');
require('../../bower_components/ace-builds/src-min/ext-language_tools');
require('../../bower_components/ace-builds/src-min/mode-javascript');
require('../../bower_components/ace-builds/src-min/theme-tomorrow');

import Executor from './core/Executor';

/**
 * Bootstrap `executor.js`.
 */
function main() {
    let $instances = window.document.querySelectorAll('.executor-code');

    Array.prototype.forEach.call($instances, $instance => {
        let settings = {};

        if (Number($instance.dataset.fontSize)) {
            settings.fontSize = Number($instance.dataset.fontSize);
        }

        if (Number($instance.dataset.timeout)) {
            settings.timeout = Number($instance.dataset.timeout);
        }

        return new Executor($instance, settings);
    });
}

// If you attach executor.js after DOM is loaded.
if (window.document.readyState === 'complete') {
    main();

// If you attach executor.js before DOM is loaded.
} else {
    window.addEventListener('load', main);
}

// Exports to global namespace.
window.Executor = Executor;
