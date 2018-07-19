import { GroupFieldModelOptions } from '../../model/types/group-field-model-options';
import { RemoveKey } from '../../util/types/remove-key';

export interface GroupOptions
    extends RemoveKey<GroupFieldModelOptions, 'children'> {}
