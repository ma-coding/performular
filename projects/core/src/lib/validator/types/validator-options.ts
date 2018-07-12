import { RunDetectorTarget } from '../../run-detection/types/run-detector-target';

export interface ValidatorOptions {
    name: string;
    runDetector?: RunDetectorTarget;
}
