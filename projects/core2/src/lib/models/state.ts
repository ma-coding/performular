import { AbstractSchema } from '../schemas/abstract';
import { MapType } from './misc';

export interface IFrameworkState<F, A> {
    field: F;
    attrs: A;
}

export interface IContainerState {
    autoHide: boolean;
    children: AbstractSchema[];
}

export interface IGroupState {
    children: MapType<AbstractSchema>;
}

export interface IControlState {
    focus: boolean;
}
