import { IPerformularTypes } from '../utils/misc';
import { State } from '../utils/state';
import { TControl } from './abstract';
import { AbstractField, IAbstractField, IAbstractFieldProperty } from './abstract-field';

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
}
