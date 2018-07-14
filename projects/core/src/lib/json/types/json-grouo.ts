import { GroupFieldOptions } from '../../fields/group-field/types/group-field-options';
import { FrameworkType } from '../../framework/types/framework-type';
import { RemoveKey } from '../../utils/types/remove-key';
import { JsonUnions } from './json-unions';

export interface JsonGroup
    extends RemoveKey<GroupFieldOptions, 'children' | 'value'> {
    type: FrameworkType;
    children: JsonUnions[];
}
