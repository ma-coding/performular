import { LayoutAlign } from '../../util/types/layout-align';
import { LayoutValues } from '../../util/types/layout-values';
import { ViewScales } from '../../util/types/view-scales';
import { AbstractModel } from '../abstract-model';

export interface LayoutModelOptions {
    layout?: ViewScales<LayoutValues> | LayoutValues;
    layoutAlign?: ViewScales<LayoutAlign> | LayoutAlign;
    layoutGap?: ViewScales<string> | string;
    children: AbstractModel[];
}
