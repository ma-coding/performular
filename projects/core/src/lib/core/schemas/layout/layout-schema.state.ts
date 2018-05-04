import { RemoveKeys } from '../../misc/remove-keys';
import {
    IAbstractSchemaInitState,
    IAbstractSchemaNonInitState,
    IAbstractSchemaState,
} from '../abstract/abstract-schema.state';

export type ILayoutSchemaNonInitState = IAbstractSchemaNonInitState;

export interface ILayoutSchemaState<BindingsType> extends IAbstractSchemaState<BindingsType>, ILayoutSchemaNonInitState {
    autoHide: boolean;
}

export interface ILayoutSchemaInitState<BindingsType> extends
    RemoveKeys<ILayoutSchemaState<BindingsType>, keyof ILayoutSchemaNonInitState | 'autoHide'>,
    IAbstractSchemaInitState<BindingsType> {
    autoHide?: boolean;
}
