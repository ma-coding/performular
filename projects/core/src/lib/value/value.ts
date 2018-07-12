import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Facade } from '../facade/facade';
import { Transformer } from '../transformer/transformer';
import { cloneDeep } from '../utils/clone-deep';
import { isEqual } from '../utils/is-equal';
import { ValueMode } from './types/value-mode';
import { ValueOptions } from './types/value-options';
import { ValueState } from './types/value-state';

export abstract class Value {
    private _transformer: Transformer | undefined;

    protected abstract _valueFacade: Facade;

    get value(): any {
        return this._transformTo(this._valueFacade.select('value'));
    }

    get value$(): any {
        return this._valueFacade
            .select$('value')
            .pipe(map(this._transformTo.bind(this)));
    }

    get initialValue(): any {
        return this._transformTo(this._valueFacade.select('initialValue'));
    }

    get initialValue$(): any {
        return this._valueFacade
            .select$('initialValue')
            .pipe(map(this._transformTo.bind(this)));
    }

    get changed(): boolean {
        return this._valueFacade.select('changed');
    }

    get changed$(): Observable<boolean> {
        return this._valueFacade.select$('changed');
    }

    get dirty(): boolean {
        return this._valueFacade.select('dirty');
    }

    get dirty$(): Observable<boolean> {
        return this._valueFacade.select$('dirty');
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

    protected _initValue(options: ValueOptions): ValueState {
        if (options.transformer) {
            this._transformer = new Transformer(options.transformer);
        }
        const value: any = this._transformFrom(
            options.value || options.defaultValue || null
        );
        console.log(options.id, value);
        return {
            defaultValue: options.defaultValue,
            initialValue: this._transformFrom(value),
            value: cloneDeep(this._transformFrom(value)),
            changed: false,
            dirty: false
        };
    }

    private _transformTo(value: any): any {
        if (this._transformer) {
            return this._transformer.executeTo(value);
        }
        return value;
    }

    private _transformFrom(value: any): any {
        if (this._transformer) {
            return this._transformer.executeFrom(value);
        }
        return value;
    }

    private _setValue(value: any): void {
        this._valueFacade.updateKey('value', value);
        this._valueFacade.updateKey(
            'changed',
            !isEqual(value, this.initialValue$)
        );
        this._valueFacade.updateKey('dirty', true);
    }

    private _resetValue(): void {
        this._valueFacade.updateKey('value', cloneDeep(this.initialValue$));
        this._valueFacade.updateKey('changed', false);
        this._valueFacade.updateKey('dirty', false);
    }

    private _patchValue(value: any): void {
        this._valueFacade.updateKey('value', value);
        this._valueFacade.updateKey('initialValue', cloneDeep(value));
        this._valueFacade.updateKey('changed', false);
        this._valueFacade.updateKey('dirty', false);
    }
}
