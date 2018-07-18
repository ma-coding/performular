import { ViewScales } from '../../utils/types/view-scales';
import { LayoutAlign } from './layout-align';
import { LayoutValues } from './layout-values';

export interface LayoutOptions {
    layout?: ViewScales<LayoutValues>;
    layoutAlign?: ViewScales<LayoutAlign>;
    layoutGap?: ViewScales<string>;
}
