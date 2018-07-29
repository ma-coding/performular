import { AbstractModel } from '../abstract-model';
import { AbstractModelOptions } from './abstract-model-options';

export interface DisplayModelOptions<ATTRS = any>
    extends AbstractModelOptions<ATTRS> {
    children?: AbstractModel[];
    hideWhenNoChild?: boolean;
}
