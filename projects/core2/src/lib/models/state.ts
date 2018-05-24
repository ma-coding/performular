import { IAbstractable } from '../schemas/abstract';
import { MapType } from './misc';

export interface IFrameworkState<F, A> {
    parent?: IAbstractable;
    field: F;
    attrs: A;
}

export interface IContainerState {
    children: IAbstractable[];
}

export interface IGroupState {
    children: MapType<IAbstractable>;
}

export interface IControlState {
    focus: boolean;
}
