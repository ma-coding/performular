import { InstanceDef } from '../../../util/types/instance-def';
import { RunDetectionFunction } from './run-detection-function';
import { RunDetectionStrategy } from './run-detection-strategy';

export type RunDetectionTarget =
    | string
    | InstanceDef<RunDetectionStrategy>
    | RunDetectionFunction;
