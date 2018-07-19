import { AbstractModel } from '../abstract-model';
import { AbstractModelOptions } from './abstract-model-options';

export interface ContainerModelOptions extends AbstractModelOptions {
    children?: AbstractModel[];
}
