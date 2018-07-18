import { InstanceDef } from '../../utils/types/instance-def';
import { FrameworkType } from './framework-type';

export interface FrameworkState {
    type: FrameworkType;
    field: InstanceDef<any>;
    attrs: any;
    instance: any | undefined;
}
