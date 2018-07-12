import { ObjectType } from '../../utils/types/object-type';
import { Validation } from '../../validation/validation';
import { Visibility } from '../../visibility/visibility';

export interface EffectsState {
    visibilities: ObjectType<Visibility>;
    disabled: boolean;
    forcedDisabled: boolean;
    hidden: boolean;
    forcedHidden: boolean;

    validations: ObjectType<Validation>;
    invalid: boolean;
    forcedError: string | undefined;
    errorState: boolean;
    errors: string[];
}
