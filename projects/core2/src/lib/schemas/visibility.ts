import { Observable } from 'rxjs';

import { State } from '../misc';
import { Constructable } from '../models/misc';
import { IVisibility, IVisibilitySchema } from '../models/visibility';

export interface IVisibilityable {
    visibility$: Observable<IVisibility>;
    visibility: IVisibility;
}

export function Visibilityable<T = any>(base: Constructable): Constructable<T> {
    return class extends base implements IVisibilityable {
        private _visibility$: State<IVisibility>;

        get visibility$(): Observable<IVisibility> {
            return this._visibility$.asObservable();
        }

        get visibility(): IVisibility {
            return this._visibility$.getValue();
        }

        constructor(arg: IVisibilitySchema) {
            super(arg as any);
            this._visibility$ = new State<IVisibility>(arg.visibility || <IVisibility>{});
        }

    } as any;
}
