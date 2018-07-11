import { forkJoin, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { State } from '../utils/state';
import { ObjectType } from '../utils/types/object-type';
import { RunContext } from '../utils/types/run-context';
import { ValidationOptions } from '../validation/types/validation-options';
import { Validation } from '../validation/validation';
import { VisibilityOptions } from '../visiblity/types/visibility-options';
import { Visibility } from '../visiblity/visibility';
import { EffectsOptions } from './types/effects-options';
import { EffectsState } from './types/effects-state';

export class Effects extends State<EffectsState> {

    get validations(): ObjectType<Validation> {
        return this._select('validations');
    }

    get validations$(): Observable<ObjectType<Validation>> {
        return this._select$('validations');
    }

    get visibilities(): ObjectType<Visibility> {
        return this._select('visibilities');
    }

    get visibilities$(): Observable<ObjectType<Visibility>> {
        return this._select$('visibilities');
    }

    get forcedDisable(): boolean {
        return this._select('forcedDisable');
    }

    get forcedDisable$(): Observable<boolean> {
        return this._select$('forcedDisable');
    }

    get disabled(): boolean {
        return this._select('disabled');
    }

    get disabled$(): Observable<boolean> {
        return this._select$('disabled');
    }

    get forcedHidden(): boolean {
        return this._select('forcedHidden');
    }

    get forcedHidden$(): Observable<boolean> {
        return this._select$('forcedHidden');
    }

    get hidden(): boolean {
        return this._select('hidden');
    }

    get hidden$(): Observable<boolean> {
        return this._select$('hidden');
    }

    get forcedError(): string | undefined {
        return this._select('forcedError');
    }

    get forcedError$(): Observable<string | undefined> {
        return this._select$('forcedError');
    }

    get invalid(): boolean {
        return this._select('invalid');
    }

    get invalid$(): Observable<boolean> {
        return this._select$('invalid');
    }

    get errors(): string[] {
        return this._select('errors');
    }

    get errors$(): Observable<string[]> {
        return this._select$('errors');
    }

    constructor(options: EffectsOptions) {
        super({
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
            forcedDisable: options.forcedDisable || false,
            forcedHidden: options.forcedHidden || false,
            forcedError: options.forcedError,
            disabled: options.forcedDisable || false,
            hidden: options.forcedHidden || false,
            invalid: !!options.forcedError,
            errors: !!options.forcedError ? [options.forcedError] : []
        });
    }

    public getUpdates$(): Observable<void> {
        return merge(
            this._select$('validations'),
            this._select$('visibilities'),
            this._select$('forcedDisable'),
            this._select$('forcedHidden'),
            this._select$('forcedError')
        ).pipe(map(() => { }));
    }

    public addValidation(id: string, options: ValidationOptions): void {
        this._updateKey('validations', {
            [id]: new Validation(options)
        });
    }

    public removeValidation(id: string): void {
        const validations: ObjectType<Validation> = this._select('validations');
        this._updateKey('validations', {
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
        this._updateKey('visibilities', {
            [id]: new Visibility(options)
        });
    }

    public removeVisibility(id: string): void {
        const visibilities: ObjectType<Visibility> = this._select(
            'visibilities'
        );
        this._updateKey('validations', {
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
        this._updateKey('forcedDisable', disabled);
    }

    public setForcedHidden(hidden: boolean): void {
        this._updateKey('forcedHidden', hidden);
    }

    public setForcedError(error: string | undefined): void {
        this._updateKey('forcedError', error);
    }

    public evaluate(context: RunContext): Observable<void> {
        const validations: ObjectType<Validation> = this._select('validations');
        const visibles: ObjectType<Visibility> = this._select('visibilities');
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
}
