import { VisibilityExecuter } from '../../handler/visibility/types/visibility-executer';
import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { InstanceDef } from '../../util/types/instance-def';
import { VisibleOptions } from '../types/visible.options';

export function Visible(
    options: VisibleOptions
): CDecorator<InstanceDef<VisibilityExecuter>> {
    return (target: InstanceDef<VisibilityExecuter>): void => {
        Metadata.addItem('visibles', {
            ...options,
            target: target
        });
    };
}
