import { IValidationDefinition } from '../../effects/validation/models/validation-definition.interface';
import { IVisibilityDefintion } from '../../effects/visibility/models/visibility-definition.interface';
import { IAbstractProperty } from './abstract-property.interface';

export interface IFieldProperty<T extends string, F extends string, B extends object> extends IAbstractProperty<T, F, B> {
    id: string;
    validation?: IValidationDefinition;
    visibility?: IVisibilityDefintion;
}
