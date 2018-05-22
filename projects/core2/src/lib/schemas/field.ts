import { IFieldSchema } from '../models/schema';
import { AbstractSchema } from './abstract';
import { ValidationSchema } from './validation';
import { VisibilitySchema } from './visibility';

export abstract class FieldSchema<T = any, F = any, A = any, S extends string = any> extends AbstractSchema<T, F, A, S> {
    public validation: ValidationSchema<T, F, A, S>;
    public visibility: VisibilitySchema<T, F, A, S>;

    constructor(field: IFieldSchema<T, F, A, S>) {
        super(field);
        this.validation = new ValidationSchema(this, field.validation);
        this.visibility = new VisibilitySchema(this, field.visibility);
    }
}
