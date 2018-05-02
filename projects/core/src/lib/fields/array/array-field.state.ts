import { IChildGeneratorDefinition } from '../../core/loaders/generator-loader';
import { RemoveKeys } from '../../core/misc/remove-keys';
import { IFieldSchemaInitState } from '../../core/schemas/field/field-schema.state';

export interface IArrayFieldInitState<BindingsType>
    extends RemoveKeys<IFieldSchemaInitState<BindingsType>, 'value' | 'type' | 'children' | 'focus'> {
    children: IChildGeneratorDefinition<any>;
    value: any[];
}
