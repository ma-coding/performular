import { MetadataStore } from '../metadata/metadata-store';
import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { TransformOptions } from './types/transform-options';
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
