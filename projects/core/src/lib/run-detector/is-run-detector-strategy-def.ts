import { InstanceDef } from '../../utils/types/instance-def';
import { RunDetectorStrategy } from './types/run-detector-strategy';

export function isRunDetectorStrategyDef(
    value: any
): value is InstanceDef<RunDetectorStrategy> {
    return value && value.prototype && 'strategy' in value.prototype;
}
