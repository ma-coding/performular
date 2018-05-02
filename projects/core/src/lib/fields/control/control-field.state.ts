import { RemoveKeys } from '../../core/misc/remove-keys';
import { IFieldSchemaInitState } from '../../core/schemas/field/field-schema.state';

export type IControlFieldInitState<BindingsType> = RemoveKeys<IFieldSchemaInitState<BindingsType>, 'children' | 'type'>;
