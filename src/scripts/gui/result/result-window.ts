import escape from 'escape-html';

import { ResizeHandleBar, type ResizePayload } from './resize-handle-bar';
import { ResultConsole } from './result-console';

type RecordType = 'normal' | 'error';

interface ParsedRecord {
    value: string;
    type: RecordType;
}

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error';
const CONSOLE_METHODS: ConsoleMethod[] = ['log', 'info', 'warn', 'error'];

export class ResultWindow {
    $el: HTMLDivElement;
    buffer: Set<unknown[]>;

    resizeHandlerBar: ResizeHandleBar;
    resultConsole: ResultConsole;

    constructor() {
        this.buffer = new Set();

        this.$el = window.document.createElement('div');
        this.$el.classList.add('executor-result');

        this.resizeHandlerBar = new ResizeHandleBar();
        this.$el.appendChild(this.resizeHandlerBar.$el);
        this.resizeHandlerBar.setupDOMListeners();

        this.resizeHandlerBar.on(ResizeHandleBar.EVENTS.RESIZE, (payload: ResizePayload) => {
            const $executor = this.$el.parentElement?.parentElement;
            const $editor = this.$el.parentElement?.querySelector<HTMLElement>('.executor-editor');
            const $result = this.$el;

            if (!$executor || !$editor) {
                return;
            }

            const isColumnMode = $executor.classList.contains('executor-column-mode');

            if (isColumnMode) {
                $editor.style.width = `${payload.editorWindowWidth}px`;
                $editor.style.height = '100%';
                $result.style.width = `${payload.resultWindowWidth}px`;
                $result.style.height = '100%';
            } else {
                $editor.style.height = `${payload.editorWindowHeight}px`;
                $editor.style.width = '100%';
                $result.style.height = `${payload.resultWindowHeight}px`;
                $result.style.width = '100%';
            }
        });

        this.resultConsole = new ResultConsole();
        this.$el.appendChild(this.resultConsole.$el);
    }

    catchConsole(): void {
        CONSOLE_METHODS.forEach((name) => {
            window.console[name] = (...args: unknown[]): void => {
                this.buffer.add(args);
            };
        });
    }

    static parseSingle(item: unknown): ParsedRecord {
        if (typeof item === 'string') {
            return { value: item, type: 'normal' };
        } else if (typeof item === 'function') {
            return { value: item.toString(), type: 'normal' };
        } else if (item instanceof Error) {
            return { value: item.stack ?? item.message, type: 'error' };
        }
        return { value: `${JSON.stringify(item)}`, type: 'normal' };
    }

    static parse(...buffer: unknown[][]): string {
        const result: string[] = [];

        buffer.forEach((row) => {
            row.forEach((item) => {
                let record: ParsedRecord;

                try {
                    record = ResultWindow.parseSingle(item);
                } catch (evt) {
                    const message = evt instanceof Error ? evt.message : String(evt);
                    record = { value: message, type: 'error' };
                }

                let value = escape(record.value);

                if (record.type === 'error') {
                    value = `<span class="executor-error">${value}</span>`;
                }

                result.push(value);
            });
            result.push('<br />');
        });

        return result.join('');
    }

    print(): void {
        this.append(ResultWindow.parse(...this.buffer));
        this.buffer.clear();
    }

    append(text: string): void {
        this.resultConsole.append(text);
    }
}
