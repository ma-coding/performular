import { use } from '../mixin';
import { FormTypes, Property } from '../performular';
import { State } from '../state';
import { Abstract } from './abstract';
import { Field, IField, IFieldParams } from './field';
import { Layout } from './layout';

export interface IGroup<F extends string = any, A = any, S extends string = any, P extends FormTypes = any>
    extends IField<'group', F, A, S> {
    children: Property<P>[];
}

export interface IGroupParams<F extends string = any, A = any, S extends string = any> extends IFieldParams<'group', F, A, S> {
    children: Abstract[];
}

export interface IGroupState {
    children: Abstract[];
}

// tslint:disable-next-line:no-empty-interface
export interface Group<F extends string = any, A = any, S extends string = any, P = any> extends Field<'group', F, A, S> { }

// @dynamic
export class Group<F extends string = any, A = any, S extends string = any, P = any> extends Field<'group', F, A, S> {

    private _group$: State<IGroupState>;
    @use(Layout) public this: Group<F, A, S, P> | undefined;

    constructor(group: IGroupParams<F, A, S>) {
        super(group);
        this._group$ = new State<IGroupState>({
            children: group.children
        });
        this._initValue(this._buildValue());
    }

    protected _buildValue(): any {
        const childFields: Field[] = this.getChildFields();
        return childFields.reduce((prev: any, child: Field) => {
            prev[child.id] = child.value();
            return prev;
        }, {});
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
        this._group$.getValue().children.forEach(cb);
    }
}
