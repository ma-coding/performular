import { use } from '../mixin';
import { State } from '../state';
import { Abstract, IAbstract } from './abstract';
import { Field, IField, IFieldParams } from './field';
import { ILayout, Layout } from './layout';

export interface IList<F extends string = any, A = any, S extends string = any, P = any> extends IField<'list', F, A, S> {
    childDef: P;
}

export interface IListParams<F extends string = any, A = any, S extends string = any, P = any> extends IFieldParams<'list', F, A, S> {
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
export interface List<F extends string = any, A = any, S extends string = any, P = any> extends Field<'list', F, A, S>, Layout { }

// @dynamic
export class List<F extends string = any, A = any, S extends string = any, P = any> extends Field<'list', F, A, S> {

    private _list$: State<IListState>;
    @use(Layout) public this: List<F, A, S, P> | undefined;

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
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.setValue(value[index], index === arr.length - 1);
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.patchValue(value[index], index === arr.length - 1);
        });
    }

    public resetValue(emitUpdate: boolean = false): void {
        this.getChildFields().forEach((child: Field, index: number, arr: Field[]) => {
            child.resetValue(index === arr.length - 1);
        });
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
}
