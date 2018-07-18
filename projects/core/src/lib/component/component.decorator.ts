import { MetadataStore } from '../factory/metadata/metadata-store';
import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { ComponentOptions } from './types/component.options';

export function PerformularComponent(
    options: ComponentOptions
): CDecorator<InstanceDef<any>> {
    return (target: InstanceDef<any>): void => {
        MetadataStore.setItem('components', {
            ...options,
            target: target
        });
    };
}
