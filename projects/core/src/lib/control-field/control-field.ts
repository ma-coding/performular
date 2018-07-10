import { AbstractField } from '../abstract-field/abstract-field';
import { ValueMode } from '../value/types/value-mode';
import { Value } from '../value/value';
import { ControlFieldOptions } from './types/control-field-options';
import { ControlFieldState } from './types/control-field-state';

export class ControlField extends AbstractField<ControlFieldState> {

    protected _valueState: Value;

    constructor(options: ControlFieldOptions) {
        super(options);
        this._valueState = new Value({
            initialValue: this.select('transformer').executeTo(options.value || options.defaultValue || null)
        });
    }

    public forEachChildren(cb: (child: AbstractField<any>) => void): void { }

    public setValue(value: any): void {
        this._valueState.updateValue(ValueMode.SET, value);
    }

    public patchValue(value: any): void {
        this._valueState.updateValue(ValueMode.PATCH, value);
    }

    public resetValue(): void {
        this._valueState.updateValue(ValueMode.RESET, undefined);
    }

    protected _buildValue(children?: AbstractField<any>[] | undefined): any {
        return null;
    }

}
