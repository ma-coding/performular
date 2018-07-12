import { MetadataStore } from '../factory/metadata/metadata-store';
import { TransformOptions } from '../transform/types/transform-options';
import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { Transformation } from './types/transformation';

export function Transform(
    options: TransformOptions
): CDecorator<InstanceDef<Transformation>> {
    return (target: InstanceDef<Transformation>): void => {
        MetadataStore.setItem('transforms', {
            ...options,
            target: target
        });
    };
}
