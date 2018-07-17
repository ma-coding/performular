import { TransformOptions } from 'stream';

import { ComponentInit } from '../../../component/types/component-init';
import { ComponentOptions } from '../../../component/types/component.options';
import { RunDetectorOptions } from '../../../run-detector/types/run-detector-options';
import { RunDetectorStrategy } from '../../../run-detector/types/run-detector-strategy';
import { Transformation } from '../../../transform/types/transformation';
import { InstanceDef } from '../../../utils/types/instance-def';
import { ObjectType } from '../../../utils/types/object-type';
import { ValidatorExecuter } from '../../../validator/types/validator-executer';
import { ValidatorOptions } from '../../../validator/types/validator-options';
import { VisibleExecuter } from '../../../visible/types/visible-executer';
import { VisibleOptions } from '../../../visible/types/visible-options';
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
    components: ObjectType<
        MergeTarget<ComponentOptions, InstanceDef<ComponentInit>>
    >;
}
