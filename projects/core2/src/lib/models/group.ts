import { MapType } from '../misc';
import { use } from '../mixin';
import { Abstract } from './abstract';
import { Field, IField } from './field';
import { Layout } from './layout';

export interface IGroup<A, S extends string, P> extends IField<'group', A, S> {
    children: MapType<P>;
}

// tslint:disable-next-line:no-empty-interface
export interface Group<A, S extends string, P> extends Layout { }

// @dynamic
export class Group<A, S extends string, P> extends Field<A, S> {

    @use(Layout) public this: Group<A, S, P> | undefined;

    constructor(group: IGroup<A, S, P>) {
        super(group);
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
    }
}
