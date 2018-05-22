import { Observable } from 'rxjs';

import { State } from '../misc';
import { IControlSchema } from '../models/schema';
import { IControlState } from '../models/state';
import { AbstractSchema } from './abstract';
import { FieldSchema } from './field';

export class ControlSchema<F, A, S extends string> extends FieldSchema<'control', F, A, S> {
    private _control$: State<IControlState>;

    get control$(): Observable<IControlState> {
        return this._control$.asObservable();
    }

    get control(): IControlState {
        return this._control$.getValue();
    }

    constructor(control: IControlSchema<F, A, S>) {
        super(control);
        this._control$ = new State({
            focus: !!control.focus
        });
    }

    public updateFocus(focus: boolean): void {
        this._control$.updateKey('focus', focus);
    }

    protected _forEachChild(cb: (child: AbstractSchema) => void): void { }
}
