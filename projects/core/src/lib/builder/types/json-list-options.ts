import { ListFieldModelOptions } from '../../model/types/list-field-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { JsonAbstractModelOptions } from './json-abstract-model-options';
import { JsonUnionOptions } from './json-unions-options';

export interface JsonListOptions
    extends JsonAbstractModelOptions,
        RemoveKey<ListFieldModelOptions, 'childModel' | 'values'> {
    childModel: JsonUnionOptions;
}
