import { InstanceDef } from '../utils/types/instance-def';
import { VisibleExecuter } from './types/visible-executer';

export function isVisibleExecuterDef(
    value: any
): value is InstanceDef<VisibleExecuter> {
    return value && value.prototype && 'executeVisible' in value.prototype;
}
