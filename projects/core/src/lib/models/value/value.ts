import { Observable } from 'rxjs';

import { cloneDeep, isEqual } from '../../utils/misc';
import { State } from '../../utils/state';
import { AbstractField, IAbstractField } from '../abstract-field';

export enum ValueMode {
    SET,
    RESET,
    PATCH
}

export interface IValueProperty {
    value: any;
}

export interface IValue {
    value: any;
    initValue: any;
    changed: boolean;
    dirty: boolean;
}

export function selectValue(state: IAbstractField): any {
    return state.value;
}

export function selectInitValue(state: IAbstractField): any {
    return state.initValue;
}

export function selectChanged(state: IAbstractField): boolean {
    return state.changed;
}

export function selectDirty(state: IAbstractField): boolean {
    return state.dirty;
}

export class Value<ST extends IAbstractField = IAbstractField> {

    get initValue(): any {
        return this._valueState$.get(selectInitValue);
    }

    get initValue$(): Observable<any> {
        return this._valueState$.get$(selectInitValue);
    }

    get value$(): Observable<any> {
        return this._valueState$.get$(selectValue);
    }

    get value(): any {
        return this._valueState$.get(selectValue);
    }

    get changed$(): Observable<boolean> {
        return this._valueState$.get$(selectChanged);
    }

    get changed(): boolean {
        return this._valueState$.get(selectChanged);
    }

    get dirty$(): Observable<boolean> {
        return this._valueState$.get$(selectDirty);
    }

    get dirty(): boolean {
        return this._valueState$.get(selectDirty);
    }

    protected get _valueState$(): State<ST> {
        return (<any>this._valueField)._state$;
    }

    protected get _valueField(): AbstractField {
        return <AbstractField>(this as any);
    }

    protected _createValue(mode: ValueMode, value?: any): void {
        switch (mode) {
            case ValueMode.SET:
                return this._setValue(value);
            case ValueMode.RESET:
                return this._resetValue();
            case ValueMode.PATCH:
                return this._patchValue(value);
        }
    }

    protected _initValue(property: IValueProperty): IValue {
        return {
            value: property.value,
            initValue: cloneDeep(property.value),
            changed: false,
            dirty: false
        };
    }

    private _setValue(value: any): void {
        this._valueState$.updateKey('value', value);
        this._valueState$.updateKey('changed', !isEqual(value, this.initValue));
        this._valueState$.updateKey('dirty', true);
    }

    private _resetValue(): void {
        this._valueState$.updateKey('value', cloneDeep(this.initValue));
        this._valueState$.updateKey('changed', false);
        this._valueState$.updateKey('dirty', false);
    }

    private _patchValue(value: any): void {
        this._valueState$.updateKey('value', value);
        this._valueState$.updateKey('initValue', cloneDeep(value));
        this._valueState$.updateKey('changed', false);
        this._valueState$.updateKey('dirty', false);
    }
}
