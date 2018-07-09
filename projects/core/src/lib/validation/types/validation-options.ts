import { RunDetectionOptions } from '../../run-detection/types/run-detection-options';
import { ValidatorTarget } from '../../validator/types/validator-target';

export interface ValidationOptions {
    target: ValidatorTarget;
    errorMsg?: string;
    params?: any;
    runDetection?: RunDetectionOptions;
}
