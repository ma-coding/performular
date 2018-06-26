import { Observable } from 'rxjs';

import { Performular } from '../form/form';
import { use } from '../utils/mixin';
import { State } from '../utils/state';
import { Abstract, IAbstractParams, TList } from './abstract';
import { AbstractField, IAbstractField, IAbstractFieldParams, IAbstractFieldProperty } from './abstract-field';
import { ILayoutProperty, Layout } from './layout/layout';
import { ValueMode } from './value/value';

export interface IListParams<
    F extends string = any,
    A = any,
    S extends string = any
    > extends IAbstractFieldParams<TList, F, A, S>, ILayoutProperty {
    childDef: any;
}

export interface IListProperty<
    F extends string = any,
    A = any,
    S extends string = any
    > extends IAbstractFieldProperty<TList, F, A, S>, ILayoutProperty {
    childDef: IAbstractParams;
    children: Abstract[];
}

export interface IList<
    A = any,
    S extends string = any
    > extends IAbstractField<TList, A, S>, ILayoutProperty {
    childDef: IAbstractParams;
}

export function selectChildDef(state: IList): IAbstractParams {
    return state.childDef;
}

export interface List<
    A = any,
    S extends string = any,
    > extends AbstractField<TList, A, S, IList<A, S>>, Layout<IList<A, S>> {
}

export class List<
    A = any,
    S extends string = any,
    > extends AbstractField<TList, A, S, IList<A, S>> {

    get childDef(): IAbstractParams {
        return this._state$.get(selectChildDef);
    }

    get childDef$(): Observable<IAbstractParams> {
        return this._state$.get$(selectChildDef);
    }

    protected _state$: State<IList<A, S>>;

    @use(Layout) public this: List | undefined;

    constructor(property: IListProperty<string, A, S>) {
        super(property);
        this._init = {
            ...this._init,
            ...this._initLayout(property),
            childDef: property.childDef,
            children: property.children,
            value: this._buildValue(this._getRecursiveChildFields(property.children))
        };
        this._state$ = new State<IList<A, S>>(<any>this._init);
        this._setParentOfChildren();
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        this.childFields
            .filter((child: AbstractField) => child.id in value)
            .forEach((child: AbstractField, index: number, arr: AbstractField[]) => {
                child.setValue(value[index], index === arr.length - 1);
            });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this.childFields
            .filter((child: AbstractField) => child.id in value)
            .forEach((child: AbstractField, index: number, arr: AbstractField[]) => {
                child.patchValue(value[index], index === arr.length - 1);
            });
    }

    public resetValue(emitUpdate: boolean = false): void {
        this.childFields.forEach((child: AbstractField, index: number, arr: AbstractField[]) => {
            child.resetValue(index === arr.length - 1);
        });
    }

    public pushField(emitUpdate: boolean = true): void {
        this._updateChildren([
            ...this.children,
            Performular.build({ form: this.childDef })
        ], emitUpdate);
    }

    public popField(emitUpdate: boolean = true): void {
        const children: Abstract[] = this.children;
        children.pop();
        this._updateChildren(children, emitUpdate);
    }

    public removeFieldAtIndex(index: number): void {
        const children: Abstract[] = this.children;
        children.splice(index, 1);
        this._updateChildren(children, true);
    }

    public getIndex(field: Abstract): number {
        const aResult: number = this.children.indexOf(field);
        if (aResult >= 0) {
            return aResult;
        }
        const fResult: number = this.children.indexOf(<AbstractField>field);
        return fResult || -1;
    }

    protected _buildValue(children: AbstractField[] | undefined = this.childFields): any {
        return children.map((child: AbstractField) => {
            return child.value;
        });
    }

    private _updateChildren(children: Abstract[], emitUpdate: boolean): void {
        this._state$.updateKey('children', [
            ...children
        ]);
        if (emitUpdate) {
            this._emitChildrenUpdate();
        }
    }

    private _emitChildrenUpdate(): void {
        this._setParentOfChildren();
        this._createValue(ValueMode.SET, this._buildValue());
        this._updateParentValue([this], ValueMode.SET);
    }
}
