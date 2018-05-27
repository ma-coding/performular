import { builder } from '../builder';
import { use } from '../mixin';
import { State } from '../state';
import { Abstract, IAbstract } from './abstract';
import { Field, IField } from './field';
import { Layout } from './layout';
import { IOptions } from './options';

export interface IGroup<A, S extends string, P> extends IField<'group', A, S> {
    children: P[];
}

export interface IGroupState {
    children: Abstract[];
}

// tslint:disable-next-line:no-empty-interface
export interface Group<A = any, S extends string = any, P = any> extends Layout { }

// @dynamic
export class Group<A = any, S extends string = any, P = any> extends Field<A, S> {

    private _group$: State<IGroupState>;
    @use(Layout) public this: Group<A, S, P> | undefined;

    constructor(group: IGroup<A, S, any>, options?: IOptions, value?: any) {
        super(group, options);
        this._group$ = new State<IGroupState>({
            children: group.children.map((def: IAbstract<any, any, any>) => {
                const child: Abstract = builder(def, options, value);
                child.setParent(this);
                return child;
            })
        });
        this._initValue(this._buildValue());
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
