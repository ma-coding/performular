import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface ListFieldModelOptions extends AbstractFieldModelOptions {
    childGenerator: (value: any) => AbstractModel;
    values: any[];
}
