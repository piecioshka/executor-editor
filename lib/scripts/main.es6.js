// Import default styles.
require('../styles/executor');

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
    const $instances = window.document.querySelectorAll('.executor');

    Array.prototype.forEach.call($instances, $instance => {
        const settings = {};

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
} else {
    // If you attach executor.js before DOM is loaded.
    window.addEventListener('load', main);
}

// Exports to global namespace.
window.Executor = Executor;
