import { ContainerModelOptions } from '../../model/types/container-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { ItemOptions } from './item-options';
import { LayoutOptions } from './layout-options';

export interface ContainerOptions<K extends string>
    extends RemoveKey<ContainerModelOptions, 'children'> {
    children: Array<
        K | LayoutOptions<K> | ItemOptions<K> | ContainerOptions<K>
    >;
}
