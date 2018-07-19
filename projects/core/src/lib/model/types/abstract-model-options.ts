import { ItemOptions } from '../../handler/item';
import { InstanceDef } from '../../util/types/instance-def';

export interface AbstractModelOptions extends ItemOptions {
    id: string;
    model: string | InstanceDef<any>;
    attrs: any;
}
