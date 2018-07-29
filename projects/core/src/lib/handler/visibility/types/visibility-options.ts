import { RunDetectionOptions } from '../../run-detection/types/run-detection-options';
import { VisibilityTarget } from './visibility-target';
import { VisibilityType } from './visibility-type';

export interface VisibilityOptions {
    target: VisibilityTarget;
    type: VisibilityType;
    params?: any;
    runDetection?: RunDetectionOptions;
}
