import { IValidatorDefinition } from './validator-definition.interface';

export interface IValidationDefinition {
    validators?: IValidatorDefinition[];
    forcedError?: string;
}
