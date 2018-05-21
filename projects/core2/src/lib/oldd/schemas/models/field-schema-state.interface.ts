import { IValidationState } from '../../effects/validation/models/validation-state.interface';
import { IVisibilityState } from '../../effects/visibility/models/visibility-state.interface';
import { IAbstractSchemaState } from './abstract-schema-state.interface';

export interface IFieldSchemaState<B> extends IAbstractSchemaState<B>, IValidationState, IVisibilityState {
    id: string;
    value: any;
    initValue: any;
    changed: boolean;
    dirty: boolean;
}
