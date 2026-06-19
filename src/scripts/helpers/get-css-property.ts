/**
 * Simplest way to get CSS property.
 */
export function getCSSProperty(element: Element, prop: string): string {
    return window.getComputedStyle(element).getPropertyValue(prop);
}
