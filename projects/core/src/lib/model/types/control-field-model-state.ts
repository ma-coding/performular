import { AbstractFieldModelState } from './abstract-field-model-state';

export interface ControlFieldModelState<ATTRS = any>
    extends AbstractFieldModelState<ATTRS> {
    defaultValue: any;
}
