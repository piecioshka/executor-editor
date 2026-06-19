import { setupPrism } from './prism/custom-prism';
import type { Manager } from '../manager';

export function loadIntegrations(editor: Manager): void {
    setupPrism(editor);
}
