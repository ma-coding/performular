import { tap } from 'rxjs/operators';

import { makeObservable } from '../../util/make-observable';
import { VisibleOptions } from '../../decorator/types/visible.options';
import { RunContext } from '../../util/types/run-context';
import { AbstractHandlerWithFunc } from '../abstract-handler-with-func';
import { RunDetection } from '../run-detection/run-detection';
import { VisibilityExecuter } from './types/visibility-executer';
import { VisibilityFunction } from './types/visibility-function';
import { VisibilityOptions } from './types/visibility-options';
import { VisibilityType } from './types/visibility-type';
import { RunDetectionTarget } from '../run-detection/types/run-detection-target';
import { RunDetectionOptions } from '../run-detection/types/run-detection-options';

export class Visibility extends AbstractHandlerWithFunc<
    VisibilityExecuter,
    VisibilityFunction
> {
    public type: VisibilityType | 'HIDE' | 'DISABLE';
    public runDetection: RunDetection;
    public result?: boolean;

    constructor(options: VisibilityOptions) {
        super(
            'visibles',
            'execute',
            options.target,
            ['execute'],
            options.params
        );
        this.type = options.type;
        let runDetectionOptions: RunDetectionOptions = {
            target: (context: RunContext): boolean => true
        };
        if (this.metadata) {
            const runDetector: RunDetectionTarget | undefined = (<
                VisibleOptions
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

    public run(context: RunContext): ReturnType<VisibilityFunction> | any {
        if (this.runDetection.run(context)) {
            return makeObservable(super.run(context)).pipe(
                tap((res: boolean) => (this.result = res))
            );
        } else {
            return makeObservable(undefined);
        }
    }
}
