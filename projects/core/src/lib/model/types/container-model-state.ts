import { AbstractModelState } from './abstract-model-state';

export interface ContainerModelState<ATTRS = any>
    extends AbstractModelState<ATTRS> {
    hideWhenNoChild: boolean;
}
