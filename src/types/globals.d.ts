// Ambient declarations for dependencies that ship without types and for the
// optional Prism global used by the syntax-highlighting integration.

declare module 'debounce' {
    function debounce<A extends unknown[]>(
        fn: (...args: A) => void,
        wait?: number,
        immediate?: boolean
    ): ((...args: A) => void) & { clear(): void; flush(): void };
    export = debounce;
}

declare module 'selection-range' {
    interface SelectionRange {
        start: number;
        end: number;
    }
    function selectionRange(
        element: Element,
        range?: SelectionRange
    ): SelectionRange | undefined;
    export = selectionRange;
}

interface PrismNormalizeWhitespace {
    setDefaults(options: Record<string, boolean | number>): void;
}

interface PrismStatic {
    plugins: {
        NormalizeWhitespace: PrismNormalizeWhitespace;
    };
    highlightAll(): void;
}

interface Window {
    Prism?: PrismStatic;
}
