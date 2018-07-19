import { JsonUnionOptions } from '../../builder/types/json-unions-options';
import { AbstractFieldModelState } from './abstract-field-model-state';

export interface ListFieldModelState extends AbstractFieldModelState {
    childModel: JsonUnionOptions;
}
