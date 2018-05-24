import { Abstract } from './abstract';
import { Field, IField } from './field';

export interface IControl<A, S extends string> extends IField<'control', A, S> {
    focus?: boolean;
}

// @dynamic
export class Control<A, S extends string> extends Field<A, S> {

    constructor(control: IControl<A, S>) {
        super(control);
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
    }
}
