import { use } from '../mixin';
import { State } from '../state';
import { Abstract } from './abstract';
import { Field, IField } from './field';
import { Layout } from './layout';

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

    constructor(group: IGroup<A, S, any>) {
        super(group);
        this._group$ = new State<IGroupState>({
            children: group.children
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
