import { use } from '../mixin';
import { Abstract } from './abstract';
import { Field, IField } from './field';
import { Layout } from './layout';

export interface IList<A, S extends string, P> extends IField<'list', A, S> {
    childStructure: P;
}

// tslint:disable-next-line:no-empty-interface
export interface List<A, S extends string, P> extends Layout { }

// @dynamic
export class List<A, S extends string, P> extends Field<A, S> {

    @use(Layout) public this: List<A, S, P> | undefined;

    constructor(list: IList<A, S, P>) {
        super(list);
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
    }
}
