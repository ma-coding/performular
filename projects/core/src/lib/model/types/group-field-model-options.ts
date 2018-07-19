import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface GroupFieldModelOptions extends AbstractFieldModelOptions {
    children: AbstractModel[];
}
