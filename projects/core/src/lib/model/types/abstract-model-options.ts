import { InstanceDef } from '../../util/types/instance-def';

export interface AbstractModelOptions {
    id: string;
    model: string | InstanceDef<any>;
    attrs: any;
}
