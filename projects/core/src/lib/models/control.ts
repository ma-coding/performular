import { IPerformularTypes } from '../utils/misc';
import { State } from '../utils/state';
import { TControl } from './abstract';
import { AbstractField, IAbstractField, IAbstractFieldParams, IAbstractFieldProperty } from './abstract-field';
import { ValueMode } from './value/value';

export interface IControlProperty<
    F extends string = any,
    A = any,
    S extends string = any,
    P extends IPerformularTypes = any
    > extends IAbstractFieldParams<TControl, F, A, S, P> {
}

export interface IControlProperty<
    F extends string = any,
    A = any,
    S extends string = any,
    P extends IPerformularTypes = any
    > extends IAbstractFieldProperty<TControl, F, A, S, P> {
}

export interface IControl<
    A = any,
    S extends string = any
    > extends IAbstractField<TControl, A, S> {
}

export interface Control<
    A = any,
    S extends string = any,
    > extends AbstractField<TControl, A, S, IControl<A, S>> { }

export class Control<
    A = any,
    S extends string = any,
    > extends AbstractField<TControl, A, S, IControl<A, S>> {

    protected _state$: State<IControl<A, S>>;

    constructor(property: IControlProperty<string, A, S>) {
        super(property);
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
