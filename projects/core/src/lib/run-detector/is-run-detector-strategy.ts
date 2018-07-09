import { RunDetectorStrategy } from './types/run-detector-strategy';

export function isRunDetectorStrategy(
    value: any
): value is RunDetectorStrategy {
    return 'strategy' in value;
}
