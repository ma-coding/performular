import { Abstract } from './abstract';
import { Field, IField, IFieldParams } from './field';
import { ValueMode } from './value';

export interface IControl<F extends string = any, A = any, S extends string = any> extends IField<'control', F, A, S> {
    focus?: boolean;
}

export interface IControlParams<F extends string = any, A = any, S extends string = any> extends IFieldParams<'control', F, A, S> {
    focus: boolean;
    value: any;
}

// @dynamic
export class Control<F extends string = any, A = any, S extends string = any> extends Field<'control', F, A, S> {

    constructor(control: IControlParams<F, A, S>) {
        super(control);
        this._initValue(control.value);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        this._createValue(ValueMode.SET, value);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.SET);
        }
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        this._createValue(ValueMode.PATCH, value);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.PATCH);
        }
    }

    public resetValue(emitUpdate: boolean = true): void {
        this._createValue(ValueMode.RESET);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.RESET);
        }
    }

    protected _forEachChild(cb: (child: Abstract) => void): void { }

    protected _buildValue(): any {
        throw new Error('The Control value should never be build!');
    }
}
