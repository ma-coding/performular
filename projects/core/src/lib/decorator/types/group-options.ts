import { GroupFieldModelOptions } from '../../model/types/group-field-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { LayoutOptions } from './layout-options';

export interface GroupOptions<K extends string = any>
    extends RemoveKey<GroupFieldModelOptions, 'children'>,
        LayoutOptions<K> {}
