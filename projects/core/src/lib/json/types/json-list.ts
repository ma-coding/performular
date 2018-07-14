import { ListFieldOptions } from '../../fields/list-field/types/list-field-options';
import { FrameworkType } from '../../framework/types/framework-type';
import { RemoveKey } from '../../utils/types/remove-key';
import { JsonUnions } from './json-unions';

export interface JsonList
    extends RemoveKey<ListFieldOptions, 'childGenerator' | 'values'> {
    type: FrameworkType;
    childDef: JsonUnions;
}
