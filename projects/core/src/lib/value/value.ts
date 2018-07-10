import { isEqual } from '../../old/utils/misc';
import { cloneDeep } from '../utils/clone-deep';
import { State } from '../utils/state';
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

    public setValue(value: any): void {
        this.updateKey('value', value);
        this.updateKey('changed', !isEqual(value, this.select('initialValue')));
        this.updateKey('dirty', true);
    }

    public resetValue(): void {
        this.updateKey('value', cloneDeep(this.select('initialValue')));
        this.updateKey('changed', false);
        this.updateKey('dirty', false);
    }

    public patchValue(value: any): void {
        this.updateKey('value', value);
        this.updateKey('initialValue', cloneDeep(value));
        this.updateKey('changed', false);
        this.updateKey('dirty', false);
    }

}
