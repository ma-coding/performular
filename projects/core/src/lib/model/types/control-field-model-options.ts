import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface ControlFieldModelOptions<ATTRS = any>
    extends AbstractFieldModelOptions<ATTRS> {
    value?: any;
    defaultValue?: any;
}
