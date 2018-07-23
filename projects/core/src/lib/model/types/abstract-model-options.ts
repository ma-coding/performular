import { InstanceDef } from '../../util/types/instance-def';

export interface AbstractModelOptions<ATTRS = any> {
    id: string;
    model: string | InstanceDef<any>;
    attrs: ATTRS;
}
