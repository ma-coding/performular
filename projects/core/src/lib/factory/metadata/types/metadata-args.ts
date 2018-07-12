import { RunDetectorOptions } from '../../../effects/run-detection/types/run-detector-options';
import { RunDetectorStrategy } from '../../../effects/run-detection/types/run-detector-strategy';
import { ValidatorExecuter } from '../../../effects/validation/types/validator-executer';
import { ValidatorOptions } from '../../../effects/validation/types/validator-options';
import { VisibleExecuter } from '../../../effects/visiblity/types/visible-executer';
import { VisibleOptions } from '../../../effects/visiblity/types/visible-options';
import { InstanceDef } from '../../../utils/types/instance-def';
import { ObjectType } from '../../../utils/types/object-type';
import { TransformOptions } from '../../../value/transformer/types/transform-options';
import { Transformation } from '../../../value/transformer/types/transformation';
import { MergeTarget } from './merge-target';

export interface MetadataArgs {
    runDetectors: ObjectType<
        MergeTarget<RunDetectorOptions, InstanceDef<RunDetectorStrategy>>
    >;
    validators: ObjectType<
        MergeTarget<ValidatorOptions, InstanceDef<ValidatorExecuter>>
    >;
    visibles: ObjectType<
        MergeTarget<VisibleOptions, InstanceDef<VisibleExecuter>>
    >;
    transforms: ObjectType<
        MergeTarget<TransformOptions, InstanceDef<Transformation>>
    >;
}
