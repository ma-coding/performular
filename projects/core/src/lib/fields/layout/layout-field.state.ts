import { RemoveKeys } from '../../core/misc/remove-keys';
import { ILayoutSchemaInitState } from '../../core/schemas/layout/layout-schema.state';

export type ILayoutFieldInitState<BindingsType> = RemoveKeys<ILayoutSchemaInitState<BindingsType>, 'id'>;
