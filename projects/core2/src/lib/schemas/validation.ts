import { Observable } from 'rxjs';

import { State } from '../misc';
import { Constructable } from '../models/misc';
import { IValidation, IValidationSchema } from '../models/validation';

export interface IValidationable {
    validation$: Observable<IValidation>;
    validation: IValidation;
}

export function Validationable<T = any>(base: Constructable): Constructable<T> {
    return class extends base implements IValidationable {
        private _validation$: State<IValidation>;

        get validation$(): Observable<IValidation> {
            return this._validation$.asObservable();
        }

        get validation(): IValidation {
            return this._validation$.getValue();
        }

        constructor(arg: IValidationSchema) {
            super(arg as any);
            this._validation$ = new State<IValidation>(arg.validation || <IValidation>{});
        }

    } as any;
}
