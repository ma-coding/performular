import { ObjectType } from '../../utils/types/object-type';
import { ValidationOptions } from '../../validation/types/validation-options';
import { VisibilityOptions } from '../../visibility/types/visibility-options';

export interface EffectsOptions {
    visibilities?: ObjectType<VisibilityOptions>;
    validations?: ObjectType<ValidationOptions>;
    forcedDisabled?: boolean;
    forcedHidden?: boolean;
    forcedError?: string;
}
