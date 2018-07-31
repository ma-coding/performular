import { tap } from 'rxjs/operators';

import { VisibleOptions } from '../../decorator/types/visible.options';
import { makeObservable } from '../../util/make-observable';
import { RunContext } from '../../util/types/run-context';
import { AbstractHandlerWithFunc } from '../abstract-handler-with-func';
import { RunDetection } from '../run-detection/run-detection';
import { ValidationExecuter } from './types/validation-executer';
import { ValidationFunction } from './types/validation-function';
import { ValidationOptions } from './types/validation-options';
import { RunDetectionTarget } from '../run-detection/types/run-detection-target';
import { RunDetectionOptions } from '../run-detection/types/run-detection-options';
import { ValidatorOptions } from '../../decorator/types/validator.options';

export class Validation extends AbstractHandlerWithFunc<
    ValidationExecuter,
    ValidationFunction
> {
    public runDetection: RunDetection;
    public errorMsg: string;
    public error?: string;

    constructor(options: ValidationOptions) {
        super(
            'validators',
            'execute',
            options.target,
            ['execute'],
            options.params
        );
        this.errorMsg = options.errorMsg || '';
        let runDetectionOptions: RunDetectionOptions = {
            target: (context: RunContext): boolean => true
        };
        if (this.metadata) {
            const runDetector: RunDetectionTarget | undefined = (<
                ValidatorOptions
            >this.metadata).runDetector;
            if (runDetector) {
                runDetectionOptions = { target: runDetector };
            }
        }

        this.runDetection = new RunDetection(
            options.runDetection ||
                runDetectionOptions || {
                    target: (context: RunContext): boolean => true
                }
        );
    }

    public run(context: RunContext): ReturnType<ValidationFunction> {
        if (this.runDetection.run(context)) {
            return makeObservable(super.run(context)).pipe(
                tap(
                    (res: {} | undefined) =>
                        (this.error = this._buildError(res))
                )
            );
        } else {
            return makeObservable(undefined);
        }
    }

    private _buildError(result: any): string | undefined {
        if (!result) {
            return;
        }
        if (typeof result === 'object') {
            return Object.keys(result).reduce((prev: string, key: string) => {
                return prev.split(key).join(result[key]);
            }, this.errorMsg);
        } else {
            return this.errorMsg;
        }
    }
}
