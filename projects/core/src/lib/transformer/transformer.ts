import { MetadataStore } from '../factory/metadata/metadata-store';
import { MergeTarget } from '../factory/metadata/types/merge-target';
import { isTransformObject } from '../transform/is-transform-object';
import { isTransformationDef } from '../transform/is-transformation-def';
import { TransformOptions } from '../transform/types/transform-options';
import { Transformation } from '../transform/types/transformation';
import { isString } from '../utils/is-string';
import { InstanceDef } from '../utils/types/instance-def';
import { TransformerOptions } from './types/transformer-options';

export class Transformer {
    public target: Transformation;

    constructor(options: TransformerOptions) {
        if (isString(options.target)) {
            const metadata: MergeTarget<
                TransformOptions,
                InstanceDef<Transformation>
            > = MetadataStore.getItem('transforms', options.target);
            this.target = MetadataStore.getInjector().createInstance(
                metadata.target
            );
            return;
        } else if (isTransformationDef(options.target)) {
            this.target = MetadataStore.getInjector().createInstance(
                options.target
            );
            return;
        } else if (isTransformObject(options.target)) {
            this.target = options.target;
            return;
        }
        throw Error('');
    }

    public executeTo(value: any): any {
        return this.target.to(value);
    }

    public executeFrom(value: any): any {
        return this.target.from(value);
    }
}
