const pkg = require('../../../package.json');

class VersionLabel {
    constructor() {
        this.$el = window.document.createElement('i');
        this.$el.classList.add('executor-version-label');
        this.$el.innerHTML = `v${pkg.version}`;
    }
}

module.exports = {
    VersionLabel
};
