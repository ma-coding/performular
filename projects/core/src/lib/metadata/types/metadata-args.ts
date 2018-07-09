import { RunDetectorOptions } from '../../run-detector/types/run-detector-options';
import { RunDetectorStrategy } from '../../run-detector/types/run-detector-strategy';
import { InstanceDef } from '../../utils/types/instance-def';
import { ObjectType } from '../../utils/types/object-type';
import { ValidatorExecuter } from '../../validator/types/validator-executer';
import { ValidatorOptions } from '../../validator/types/validator-options';
import { VisibleExecuter } from '../../visible/types/visible-executer';
import { VisibleOptions } from '../../visible/types/visible-options';
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
}
