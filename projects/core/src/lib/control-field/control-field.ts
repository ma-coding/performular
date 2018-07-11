import { Observable } from 'rxjs';

import { AbstractField } from '../abstract-field/abstract-field';
import { State } from '../utils/state';
import { ValueMode } from '../value/types/value-mode';
import { Value } from '../value/value';
import { ControlFieldOptions } from './types/control-field-options';
import { ControlFieldState } from './types/control-field-state';

export class ControlField extends AbstractField<ControlFieldState> {

    protected _fieldApi: State<ControlFieldState>;
    protected _valueApi: Value;

    constructor(options: ControlFieldOptions) {
        super(options);
        this._valueApi = new Value({
            initialValue: options.value || options.defaultValue || null,
            transformer: this._transformer
        });
        this._fieldApi = new State<ControlFieldState>({
            ...this._initAbstract(options),
            defaultValue: options.defaultValue,
            value: options.value || options.defaultValue || null
        });
    }

    public getUpdates$(): Observable<void> {
        return this.effectsApi.getUpdates$();
    }

    public setValue(value: any): void {
        this._valueApi.updateValue(ValueMode.SET, value);
    }

    public patchValue(value: any): void {
        this._valueApi.updateValue(ValueMode.PATCH, value);
    }

    public resetValue(): void {
        this._valueApi.updateValue(ValueMode.RESET, undefined);
    }

    protected _forEachChildren(cb: (child: AbstractField<any>) => void): void { }

    protected _buildValue(children?: AbstractField<any>[] | undefined): any {
        return null;
    }

}
