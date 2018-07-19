import { ContainerModelOptions } from '../../model/types/container-model-options';
import { RemoveKey } from '../../util/types/remove-key';

export interface ContainerOptions
    extends RemoveKey<ContainerModelOptions, 'children' | 'id'> {}
