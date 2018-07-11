import { CDecorator } from '../utils/types/c-decorator';
import { InstanceDef } from '../utils/types/instance-def';
import { GroupOptions } from './types/group-options';

export function Group(options: GroupOptions): CDecorator<InstanceDef<any>> {
    return (target: InstanceDef<any>): void => {
        const controls: any[] = Reflect.getMetadata('GROUP', target) || [];
        Reflect.defineMetadata('GROUP', {
            ...options
        }, target);
    };
}
