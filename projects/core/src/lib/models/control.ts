import { Observable } from 'rxjs';

import { EffectTypes } from '../utils/misc';
import { State } from '../utils/state';
import { TControl } from './abstract';
import { AbstractField, IAbstractField, IAbstractFieldParams, IAbstractFieldProperty } from './abstract-field';
import { ValueMode } from './value/value';

export interface IControlParams<
    F extends string = any,
    A = any,
    S extends string = any,
    E extends EffectTypes = any
    > extends IAbstractFieldParams<TControl, F, A, S> {
    focus?: boolean;
}

export interface IControlProperty<
    F extends string = any,
    A = any,
    S extends string = any,
    > extends IAbstractFieldProperty<TControl, F, A, S> {
    focus: boolean;
}

export interface IControl<
    A = any,
    S extends string = any
    > extends IAbstractField<TControl, A, S> {
    focus: boolean;
}

export function selectFocus(state: IControl): boolean {
    return state.focus;
}

export interface Control<
    A = any,
    S extends string = any,
    > extends AbstractField<TControl, A, S, IControl<A, S>> { }

export class Control<
    A = any,
    S extends string = any,
    > extends AbstractField<TControl, A, S, IControl<A, S>> {

    get focus(): boolean {
        return this._state$.get(selectFocus);
    }

    get focus$(): Observable<boolean> {
        return this._state$.get$(selectFocus);
    }

    protected _state$: State<IControl<A, S>>;

    constructor(property: IControlProperty<string, A, S>) {
        super(property);
        this._init = {
            ...this._init,
            ...this._initValue(property),
            focus: property.focus
        };
        this._state$ = new State<IControl<A, S>>(<any>this._init);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        this._createValue(ValueMode.SET, value);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.SET);
        }
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        this._createValue(ValueMode.PATCH, value);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.PATCH);
        }
    }

    public resetValue(emitUpdate: boolean = true): void {
        this._createValue(ValueMode.RESET);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.RESET);
        }
    }

    protected _buildValue(children: AbstractField[] | undefined = this.childFields): void {
        throw new Error('The Control value should never be build!');
    }
}
