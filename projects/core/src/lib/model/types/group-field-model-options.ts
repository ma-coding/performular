import { LayoutOptions } from '../../handler/layout/types/layout-options';
import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface GroupFieldModelOptions
    extends AbstractFieldModelOptions,
        LayoutOptions {
    children: AbstractModel[];
}
