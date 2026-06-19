import type { PartialSettings } from '../types';

export function parseSettings($editor: HTMLElement): PartialSettings {
    const settings: Record<string, unknown> = {};
    const $attributes = $editor.dataset;

    Object.keys($attributes).forEach((name) => {
        const raw = $attributes[name];

        if (raw === undefined || raw.length === 0) {
            return;
        }

        let value: unknown = raw;

        try {
            value = JSON.parse(raw);
        } catch {
            // Keep the raw string when it is not valid JSON.
        }

        settings[name] = value;
    });

    return settings;
}
