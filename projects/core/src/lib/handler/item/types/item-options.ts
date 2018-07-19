import { ViewScales } from '../../../util/types/view-scales';
import { ItemAlignValues } from './item-align-values';
import { ItemValues } from './item-values';

export interface ItemOptions {
    flex?: ViewScales<ItemValues>;
    flexOrder?: ViewScales<number>;
    flexOffset?: ViewScales<string>;
    flexAlign?: ViewScales<ItemAlignValues>;
}
