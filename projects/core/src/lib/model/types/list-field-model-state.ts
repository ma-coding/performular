import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelState } from './abstract-field-model-state';

export interface ListFieldModelState<ATTRS = any>
    extends AbstractFieldModelState<ATTRS> {
    childGenerator: (value: any) => AbstractModel;
}
