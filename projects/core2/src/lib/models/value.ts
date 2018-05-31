import { cloneDeep, isEqual } from 'lodash';
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

    get initValue(): any {
        return this._valueState$.getValue().initValue;
    }

    get value$(): Observable<any> {
        return this._valueState$.select('value');
    }

    get value(): any {
        return this._valueState$.getValue().value;
    }

    protected _setValue(value: any): void {
        this._valueState$.update({
            value: value,
            changed: isEqual(value, this._valueState$.getValue().initValue),
            dirty: true
        });
    }

    protected _resetValue(): void {
        this._valueState$.update({
            value: cloneDeep(this._valueState$.getValue().initValue),
            changed: false,
            dirty: false
        });
    }

    protected _patchValue(value: any): void {
        this._valueState$.update({
            value: value,
            initValue: cloneDeep(value),
            changed: false,
            dirty: false
        });
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
