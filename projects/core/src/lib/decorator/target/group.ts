import { Metadata } from '../../metadata/metadata';
import { CDecorator } from '../../util/types/c-decorator';
import { GroupOptions } from '../types/group-options';

export function Group<K extends string>(
    options: GroupOptions<K>
): CDecorator<any> {
    return (target: any): void => {
        Metadata.addFormItem('groups', {
            ...options,
            target: target
        });
    };
}
