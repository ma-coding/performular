import { Observable } from 'rxjs';
import { AbstractModel } from '../../../model/abstract-model';

export interface Action {
    action(field: AbstractModel, params: any): Observable<void>;
}
