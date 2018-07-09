import { ValidatorExecuter } from './types/validator-executer';

export function isValidatorExecuter(value: any): value is ValidatorExecuter {
    return value && 'execute' in value;
}
