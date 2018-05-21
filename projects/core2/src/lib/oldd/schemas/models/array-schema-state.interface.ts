import { IAbstractProperty } from '../../properties/models/abstract-property.interface';
import { IFieldSchemaState } from './field-schema-state.interface';

export interface IArraySchemaState<B> extends IFieldSchemaState<B> {
    childSchema: IAbstractProperty<any, any, any>;
}
