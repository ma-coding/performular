import { LayoutModelOptions } from '../../model/types/layout-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { JsonAbstractModelOptions } from './json-abstract-model-options';
import { JsonUnionOptions } from './json-unions-options';

export interface JsonLayoutOptions
    extends JsonAbstractModelOptions,
        RemoveKey<LayoutModelOptions, 'children'> {
    children: JsonUnionOptions[];
}
