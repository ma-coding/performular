import { ValidationOptions } from '../../handler/validation/types/validation-options';
import { VisibilityOptions } from '../../handler/visibility/types/visibility-options';
import { ObjectType } from '../../util/types/object-type';
import { AbstractModelOptions } from './abstract-model-options';

export interface AbstractFieldModelOptions extends AbstractModelOptions {
    forcedDisabled?: boolean;
    forcedHidden?: boolean;
    forcedError?: string;
    validations?: ObjectType<ValidationOptions>;
    visibilities?: ObjectType<VisibilityOptions>;
}
