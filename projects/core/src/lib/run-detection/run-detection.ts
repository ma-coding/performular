import { MetadataStore } from '../metadata/metadata-store';
import { isRunDetectorStrategy } from '../run-detector/is-run-detector-strategy';
import { isRunDetectorStrategyDef } from '../run-detector/is-run-detector-strategy-def';
import { RunDetectorFunction } from '../run-detector/types/run-detector-function';
import { RunDetectorStrategy } from '../run-detector/types/run-detector-strategy';
import { isFunction } from '../utils/is-function';
import { isString } from '../utils/is-string';
import { InstanceDef } from '../utils/types/instance-def';
import { RunContext } from '../utils/types/run-context';
import { RunDetectionOptions } from './types/run-detection-options';

export class RunDetection {
    public params: any | undefined;
    public target: RunDetectorStrategy | RunDetectorFunction;

    constructor(options: RunDetectionOptions) {
        this.params = options.params;
        if (isString(options.target)) {
            const runDetectorInstanceDef: InstanceDef<
                RunDetectorStrategy
            > = MetadataStore.getItem('runDetectors', options.target).target;
            this.target = MetadataStore.getInjector().createInstance(
                runDetectorInstanceDef
            );
        } else if (isRunDetectorStrategyDef(options.target)) {
            this.target = MetadataStore.getInjector().createInstance(
                options.target
            );
        } else if (isFunction<RunDetectorFunction>(options.target)) {
            this.target = options.target;
        }
        throw new Error('');
    }

    public evaluate(context: RunContext): boolean {
        if (isRunDetectorStrategy(this.target)) {
            return this.target.strategy(context);
        } else if (isFunction<RunDetectorFunction>(this.target)) {
            return this.target(context);
        }
        throw new Error('');
    }
}
