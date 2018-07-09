import { RunDetectorTarget } from '../../run-detector/types/run-detector-target';

export interface ValidatorOptions {
    name: string;
    runDetector?: RunDetectorTarget;
}
