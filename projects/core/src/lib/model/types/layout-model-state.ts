import { LayoutAlign } from '../../util/types/layout-align';
import { LayoutValues } from '../../util/types/layout-values';
import { ViewScales } from '../../util/types/view-scales';
import { AbstractModel } from '../abstract-model';
import { DisplayModelState } from './display-model-state';

export interface LayoutModelState extends DisplayModelState<undefined> {
    layout?: ViewScales<LayoutValues>;
    layoutAlign?: ViewScales<LayoutAlign>;
    layoutGap?: ViewScales<string>;
    children: AbstractModel[];
}
