import { IValidator } from './validator.interface';

export interface ValidatorType {
    new(...args: any[]): IValidator;
}
