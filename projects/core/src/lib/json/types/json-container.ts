import { ContainerOptions } from '../../fields/container/types/container-options';
import { FrameworkType } from '../../framework/types/framework-type';
import { RemoveKey } from '../../utils/types/remove-key';
import { JsonUnions } from './json-unions';

export interface JsonContainer extends RemoveKey<ContainerOptions, 'children'> {
    type: FrameworkType;
    children: JsonUnions[];
}
