import { use } from '../mixin';
import { State } from '../state';
import { Framework, IFramework, IFrameworkProperty } from './framework/framework';
import { IItem, IItemProperty, Item } from './layout/item';

export type TControl = 'control';
export type TGroup = 'group';
export type TList = 'list';
export type TContainer = 'container';

export type FieldType = TControl | TGroup | TList | TContainer;

export interface IAbstractProperty<
    T extends FieldType = FieldType,
    F extends string = any,
    A = any,
    S extends string = 'host'
    > extends IItemProperty, IFrameworkProperty<F, A, S> {
    type: T;
}

export interface IAbstract<
    T extends FieldType = FieldType,
    A = any,
    S extends string = never
    > extends IItem, IFramework<A, S> {
    type: T;
}

export interface Abstract<
    T extends FieldType = FieldType,
    A = any,
    S extends string = never,
    ST extends IAbstract = any
    > extends Item<ST>, Framework<A, S, ST> { }

export abstract class Abstract<
    T extends FieldType = FieldType,
    A = any,
    S extends string = never,
    ST extends IAbstract = any
    > {

    protected abstract _state$: State<ST>;
    protected _init: IAbstract;

    @use(Item, Framework) public this: Abstract | undefined;

    constructor(abs: IAbstract<T, A, S>) {
        this._init = {
            ...abs,
            ...this._initFramework(abs),
            ...this._initItem(abs)
        };
    }

}
