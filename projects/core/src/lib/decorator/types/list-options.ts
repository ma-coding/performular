import { ListFieldModelOptions } from '../../model/types/list-field-model-options';
import { InstanceDef } from '../../util/types/instance-def';
import { RemoveKey } from '../../util/types/remove-key';

export interface ListOptions
    extends RemoveKey<ListFieldModelOptions, 'childModel' | 'values' | 'id'> {
    childTarget: InstanceDef<any>;
}
