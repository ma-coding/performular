import { RunDetectionOptions } from '../../run-detection/types/run-detection-options';
import { VisibleTarget } from '../../visible/types/visible-target';
import { VisibityType } from './visibility-type';

export interface VisibilityOptions {
    target: VisibleTarget;
    type: VisibityType;
    params?: any;
    runDetection?: RunDetectionOptions;
}
