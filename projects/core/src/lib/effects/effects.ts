import { forkJoin, Observable, of } from 'rxjs';

import { State } from '../utils/state';
import { ObjectType } from '../utils/types/object-type';
import { RunContext } from '../utils/types/run-context';
import { ValidationOptions } from '../validation/types/validation-options';
import { Validation } from '../validation/validation';
import { VisibilityOptions } from '../visibility/types/visibility-options';
import { Visibility } from '../visibility/visibility';
import { EffectsOptions } from './types/effects-options';
import { EffectsState } from './types/effects-state';

// Todo: add full implementation
export abstract class Effects<T extends EffectsState> {
    protected abstract _state$: State<T>;

    get validations(): ObjectType<Validation> {
        return this._state$.select('validations');
    }

    get validations$(): Observable<ObjectType<Validation>> {
        return this._state$.select$('validations');
    }

    get visibilities(): ObjectType<Visibility> {
        return this._state$.select('visibilities');
    }

    get visibilities$(): Observable<ObjectType<Visibility>> {
        return this._state$.select$('visibilities');
    }

    get forcedDisable(): boolean {
        return this._state$.select('forcedDisabled');
    }

    get forcedDisable$(): Observable<boolean> {
        return this._state$.select$('forcedDisabled');
    }

    get disabled(): boolean {
        return this._state$.select('disabled');
    }

    get disabled$(): Observable<boolean> {
        return this._state$.select$('disabled');
    }

    get forcedHidden(): boolean {
        return this._state$.select('forcedHidden');
    }

    get forcedHidden$(): Observable<boolean> {
        return this._state$.select$('forcedHidden');
    }

    get hidden(): boolean {
        return this._state$.select('hidden');
    }

    get hidden$(): Observable<boolean> {
        return this._state$.select$('hidden');
    }

    get forcedError(): string | undefined {
        return this._state$.select('forcedError');
    }

    get forcedError$(): Observable<string | undefined> {
        return this._state$.select$('forcedError');
    }

    get invalid(): boolean {
        return this._state$.select('invalid');
    }

    get invalid$(): Observable<boolean> {
        return this._state$.select$('invalid');
    }

    get errors(): string[] {
        return this._state$.select('errors');
    }

    get errors$(): Observable<string[]> {
        return this._state$.select$('errors');
    }

    public addValidation(id: string, options: ValidationOptions): void {
        this._state$.updateKey('validations', {
            [id]: new Validation(options)
        });
    }

    public removeValidation(id: string): void {
        const validations: ObjectType<Validation> = this._state$.select(
            'validations'
        );
        this._state$.updateKey('validations', {
            ...Object.keys(validations).reduce((prev: any, curr: string) => {
                if (curr === id) {
                    return prev;
                }
                prev[curr] = validations[curr];
                return prev;
            }, {})
        });
    }

    public addVisiblity(id: string, options: VisibilityOptions): void {
        this._state$.updateKey('visibilities', {
            [id]: new Visibility(options)
        });
    }

    public removeVisibility(id: string): void {
        const visibilities: ObjectType<Visibility> = this._state$.select(
            'visibilities'
        );
        this._state$.updateKey('validations', {
            ...Object.keys(visibilities).reduce((prev: any, curr: string) => {
                if (curr === id) {
                    return prev;
                }
                prev[curr] = visibilities[curr];
                return prev;
            }, {})
        });
    }

    public setForcedDisabled(disabled: boolean): void {
        this._state$.updateKey('forcedDisabled', disabled);
    }

    public setForcedHidden(hidden: boolean): void {
        this._state$.updateKey('forcedHidden', hidden);
    }

    public setForcedError(error: string | undefined): void {
        this._state$.updateKey('forcedError', error);
    }

    public evaluate(context: RunContext): Observable<void> {
        const validations: ObjectType<Validation> = this._state$.select(
            'validations'
        );
        const visibles: ObjectType<Visibility> = this._state$.select(
            'visibilities'
        );
        return forkJoin(
            ...Object.keys(validations).map((key: string) =>
                validations[key].evaluate(context)
            ),
            ...Object.keys(visibles).map((key: string) =>
                visibles[key].evaluate(context)
            ),
            of(undefined)
        );
    }

    public updateFlags(): void {
        // Todo: Add Implementation
    }

    protected _initEffects(options: EffectsOptions): EffectsState {
        return {
            validations: Object.keys(options.validations || {}).reduce(
                (prev: any, curr: string) => {
                    prev[curr] = new Validation(
                        // Todo: set right type
                        (options.validations as ObjectType<ValidationOptions>)[
                            curr
                        ]
                    );
                    return prev;
                },
                {}
            ),
            visibilities: Object.keys(options.visibilities || {}).reduce(
                (prev: any, curr: string) => {
                    prev[curr] = new Visibility(
                        // Todo: set right type
                        (options.visibilities as ObjectType<VisibilityOptions>)[
                            curr
                        ]
                    );
                    return prev;
                },
                {}
            ),
            forcedDisabled: options.forcedDisabled || false,
            forcedHidden: options.forcedHidden || false,
            forcedError: options.forcedError,
            disabled: options.forcedDisabled || false,
            hidden: options.forcedHidden || false,
            invalid: !!options.forcedError,
            errors: !!options.forcedError ? [options.forcedError] : [],
            errorState: false
        };
    }
}
