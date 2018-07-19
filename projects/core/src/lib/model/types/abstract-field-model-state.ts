import { Validation } from '../../handler/validation/validation';
import { Visibility } from '../../handler/visibility/visibility';
import { ObjectType } from '../../util/types/object-type';
import { AbstractModelState } from './abstract-model-state';

export interface AbstractFieldModelState extends AbstractModelState {
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

    initialValue: any;
    value: any;
    changed: boolean;
    dirty: boolean;
}
