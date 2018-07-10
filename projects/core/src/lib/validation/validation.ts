import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataStore } from '../metadata/metadata-store';
import { MergeTarget } from '../metadata/types/merge-target';
import { DefaultRunDetectionOptions } from '../run-detection/default-run-detection';
import { RunDetection } from '../run-detection/run-detection';
import { isFunction } from '../utils/is-function';
import { isString } from '../utils/is-string';
import { makeObservable } from '../utils/make-observable';
import { InstanceDef } from '../utils/types/instance-def';
import { RunContext } from '../utils/types/run-context';
import { isValidatorExecuter } from '../validator/is-validator-executer';
import { isValidatorExecuterDef } from '../validator/is-validator-executer-def';
import { ValidatorExecuter } from '../validator/types/validator-executer';
import { ValidatorFunction } from '../validator/types/validator-function';
import { ValidatorOptions } from '../validator/types/validator-options';
import { ValidatorResult } from '../validator/types/validator-result';
import { ValidationOptions } from './types/validation-options';

export class Validation {
    public runDetection: RunDetection;
    public target: ValidatorExecuter | ValidatorFunction;
    public params: any;
    public result: object | undefined;

    constructor(options: ValidationOptions) {
        this.params = options.params;
        if (isString(options.target)) {
            const metadata: MergeTarget<
                ValidatorOptions,
                InstanceDef<ValidatorExecuter>
                > = MetadataStore.getItem('validators', options.target);

            this.runDetection = new RunDetection(
                options.runDetection || {
                    target:
                        metadata.runDetector ||
                        DefaultRunDetectionOptions.target
                }
            );
            this.target = MetadataStore.getInjector().createInstance(
                metadata.target
            );
        } else if (isValidatorExecuterDef(options.target)) {
            this.runDetection = new RunDetection(
                options.runDetection || DefaultRunDetectionOptions
            );
            this.target = MetadataStore.getInjector().createInstance(
                options.target
            );
        } else if (isFunction<ValidatorFunction>(options.target)) {
            this.runDetection = new RunDetection(
                options.runDetection || DefaultRunDetectionOptions
            );
            this.target = options.target;
        }
        throw new Error('');
    }

    public evaluate(context: RunContext): Observable<void> {
        if (this.runDetection.evaluate(context)) {
            return makeObservable(this._runValidator(context)).pipe(
                map(this._mapResult.bind(this))
            );
        } else {
            return of(undefined);
        }
    }

    private _mapResult(result: object | undefined): void {
        this.result = result;
    }

    private _runValidator(context: RunContext): ValidatorResult {
        if (isValidatorExecuter(this.target)) {
            return this.target.executeValidator(context, this.params);
        } else if (isFunction<ValidatorFunction>(this.target)) {
            return this.target(context, this.params);
        }
        throw new Error('');
    }
}
