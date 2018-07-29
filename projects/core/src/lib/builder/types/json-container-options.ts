import { ContainerModelOptions } from '../../model/types/container-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { JsonAbstractModelOptions } from './json-abstract-model-options';
import { JsonUnionOptions } from './json-unions-options';

export interface JsonContainerOptions
    extends JsonAbstractModelOptions,
        RemoveKey<ContainerModelOptions, 'children'> {
    children?: JsonUnionOptions[];
}
