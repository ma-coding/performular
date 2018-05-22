import { IVisibilitySchema } from '../models/visibility';
import { FieldSchema } from './field';

export class VisibilitySchema<T = any, F = any, A = any, S extends string = any> {

    constructor(field: FieldSchema<T, F, A, S>, validation: IVisibilitySchema | undefined) {
    }
}
