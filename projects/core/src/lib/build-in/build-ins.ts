import { MaxLengthValidator } from './validators/max-length.validator';
import { MinLengthValidator } from './validators/min-length.validator';
import { RequiredValidator } from './validators/required.validator';
import { MaxValidator } from './validators/max.validator';
import { MinValidator } from './validators/min.validator';
import { DefaultRunDetector } from './run-detection/default.run-detection';
import { OnChangeRunDetector } from './run-detection/on-change.run-detection';
import { InstanceDef } from '../util/types/instance-def';
import { ValidationExecuter } from '../handler/validation/types/validation-executer';
import { RunDetectionStrategy } from '../handler/run-detection/types/run-detection-strategy';

export const CORE_VALIDATORS: InstanceDef<ValidationExecuter>[] = [
    MaxLengthValidator,
    MinLengthValidator,
    RequiredValidator,
    MaxValidator,
    MinValidator
];

export const CORE_RUN_DETECTORS: InstanceDef<RunDetectionStrategy>[] = [
    DefaultRunDetector,
    OnChangeRunDetector
];
