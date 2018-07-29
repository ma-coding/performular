import { ItemModelOptions } from '../../model/types/item-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { JsonAbstractModelOptions } from './json-abstract-model-options';
import { JsonUnionOptions } from './json-unions-options';

export interface JsonItemOptions
    extends JsonAbstractModelOptions,
        RemoveKey<ItemModelOptions, 'child'> {
    child: JsonUnionOptions;
}
