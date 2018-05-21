import { IValidatorResult } from './validator-result.interface';

export interface IValidatorInternalResult extends IValidatorResult {
    name: string;
    errorMsg: string;
}
