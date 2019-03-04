import { InstanceDef } from '../../util/types/instance-def';
import { ObjectType } from '../../util/types/object-type';
import { ActionOptions } from '../../handler/effect/types/action-options';

export interface AbstractModelOptions<ATTRS = any> {
    id: string;
    model: string | InstanceDef<any>;
    attrs: ATTRS;
    actions?: ObjectType<ActionOptions>;
}
