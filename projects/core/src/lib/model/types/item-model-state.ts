import { ItemAlignValues } from '../../util/types/item-align-values';
import { ItemValues } from '../../util/types/item-values';
import { ViewScales } from '../../util/types/view-scales';
import { AbstractModelState } from './abstract-model-state';

export interface ItemModelState extends AbstractModelState {
    flex?: ViewScales<ItemValues>;
    flexOrder?: ViewScales<number>;
    flexOffset?: ViewScales<string>;
    flexAlign?: ViewScales<ItemAlignValues>;
}
