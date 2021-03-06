import { ItemAlignValues } from '../../util/types/item-align-values';
import { ItemValues } from '../../util/types/item-values';
import { ViewScales } from '../../util/types/view-scales';
import { AbstractModel } from '../abstract-model';
import { DisplayModelOptions } from './display-model-options';

export interface ItemModelOptions
    extends Pick<DisplayModelOptions, 'hideWhenNoChild'> {
    flex?: ViewScales<ItemValues> | ItemValues;
    flexOrder?: ViewScales<number> | number;
    flexOffset?: ViewScales<string> | string;
    flexAlign?: ViewScales<ItemAlignValues> | ItemAlignValues;
    child: AbstractModel;
}
