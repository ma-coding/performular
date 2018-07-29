import { RunDetectionOptions } from '../../run-detection/types/run-detection-options';
import { ValidationTarget } from './validation-target';

export interface ValidationOptions {
    target: ValidationTarget;
    errorMsg?: string;
    params?: any;
    runDetection?: RunDetectionOptions;
}
