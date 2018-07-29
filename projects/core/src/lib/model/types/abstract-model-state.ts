import { Modeler } from '../../handler/modeler/modeler';
import { AbstractModel } from '../abstract-model';
import { ModelType } from '../../builder/types/model-type';

export interface AbstractModelState<ATTRS = any> {
    id: string;
    uuid: string;
    type: ModelType;
    model: Modeler;
    attrs: ATTRS;
    parent?: AbstractModel | undefined;
    children: AbstractModel[];
    hidden: boolean;
    instance?: any;
    elementRef?: HTMLElement;
}
