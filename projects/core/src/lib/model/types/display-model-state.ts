import { AbstractModelState } from './abstract-model-state';

export interface DisplayModelState<ATTRS = any>
    extends AbstractModelState<ATTRS> {
    hideWhenNoChild: boolean;
}
