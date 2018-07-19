import { JsonUnionOptions } from '../../builder/types/json-unions-options';
import { Layout } from '../../handler/layout';
import { AbstractFieldModelState } from './abstract-field-model-state';

export interface ListFieldModelState extends AbstractFieldModelState {
    childModel: JsonUnionOptions;
    layout: Layout;
}
