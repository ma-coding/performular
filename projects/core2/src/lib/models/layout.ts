import { IViewScales } from './misc';

export type DirectionValues = 'row' | 'row wrap' | 'column' | 'column wrap' |
    'row-reverse' | 'row-reverse wrap' | 'column-reverse' | 'column-reverse wrap';

export type AlignMainValues = 'start' | 'center' | 'end' | 'space-around' | 'space-between';
export type AlignCrossValues = 'start' | 'center' | 'end' | 'stretch';

export interface ILayoutAlign {
    main: IViewScales<AlignMainValues>;
    cross: IViewScales<AlignCrossValues>;
}

export interface ILayout {
    direction: IViewScales<DirectionValues>;
    align?: ILayoutAlign;
    gap?: string;
}

export interface ILayoutSchema {
    layout?: ILayout;
}
