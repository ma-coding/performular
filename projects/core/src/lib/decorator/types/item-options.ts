import { ItemModelOptions } from '../../model/types/item-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { ContainerOptions } from './container-options';
import { LayoutOptions } from './layout-options';

export interface ItemOptions<K extends string>
    extends RemoveKey<ItemModelOptions, 'child'> {
    child: K | ContainerOptions<K> | LayoutOptions<K>;
}
