import { Modeler } from '../../handler/modeler/modeler';
import { AbstractModel } from '../abstract-model';

export interface AbstractModelState {
    id: string;
    uuid: string;
    model: Modeler;
    attrs: any;
    parent?: AbstractModel | undefined;
    children: AbstractModel[];
    hidden: boolean;
    instance?: any;
    elementRef?: HTMLElement;
}
