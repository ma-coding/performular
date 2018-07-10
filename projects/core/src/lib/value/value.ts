import { isEqual } from '../../old/utils/misc';
import { cloneDeep } from '../utils/clone-deep';
import { State } from '../utils/state';
import { ValueMode } from './types/value-mode';
import { ValueOptions } from './types/value-options';
import { ValueState } from './types/value-state';

export class Value extends State<ValueState> {

    constructor(options: ValueOptions) {
        super({
            initialValue: options.initialValue,
            value: cloneDeep(options.initialValue),
            changed: false,
            dirty: false
        });
    }

    public updateValue(mode: ValueMode, value: any): void {
        switch (mode) {
            case ValueMode.SET:
                return this._setValue(value);
            case ValueMode.RESET:
                return this._resetValue();
            case ValueMode.PATCH:
                return this._patchValue(value);
        }
    }

    private _setValue(value: any): void {
        this.updateKey('value', value);
        this.updateKey('changed', !isEqual(value, this.select('initialValue')));
        this.updateKey('dirty', true);
    }

    private _resetValue(): void {
        this.updateKey('value', cloneDeep(this.select('initialValue')));
        this.updateKey('changed', false);
        this.updateKey('dirty', false);
    }

    private _patchValue(value: any): void {
        this.updateKey('value', value);
        this.updateKey('initialValue', cloneDeep(value));
        this.updateKey('changed', false);
        this.updateKey('dirty', false);
    }

}
