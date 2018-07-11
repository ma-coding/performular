import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Transformer } from '../transformer/transformer';
import { cloneDeep } from '../utils/clone-deep';
import { isEqual } from '../utils/is-equal';
import { State } from '../utils/state';
import { ValueMode } from './types/value-mode';
import { ValueOptions } from './types/value-options';
import { ValueState } from './types/value-state';

export class Value extends State<ValueState> {

    private _transformer: Transformer | undefined;

    get value(): any {
        return this._transformTo(this._select('value'));
    }

    get value$(): any {
        return this._select$('value').pipe(map(this._transformTo.bind(this)));
    }

    get initialValue(): any {
        return this._transformTo(this._select('initialValue'));
    }

    get initialValue$(): any {
        return this._select$('initialValue').pipe(map(this._transformTo.bind(this)));
    }

    get changed(): boolean {
        return this._select('changed');
    }

    get changed$(): Observable<boolean> {
        return this._select$('changed');
    }

    get dirty(): boolean {
        return this._select('dirty');
    }

    get dirty$(): Observable<boolean> {
        return this._select$('dirty');
    }

    constructor(options: ValueOptions) {
        super({
            initialValue: options.transformer ? options.transformer.executeFrom(options.initialValue) : options.initialValue,
            value: cloneDeep(options.transformer ? options.transformer.executeFrom(options.initialValue) : options.initialValue),
            changed: false,
            dirty: false
        });
        this._transformer = options.transformer || undefined;
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

    public getUpdates$(): Observable<void> {
        return merge(
            this.value$,
            this.initialValue$
        );
    }

    private _transformTo(value: any): any {
        if (this._transformer) {
            return this._transformer.executeTo(value);
        }
        return value;
    }

    private _setValue(value: any): void {
        this._updateKey('value', value);
        this._updateKey('changed', !isEqual(value, this.initialValue$));
        this._updateKey('dirty', true);
    }

    private _resetValue(): void {
        this._updateKey('value', cloneDeep(this.initialValue$));
        this._updateKey('changed', false);
        this._updateKey('dirty', false);
    }

    private _patchValue(value: any): void {
        this._updateKey('value', value);
        this._updateKey('initialValue', cloneDeep(value));
        this._updateKey('changed', false);
        this._updateKey('dirty', false);
    }

}
