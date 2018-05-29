import { Abstract } from './abstract';
import { Field, IField, IFieldParams } from './field';

export interface IControl<F extends string = any, A = any, S extends string = any> extends IField<'control', F, A, S> {
    focus?: boolean;
}

export interface IControlParams<F extends string = any, A = any, S extends string = any> extends IFieldParams<'control', F, A, S> {
    focus?: boolean;
    value: any;
}

// @dynamic
export class Control<F extends string = any, A = any, S extends string = any> extends Field<'control', F, A, S> {

    constructor(control: IControlParams<F, A, S>) {
        super(control);
        this._initValue(control.value);
    }

    protected _forEachChild(cb: (child: Abstract) => void): void { }

    protected _buildValue(): any {
        throw new Error('The Control value should never be build!');
    }
}
