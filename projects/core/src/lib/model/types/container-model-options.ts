import { AbstractModel } from '../abstract-model';
import { AbstractModelOptions } from './abstract-model-options';

export interface ContainerModelOptions<ATTRS = any>
    extends AbstractModelOptions<ATTRS> {
    children?: AbstractModel[];
}
