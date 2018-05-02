import {
    IValidationDefinition,
    IVisibilityDefinition,
    ValidationLoader,
    VisibilityLoader,
} from '../../loaders/trigger-loader';
import { RemoveKeys } from '../../misc/remove-keys';
import {
    IAbstractSchemaInitState,
    IAbstractSchemaNonInitState,
    IAbstractSchemaState,
} from '../abstract/abstract-schema.state';

export enum FieldType {
    Control = 'Control',
    Array = 'Array',
    Group = 'Group'
}

export interface IFieldSchemaNonInitState extends IAbstractSchemaNonInitState {
    initialValue: any;
    hiddenResults: boolean[];
    disabledResults: boolean[];
    errorResults: string[];
    disabled: boolean;
    invalid: boolean;
    errorState: boolean;
    changed: boolean;
    dirty: boolean;
    disabledWhen: VisibilityLoader<any>[];
    hiddenWhen: VisibilityLoader<any>[];
    errorWhen: ValidationLoader<any>[];
}

export interface IFieldSchemaState<BindingsType> extends IAbstractSchemaState<BindingsType>, IFieldSchemaNonInitState {
    type: FieldType;
    value: any;
    focus?: boolean;
    forceDisabled?: boolean;
    forceHidden?: boolean;
}

export interface IFieldSchemaInitState<BindingsType>
    extends RemoveKeys<IFieldSchemaState<BindingsType>, keyof IFieldSchemaNonInitState>, IAbstractSchemaInitState<BindingsType> {
    disabledWhen?: IVisibilityDefinition<any>[];
    hiddenWhen?: IVisibilityDefinition<any>[];
    errorWhen?: IValidationDefinition<any>[];
}
