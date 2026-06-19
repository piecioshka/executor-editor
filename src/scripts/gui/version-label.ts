import pkg from '../../../package.json';

export class VersionLabel {
    $el: HTMLElement;

    constructor() {
        this.$el = window.document.createElement('i');
        this.$el.classList.add('executor-version-label');
        this.$el.innerHTML = `v${pkg.version}`;
    }
}
