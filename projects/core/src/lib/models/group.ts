import { use } from '../utils/mixin';
import { State } from '../utils/state';
import { Abstract, TGroup } from './abstract';
import { AbstractField, IAbstractField, IAbstractFieldParams, IAbstractFieldProperty } from './abstract-field';
import { ILayoutProperty, Layout } from './layout/layout';

export interface IGroupParams<
    F extends string = any,
    A = any,
    S extends string = any,
    > extends IAbstractFieldParams<TGroup, F, A, S>, ILayoutProperty {
    children: any[];
}

export interface IGroupProperty<
    F extends string = any,
    A = any,
    S extends string = any
    > extends IAbstractFieldProperty<TGroup, F, A, S>, ILayoutProperty {
    children: Abstract[];
}

export interface IGroup<
    A = any,
    S extends string = any
    > extends IAbstractField<TGroup, A, S>, ILayoutProperty {
}

export interface Group<
    A = any,
    S extends string = any,
    > extends AbstractField<TGroup, A, S, IGroup<A, S>>, Layout<IGroup<A, S>> { }

export class Group<
    A = any,
    S extends string = any,
    > extends AbstractField<TGroup, A, S, IGroup<A, S>> {

    protected _state$: State<IGroup<A, S>>;

    @use(Layout) public this: Group | undefined;

    constructor(property: IGroupProperty<string, A, S>) {
        super(property);
        this._init = {
            ...this._init,
            ...this._initLayout(property),
            children: property.children,
            ...this._initValue({ value: this._buildValue(this._getRecursiveChildFields(property.children)) })
        };
        this._state$ = new State<IGroup<A, S>>(<any>this._init);
        this._setParentOfChildren();
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        this.childFields
            .filter((child: AbstractField) => child.id in value)
            .forEach((child: AbstractField, index: number, arr: AbstractField[]) => {
                child.setValue(value[child.id], index === arr.length - 1);
            });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this.childFields
            .filter((child: AbstractField) => child.id in value)
            .forEach((child: AbstractField, index: number, arr: AbstractField[]) => {
                child.patchValue(value[child.id], index === arr.length - 1);
            });
    }

    public resetValue(emitUpdate: boolean = false): void {
        this.childFields.forEach((child: AbstractField, index: number, arr: AbstractField[]) => {
            child.resetValue(index === arr.length - 1);
        });
    }

    protected _buildValue(children: AbstractField[] | undefined = this.childFields): any {
        return children.reduce((prev: any, child: AbstractField) => {
            prev[child.id] = child.value;
            return prev;
        }, {});
    }
}
