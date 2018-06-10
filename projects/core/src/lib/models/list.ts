import { Observable } from 'rxjs';

import { use } from '../mixin';
import { FormTypes, Performular, Property } from '../performular';
import { State } from '../state';
import { Abstract, IAbstract, TList } from './abstract';
import { Field, IField, IFieldParams } from './field';
import { ILayout, Layout } from './layout';
import { ValueMode } from './value';

export interface IList<F extends string = any, A = any, S extends string = any, P extends FormTypes = any> extends IField<TList, F, A, S> {
    childDef: Property<P>;
    layout?: ILayout;
}

export interface IListParams<F extends string = any, A = any, S extends string = any, P = any> extends IFieldParams<TList, F, A, S> {
    childDef: IAbstract;
    children: Abstract[];
    layout?: ILayout;
}

export interface IListState {
    childDef: IAbstract;
    children: Abstract[];
    layout?: ILayout;
}

// tslint:disable-next-line:no-empty-interface
export interface List<F extends string = any, A = any, S extends string = any, P = any> extends Field<TList, F, A, S>, Layout { }

// @dynamic
export class List<F extends string = any, A = any, S extends string = any, P = any> extends Field<TList, F, A, S> {

    private _list$: State<IListState>;
    @use(Layout) public this: List<F, A, S, P> | undefined;

    get children$(): Observable<Abstract[]> {
        return this._list$.select('children');
    }

    constructor(list: IListParams<F, A, S>) {
        super(list);
        this._initLayout(list.layout);
        this._setParents(list.children);
        this._list$ = new State<IListState>({
            childDef: list.childDef,
            children: list.children
        });
        this._initValue(this._buildValue());
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        this.getChildFields()
            .filter((child: Field, index: number, arr: Field[]) => index <= value.length - 1)
            .forEach((child: Field, index: number, arr: Field[]) => {
                child.setValue(value[index], index === arr.length - 1);
            });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this.getChildFields()
            .filter((child: Field, index: number, arr: Field[]) => index <= value.length - 1)
            .forEach((child: Field, index: number, arr: Field[]) => {
                child.patchValue(value[index], index === arr.length - 1);
            });
    }

    public pushField(emitUpdate: boolean = true): void {
        this._updateChildren([
            ...this._list$.getValue().children,
            new Performular({
                form: this._list$.getValue().childDef
            }).form
        ], emitUpdate);
    }

    public popField(emitUpdate: boolean = true): void {
        const children: Abstract[] = this.getChildren();
        children.pop();
        this._updateChildren(children, emitUpdate);
    }

    public removeFieldAtIndex(index: number): void {
        const children: Abstract[] = this.getChildren();
        children.splice(index, 1);
        this._updateChildren(children, true);
    }

    public resetValue(emitUpdate: boolean = false): void {
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.resetValue(index === arr.length - 1);
        });
    }

    public getIndex(field: Abstract): number {
        const aResult: number = this.getChildren().indexOf(field);
        if (aResult >= 0) {
            return aResult;
        }
        const fResult: number = this.getChildFields().indexOf(<Field>field);
        return fResult || -1;
    }

    protected _buildValue(): any {
        const childFields: Field[] = this.getChildFields();
        return childFields.map((child: Field) => {
            return child.value;
        });
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
        this._list$.getValue().children.forEach(cb);
    }

    private _updateChildren(children: Abstract[], emitUpdate: boolean): void {
        this._list$.updateKey('children', [
            ...children
        ]);
        if (emitUpdate) {
            this._emitChildrenUpdate();
        }
    }

    private _emitChildrenUpdate(): void {
        this._resetChildParents();
        this._createValue(ValueMode.SET, this._buildValue());
        this._updateParentValue([this], ValueMode.SET);
    }

    private _resetChildParents(children: Abstract[] = this.getChildren()): void {
        children.forEach((child: Abstract) => {
            child.setParent(this);
            child.setForm(this.form);
        });
    }
}
