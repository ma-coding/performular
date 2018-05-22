import { IValidationSchema } from '../models/validation';
import { FieldSchema } from './field';

export class ValidationSchema<T = any, F = any, A = any, S extends string = any> {

    constructor(field: FieldSchema<T, F, A, S>, validation: IValidationSchema | undefined) {
    }
}
