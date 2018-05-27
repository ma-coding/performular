import { builder } from '../builder';
import { use } from '../mixin';
import { State } from '../state';
import { Abstract } from './abstract';
import { Field, IField } from './field';
import { Layout } from './layout';
import { IOptions } from './options';

export interface IList<A, S extends string, P> extends IField<'list', A, S> {
    childStructure: P;
}

export interface IListState {
    children: Abstract[];
}

// tslint:disable-next-line:no-empty-interface
export interface List<A = any, S extends string = any, P = any> extends Layout { }

// @dynamic
export class List<A = any, S extends string = any, P = any> extends Field<A, S> {

    private _list$: State<IListState>;
    @use(Layout) public this: List<A, S, P> | undefined;

    constructor(list: IList<A, S, any>, options?: IOptions, value?: any) {
        super(list, options);
        this._list$ = new State<IListState>({
            children: (value || []).map((val: any) => {
                const child: Abstract = builder(list.childStructure, options, val);
                child.setParent(this);
                return child;
            })
        });
        this._initValue(this._buildValue());
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
