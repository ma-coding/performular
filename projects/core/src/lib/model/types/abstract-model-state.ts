import { Modeler } from '../../handler/modeler/modeler';
import { AbstractModel } from '../abstract-model';

export interface AbstractModelState<ATTRS = any> {
    id: string;
    uuid: string;
    model: Modeler;
    attrs: ATTRS;
    parent?: AbstractModel | undefined;
    children: AbstractModel[];
    hidden: boolean;
    instance?: any;
    elementRef?: HTMLElement;
}
