import { IViewScales } from './misc';

export type FlexValues = string | number;

export type FlexAlignValues = 'start' | 'baseline' | 'center' | 'end';

export interface IItem {
    flex: IViewScales<FlexValues>;
    order?: IViewScales<number>;
    offset?: IViewScales<string>;
    align?: IViewScales<FlexAlignValues>;
}

export interface IItemSchema {
    item?: IItem;
}
