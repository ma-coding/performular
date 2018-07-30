import { AbstractDecoratorOptions } from './abstract-decorator.options';
import { RunDetectionTarget } from '../../handler/run-detection/types/run-detection-target';

export interface AbstractEffectOptions extends AbstractDecoratorOptions {
    runDetector?: RunDetectionTarget;
}
