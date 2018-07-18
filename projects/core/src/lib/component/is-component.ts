import { InstanceDef } from '../utils/types/instance-def';

export function isComponent(value: any): value is InstanceDef<any> {
    return typeof value === 'function';
}
