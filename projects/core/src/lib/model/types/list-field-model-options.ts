import { JsonUnionOptions } from '../../builder/types/json-unions-options';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface ListFieldModelOptions extends AbstractFieldModelOptions {
    childModel: JsonUnionOptions;
    values: any[];
}
