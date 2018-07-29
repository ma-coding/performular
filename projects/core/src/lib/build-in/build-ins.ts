import { MaxLengthValidator } from './validators/max-length.validator';
import { MinLengthValidator } from './validators/min-length.validator';
import { RequiredValidator } from './validators/required.validator';
import { MaxValidator } from './validators/max.validator';
import { MinValidator } from './validators/min.validator';
import { DefaultRunDetector } from './run-detection/default.run-detection';
import { OnChangeRunDetector } from './run-detection/on-change.run-detection';

export const CORE_VALIDATORS: any[] = [
    MaxLengthValidator,
    MinLengthValidator,
    RequiredValidator,
    MaxValidator,
    MinValidator
];

export const CORE_RUN_DETECTORS: any[] = [
    DefaultRunDetector,
    OnChangeRunDetector
];
