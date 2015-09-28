class ScriptLoader {
    static load(url, label) {
        const $element = document.createElement('script');
        const $head = document.head || document.querySelector('head');

        $element.setAttribute('src', url);
        $element.setAttribute('data-label', label);

        $head.appendChild($element);
    }

    static remove(label) {
        const $head = document.head || document.querySelector('head');
        const $elements = $head.querySelectorAll(`[data-label="${label}"]`);

        if ($elements) {
            Array.prototype.forEach.call($elements, $element => {
                $head.removeChild($element);
            });
        }
    }
}

export default ScriptLoader;
