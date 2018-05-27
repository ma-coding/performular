import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';

import { State } from '../state';

export interface IValue {
    value: any;
    initValue: any;
    changed: boolean;
    dirty: boolean;
}

export class Value {
    private _valueState$: State<IValue> = <any>undefined;

    public value$(): Observable<any> {
        return this._valueState$.select('value');
    }

    public value(): any {
        return this._valueState$.getValue().value;
    }

    protected _initValue(value: any | undefined): void {
        this._valueState$ = new State<IValue>({
            value: value,
            initValue: cloneDeep(value),
            changed: false,
            dirty: false
        } || <IValue>{});
    }
}
