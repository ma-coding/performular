import { IAbstractSchemaState } from './abstract-schema-state.interface';

export interface ILayoutSchemaState<BType = any> extends IAbstractSchemaState<BType> {
    id: string;
}
