import { ModelOptions } from '../../decorator/types/model.options';
import { RunDetectorOptions } from '../../decorator/types/run-detector.options';
import { ValidatorOptions } from '../../decorator/types/validator.options';
import { VisibleOptions } from '../../decorator/types/visible.options';
import { RunDetectionStrategy } from '../../handler/run-detection/types/run-detection-strategy';
import { ValidationExecuter } from '../../handler/validation/types/validation-executer';
import { VisibilityExecuter } from '../../handler/visibility/types/visibility-executer';
import { InstanceDef } from '../../util/types/instance-def';
import { MetadataObject } from './metadata-object';
import { DataConnectionStrategy } from '../../handler/data-connection/types/data-connection-strategy';
import { DatasourceOptions } from '../../decorator/types/datasource.options';
import { ReactorOptions } from '../../decorator/types/reactor-options';
import { Action } from '../../handler/effect/types/action';

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
    datasources: MetadataObject<
        DatasourceOptions,
        InstanceDef<DataConnectionStrategy>
    >;
    models: MetadataObject<ModelOptions, any>;
    actions: MetadataObject<ReactorOptions, InstanceDef<Action>>;
}
