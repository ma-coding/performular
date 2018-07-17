import { MetadataStore } from '../factory/metadata/metadata-store';
import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { ComponentInit } from './types/component-init';
import { ComponentOptions } from './types/component.options';

export function PerformularComponent(
    options: ComponentOptions
): CDecorator<InstanceDef<ComponentInit>> {
    return (target: InstanceDef<ComponentInit>): void => {
        MetadataStore.setItem('components', {
            ...options,
            target: target
        });
    };
}
