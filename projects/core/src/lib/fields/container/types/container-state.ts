import { LayoutState } from '../../../layout/types/layout-state';
import { AbstractState } from '../../abstract/types/abstract-state';

export interface ContainerState extends AbstractState, LayoutState { }
