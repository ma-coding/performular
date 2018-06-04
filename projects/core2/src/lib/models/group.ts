import { Observable } from 'rxjs';

import { use } from '../mixin';
import { FormTypes, Property } from '../performular';
import { State } from '../state';
import { Abstract } from './abstract';
import { Field, IField, IFieldParams } from './field';
import { ILayout, Layout } from './layout';

export interface IGroup<F extends string = any, A = any, S extends string = any, P extends FormTypes = any>
    extends IField<'group', F, A, S> {
    children: Property<P>[];
    layout?: ILayout;
}

export interface IGroupParams<F extends string = any, A = any, S extends string = any> extends IFieldParams<'group', F, A, S> {
    children: Abstract[];
    layout?: ILayout;
}

export interface IGroupState {
    children: Abstract[];
}

// tslint:disable-next-line:no-empty-interface
export interface Group<F extends string = any, A = any, S extends string = any, P = any> extends Field<'group', F, A, S>, Layout { }

// @dynamic
export class Group<F extends string = any, A = any, S extends string = any, P = any> extends Field<'group', F, A, S> {

    private _group$: State<IGroupState>;
    @use(Layout) public this: Group<F, A, S, P> | undefined;

    get children$(): Observable<Abstract[]> {
        return this._group$.select('children');
    }

    constructor(group: IGroupParams<F, A, S>) {
        super(group);
        this._initLayout(group.layout);
        this._setParents(group.children);
        this._group$ = new State<IGroupState>({
            children: group.children
        });
        this._initValue(this._buildValue());
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.setValue(value[child.id], index === arr.length - 1);
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.patchValue(value[child.id], index === arr.length - 1);
        });
    }

    public resetValue(emitUpdate: boolean = false): void {
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.resetValue(index === arr.length - 1);
        });
    }

    protected _buildValue(): any {
        const childFields: Field[] = this.getChildFields();
        return childFields.reduce((prev: any, child: Field) => {
            prev[child.id] = child.value;
            return prev;
        }, {});
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
        this._group$.getValue().children.forEach(cb);
    }
}
