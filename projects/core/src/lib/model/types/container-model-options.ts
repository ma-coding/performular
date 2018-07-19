import { LayoutOptions } from '../../handler/layout/types/layout-options';
import { AbstractModel } from '../abstract-model';
import { AbstractModelOptions } from './abstract-model-options';

export interface ContainerModelOptions
    extends AbstractModelOptions,
        LayoutOptions {
    children?: AbstractModel[];
}
