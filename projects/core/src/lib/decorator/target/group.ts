import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { InstanceDef } from '../../util/types/instance-def';
import { GroupOptions } from '../types/group-options';

export function Group<K extends string = any, ATTRS = any>(
    options: GroupOptions<K, ATTRS>
): CDecorator<any> {
    return (target: InstanceDef<K>): void => {
        Metadata.addFormItem('groups', {
            ...options,
            target: target
        });
    };
}
