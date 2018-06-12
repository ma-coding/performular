import { IPerformularTypes, TEffects } from '../../../utils/misc';
import { State } from '../../../utils/state';
import { IAbstractField } from '../../abstract-field';
import { ValidatorHandler } from './validator';

export interface IValidationProperty<P extends IPerformularTypes = any> {
    validators?: TEffects<P>[];
    forcedError?: string;
}

export interface IValidation {
    validators: ValidatorHandler[];
    forcedError: string | undefined;
    errors: string[];
    invalid: boolean;
}

export abstract class Validation<ST extends IAbstractField = IAbstractField> {

    protected abstract _state$: State<ST>;
}
