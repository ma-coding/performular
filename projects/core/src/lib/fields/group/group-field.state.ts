import { RemoveKeys } from '../../core/misc/remove-keys';
import { IFieldSchemaInitState } from '../../core/schemas/field/field-schema.state';

export type IGroupFieldInitState<BindingsType> = RemoveKeys<IFieldSchemaInitState<BindingsType>, 'value' | 'type' | 'focus'>;
