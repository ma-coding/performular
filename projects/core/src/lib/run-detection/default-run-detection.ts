import { RunContext } from '../utils/types/run-context';
import { RunDetectionOptions } from './types/run-detection-options';

export const DefaultRunDetectionOptions: RunDetectionOptions = {
    target: (context: RunContext): boolean => true
};
