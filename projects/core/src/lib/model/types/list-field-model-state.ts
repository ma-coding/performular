import { AbstractModel } from '../abstract-model';
import { AbstractFieldModelState } from './abstract-field-model-state';

export interface ListFieldModelState extends AbstractFieldModelState {
    childGenerator: (value: any) => AbstractModel;
}
