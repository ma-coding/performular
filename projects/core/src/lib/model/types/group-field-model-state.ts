import { Layout } from '../../handler/layout';
import { AbstractFieldModelState } from './abstract-field-model-state';

export interface GroupFieldModelState extends AbstractFieldModelState {
    layout: Layout;
}
