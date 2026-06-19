export type Layout = 'horizontal' | 'vertical';

export type Skin = 'normal' | 'blue';

export interface Settings {
    autoevaluate: boolean;
    autofocus: boolean;
    skin: Skin;
    layout: Layout;
    maximize: boolean;
}

export type PartialSettings = Partial<Settings>;
