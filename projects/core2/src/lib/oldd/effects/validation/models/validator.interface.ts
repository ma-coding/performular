import { Observable } from 'rxjs';

import { FieldSchema } from '../../../schemas/field.schema';
import { IValidatorResult } from './validator-result.interface';

export interface IValidator {
    onValidate(field: FieldSchema, params: any): Observable<IValidatorResult>;
    onInstanceRendered?(field: FieldSchema, params: any): void;
}
