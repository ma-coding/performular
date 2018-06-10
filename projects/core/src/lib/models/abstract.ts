import { use } from '../mixin';
import { State } from '../state';
import { IItem, IItemParams, IItemProperty, Item } from './layout/item';

export type TControl = 'control';
export type TGroup = 'group';
export type TList = 'list';
export type TContainer = 'container';

export type FieldType = TControl | TGroup | TList | TContainer;

export interface IAbstractProperty<T extends FieldType> extends IItemProperty {
    type: T;
}

export interface IAbstractParams<T extends FieldType> extends IItemParams {
    type: T;
}

export interface IAbstract<T extends FieldType> extends IItem {
    type: T;
}

export interface Abstract<T extends FieldType, S extends IAbstract<T>> extends Item<S> { }

export abstract class Abstract<T extends FieldType, S extends IAbstract<T>> {

    protected abstract _state$: State<S>;
    protected _init: IAbstract<T>;

    @use(Item) public this: Abstract<T, S> | undefined;

    constructor(abs: IAbstract<T>) {
        this._init = abs;
    }

}
