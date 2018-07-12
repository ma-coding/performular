import { InstanceDef } from '../../../utils/types/instance-def';
import { RunDetectorFunction } from './run-detector-function';
import { RunDetectorStrategy } from './run-detector-strategy';

export type RunDetectorTarget =
    | string
    | InstanceDef<RunDetectorStrategy>
    | RunDetectorFunction;
