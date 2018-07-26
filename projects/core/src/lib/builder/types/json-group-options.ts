import { GroupFieldModelOptions } from '../../model/types/group-field-model-options';
import { ObjectType } from '../../util/types/object-type';
import { RemoveKey } from '../../util/types/remove-key';
import { JsonAbstractModelOptions } from './json-abstract-model-options';
import { JsonUnionOptions } from './json-unions-options';

export interface JsonGroupOptions
    extends JsonAbstractModelOptions,
        RemoveKey<GroupFieldModelOptions, 'children'> {
    children: JsonUnionOptions[];
}
