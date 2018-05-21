import { Observable } from 'rxjs';

import { FieldSchema } from '../../../schemas/field.schema';

export interface IVisible {
    onCalculate(field: FieldSchema, params: any): Observable<boolean>;
}
