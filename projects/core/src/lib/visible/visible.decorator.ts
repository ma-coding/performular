import { MetadataStore } from '../metadata/metadata-store';
import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { VisibleExecuter } from './types/visible-executer';
import { VisibleOptions } from './types/visible-options';

export function Visible(
    options: VisibleOptions
): CDecorator<InstanceDef<VisibleExecuter>> {
    return (target: InstanceDef<VisibleExecuter>): void => {
        MetadataStore.setItem('visibles', {
            ...options,
            target: target
        });
    };
}
