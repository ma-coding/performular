import { forkJoin, Observable, of } from 'rxjs';

import { Facade } from '../facade/facade';
import { ObjectType } from '../utils/types/object-type';
import { RunContext } from '../utils/types/run-context';
import { ValidationOptions } from '../validation/types/validation-options';
import { Validation } from '../validation/validation';
import { VisibilityOptions } from '../visibility/types/visibility-options';
import { Visibility } from '../visibility/visibility';
import { EffectsOptions } from './types/effects-options';
import { EffectsState } from './types/effects-state';

export abstract class Effects {
    protected abstract _effectsFacade: Facade;

    get validations(): ObjectType<Validation> {
        return this._effectsFacade.select('validations');
    }

    get validations$(): Observable<ObjectType<Validation>> {
        return this._effectsFacade.select$('validations');
    }

    get visibilities(): ObjectType<Visibility> {
        return this._effectsFacade.select('visibilities');
    }

    get visibilities$(): Observable<ObjectType<Visibility>> {
        return this._effectsFacade.select$('visibilities');
    }

    get forcedDisable(): boolean {
        return this._effectsFacade.select('forcedDisabled');
    }

    get forcedDisable$(): Observable<boolean> {
        return this._effectsFacade.select$('forcedDisabled');
    }

    get disabled(): boolean {
        return this._effectsFacade.select('disabled');
    }

    get disabled$(): Observable<boolean> {
        return this._effectsFacade.select$('disabled');
    }

    get forcedHidden(): boolean {
        return this._effectsFacade.select('forcedHidden');
    }

    get forcedHidden$(): Observable<boolean> {
        return this._effectsFacade.select$('forcedHidden');
    }

    get hidden(): boolean {
        return this._effectsFacade.select('hidden');
    }

    get hidden$(): Observable<boolean> {
        return this._effectsFacade.select$('hidden');
    }

    get forcedError(): string | undefined {
        return this._effectsFacade.select('forcedError');
    }

    get forcedError$(): Observable<string | undefined> {
        return this._effectsFacade.select$('forcedError');
    }

    get invalid(): boolean {
        return this._effectsFacade.select('invalid');
    }

    get invalid$(): Observable<boolean> {
        return this._effectsFacade.select$('invalid');
    }

    get errors(): string[] {
        return this._effectsFacade.select('errors');
    }

    get errors$(): Observable<string[]> {
        return this._effectsFacade.select$('errors');
    }

    public addValidation(id: string, options: ValidationOptions): void {
        this._effectsFacade.updateKey('validations', {
            [id]: new Validation(options)
        });
    }

    public removeValidation(id: string): void {
        const validations: ObjectType<Validation> = this._effectsFacade.select(
            'validations'
        );
        this._effectsFacade.updateKey('validations', {
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
        this._effectsFacade.updateKey('visibilities', {
            [id]: new Visibility(options)
        });
    }

    public removeVisibility(id: string): void {
        const visibilities: ObjectType<Visibility> = this._effectsFacade.select(
            'visibilities'
        );
        this._effectsFacade.updateKey('validations', {
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
        this._effectsFacade.updateKey('forcedDisabled', disabled);
    }

    public setForcedHidden(hidden: boolean): void {
        this._effectsFacade.updateKey('forcedHidden', hidden);
    }

    public setForcedError(error: string | undefined): void {
        this._effectsFacade.updateKey('forcedError', error);
    }

    public evaluate(context: RunContext): Observable<void> {
        const validations: ObjectType<Validation> = this._effectsFacade.select(
            'validations'
        );
        const visibles: ObjectType<Visibility> = this._effectsFacade.select(
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
