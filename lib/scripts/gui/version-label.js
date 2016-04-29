'use strict';

import pkg from '../../../package.json';

class VersionLabel {
    constructor() {
        this.$el = window.document.createElement('i');
        this.$el.classList.add('executor-version-label');
        this.$el.innerHTML = pkg.version;
    }
}

export default VersionLabel;
