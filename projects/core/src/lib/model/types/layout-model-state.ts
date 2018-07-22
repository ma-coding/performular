import { LayoutAlign } from '../../util/types/layout-align';
import { LayoutValues } from '../../util/types/layout-values';
import { ViewScales } from '../../util/types/view-scales';
import { AbstractModel } from '../abstract-model';
import { AbstractModelState } from './abstract-model-state';

export interface LayoutModelState extends AbstractModelState {
    layout?: ViewScales<LayoutValues>;
    layoutAlign?: ViewScales<LayoutAlign>;
    layoutGap?: ViewScales<string>;
    children: AbstractModel[];
}
