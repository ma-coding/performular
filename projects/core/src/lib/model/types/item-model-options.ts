import { ItemAlignValues } from '../../util/types/item-align-values';
import { ItemValues } from '../../util/types/item-values';
import { ViewScales } from '../../util/types/view-scales';
import { AbstractModel } from '../abstract-model';

export interface ItemModelOptions {
    flex?: ViewScales<ItemValues>;
    flexOrder?: ViewScales<number>;
    flexOffset?: ViewScales<string>;
    flexAlign?: ViewScales<ItemAlignValues>;
    child: AbstractModel;
}
