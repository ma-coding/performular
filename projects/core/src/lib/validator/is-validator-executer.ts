import { ValidatorExecuter } from './types/validator-executer';

export function isValidatorExecuter(value: any): value is ValidatorExecuter {
    return value && 'executeValidator' in value;
}
