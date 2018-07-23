import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface ListFieldModelOptions<ATTRS = any>
    extends AbstractFieldModelOptions<ATTRS> {
    childGenerator: (value: any) => AbstractModel;
    values: any[];
}
