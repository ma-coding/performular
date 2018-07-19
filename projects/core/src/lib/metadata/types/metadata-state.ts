import { ModelOptions } from '../../decorator/types/model.options';
import { RunDetectorOptions } from '../../decorator/types/run-detector.options';
import { ValidatorOptions } from '../../decorator/types/validator.options';
import { VisibleOptions } from '../../decorator/types/visible.options';
import { RunDetectionStrategy } from '../../handler/run-detection/types/run-detection-strategy';
import { ValidationExecuter } from '../../handler/validation/types/validation-executer';
import { VisibilityExecuter } from '../../handler/visibility/types/visibility-executer';
import { InstanceDef } from '../../util/types/instance-def';
import { MetadataObject } from './metadata-object';

export interface MetadataState {
    runDetectors: MetadataObject<
        RunDetectorOptions,
        InstanceDef<RunDetectionStrategy>
    >;
    validators: MetadataObject<
        ValidatorOptions,
        InstanceDef<ValidationExecuter>
    >;
    visibles: MetadataObject<VisibleOptions, InstanceDef<VisibilityExecuter>>;
    models: MetadataObject<ModelOptions, any>;
}
