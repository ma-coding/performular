import { ObjectType } from '../../utils/types/object-type';
import { ValidationOptions } from '../../validation/types/validation-options';
import { VisibilityOptions } from '../../visiblity/types/visibility-options';

export interface EffectsOptions {
    visibilities?: ObjectType<VisibilityOptions>;
    validations?: ObjectType<ValidationOptions>;
    forcedDisable?: boolean;
    forcedHidden?: boolean;
    forcedError?: string;
}
