import { Layout } from '../../handler/layout';
import { AbstractModelState } from './abstract-model-state';

export interface ContainerModelState extends AbstractModelState {
    layout: Layout;
}
