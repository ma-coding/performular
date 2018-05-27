import { Abstract } from './abstract';
import { Field, IField } from './field';
import { IOptions } from './options';

export interface IControl<A, S extends string> extends IField<'control', A, S> {
    focus?: boolean;
}

// @dynamic
export class Control<A = any, S extends string = any> extends Field<A, S> {

    constructor(control: IControl<A, S>, options?: IOptions, value?: any) {
        super(control, options);
        this._initValue(value || null);
    }

    protected _forEachChild(cb: (child: Abstract) => void): void { }

    protected _buildValue(): any {
        throw new Error('The Control value should never be build!');
    }
}
