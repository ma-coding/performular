import { ValidatorHandler } from '../validator-handler';
import { IValidatorInternalResult } from './validator-internal-result.interface';

export interface IValidationState {
    invalid: boolean;
    validators: ValidatorHandler[];
    validatorResults: { [name: string]: IValidatorInternalResult | undefined };
    errors: string[];
    forcedError: string | undefined;
}
