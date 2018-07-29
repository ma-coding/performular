import { AbstractDecoratorOptions } from '../decorator/types/abstract-decorator.options';
import { Metadata } from '../metadata/metadata';
import { MetadataState } from '../metadata/types/metadata-state';
import { MetadataType } from '../metadata/types/metadata-type';
import { isClass } from '../util/is-class';
import { isString } from '../util/is-string';
import { InstanceDef } from '../util/types/instance-def';

export abstract class AbstractHandler<InstanceType> {
    public target: InstanceDef<InstanceType>;
    public metadata: MetadataType<AbstractDecoratorOptions, any>;

    constructor(
        metadataKey: keyof MetadataState,
        target: InstanceDef<InstanceType> | string,
        keys: Array<keyof InstanceType>
    ) {
        if (isString(target)) {
            this.metadata = Metadata.getItem(metadataKey, target);
            if (this.metadata) {
                this.target = this.metadata.target;
            } else {
                throw new Error('Todo:');
            }
        } else if (isClass<InstanceType>(target, keys)) {
            this.target = target;
            this.metadata = Metadata.findTarget('models', target);
        } else {
            throw new Error('Todo:');
        }
    }
}
