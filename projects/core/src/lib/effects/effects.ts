import { forkJoin, Observable, of } from 'rxjs';

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

    public addValidation(id: string, options: ValidationOptions): void {
        this.updateKey('validations', {
            [id]: new Validation(options)
        });
    }

    public removeValidation(id: string): void {
        const validations: ObjectType<Validation> = this.select('validations');
        this.updateKey('validations', {
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
        this.updateKey('visibilities', {
            [id]: new Visibility(options)
        });
    }

    public removeVisibility(id: string): void {
        const visibilities: ObjectType<Visibility> = this.select(
            'visibilities'
        );
        this.updateKey('validations', {
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
        this.updateKey('forcedDisable', disabled);
    }

    public setForcedHidden(hidden: boolean): void {
        this.updateKey('forcedHidden', hidden);
    }

    public setForcedError(error: string | undefined): void {
        this.updateKey('forcedError', error);
    }

    public evaluate(context: RunContext): Observable<void> {
        const validations: ObjectType<Validation> = this.select('validations');
        const visibles: ObjectType<Visibility> = this.select('visibilities');
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
