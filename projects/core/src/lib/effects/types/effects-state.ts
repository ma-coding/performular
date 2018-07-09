import { ObjectType } from '../../utils/types/object-type';
import { Validation } from '../../validation/validation';
import { Visibility } from '../../visiblity/visibility';

export interface EffectsState {
    visibilities: ObjectType<Visibility>;
    validations: ObjectType<Validation>;
    forcedDisable: boolean;
    forcedHidden: boolean;
    forcedError: string | undefined;
    disabled: boolean;
    hidden: boolean;
    invalid: boolean;
    errors: string[];
}
