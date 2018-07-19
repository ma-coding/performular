import { AbstractHandlerWithFunc } from '../abstract-handler-with-func';
import { RunDetectionFunction } from './types/run-detection-function';
import { RunDetectionOptions } from './types/run-detection-options';
import { RunDetectionStrategy } from './types/run-detection-strategy';

export class RunDetection extends AbstractHandlerWithFunc<
    RunDetectionStrategy,
    RunDetectionFunction
> {
    constructor(options: RunDetectionOptions) {
        super(
            'runDetectors',
            'strategy',
            options.target,
            ['strategy'],
            options.params
        );
    }
}
