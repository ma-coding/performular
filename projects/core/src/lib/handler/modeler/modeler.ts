import { ModelOptions } from '../../decorator/types/model.options';
import { MetadataType } from '../../metadata/types/metadata-type';
import { AbstractModel } from '../../model/abstract-model';
import { AbstractModelOptions } from '../../model/types/abstract-model-options';
import { InstanceDef } from '../../util/types/instance-def';
import { AbstractHandler } from '../abstract-handler';

export class Modeler extends AbstractHandler<any> {
    constructor(target: InstanceDef<any> | string) {
        super('models', target, []);
    }

    public build(options: AbstractModelOptions): AbstractModel {
        return (<MetadataType<ModelOptions, any>>this.metadata).builder(
            options
        );
    }
}
