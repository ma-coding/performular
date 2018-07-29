import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface GroupFieldModelOptions<ATTRS = any>
    extends AbstractFieldModelOptions<ATTRS> {
    children: AbstractModel[];
}
