/**
 * Simplest way to get CSS property.
 *
 * @param {HTMLElement|Element} element
 * @param {string} prop
 * @return {string}
 */
function getCSSProperty(element, prop) {
    return window.getComputedStyle(element).getPropertyValue(prop);
}

module.exports = {
    getCSSProperty
};
