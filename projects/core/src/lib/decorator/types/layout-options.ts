import { LayoutModelOptions } from '../../model/types/layout-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { ContainerOptions } from './container-options';
import { ItemOptions } from './item-options';

export interface LayoutOptions<K extends string>
    extends RemoveKey<LayoutModelOptions, 'children'> {
    children: Array<K | ContainerOptions<K> | ItemOptions<K>>;
}
