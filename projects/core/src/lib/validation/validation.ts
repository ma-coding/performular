import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MetadataStore } from '../factory/metadata/metadata-store';
import { MergeTarget } from '../factory/metadata/types/merge-target';
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
    public runDetection: RunDetection | undefined;
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

            this._setRunDetection(options);
            this.target = MetadataStore.getInjector().createInstance(
                metadata.target
            );
            return;
        } else if (isValidatorExecuterDef(options.target)) {
            this._setRunDetection(options);
            this.target = MetadataStore.getInjector().createInstance(
                options.target
            );
        } else if (isFunction<ValidatorFunction>(options.target)) {
            this._setRunDetection(options);
            this.target = options.target;
        }
        throw new Error('');
    }

    public evaluate(context: RunContext): Observable<void> {
        if (
            (this.runDetection && this.runDetection.evaluate(context)) ||
            !this.runDetection
        ) {
            return makeObservable(this._runValidator(context)).pipe(
                map(this._mapResult.bind(this))
            );
        } else {
            return of(undefined);
        }
    }

    private _setRunDetection(options: ValidationOptions): void {
        if (options.runDetection) {
            this.runDetection = new RunDetection(options.runDetection);
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
