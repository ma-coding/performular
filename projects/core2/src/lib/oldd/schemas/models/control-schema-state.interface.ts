import { IFieldSchemaState } from './field-schema-state.interface';

export interface IControlSchemaState<B> extends IFieldSchemaState<B> {
    focus: boolean;
}
