import { AbstractFieldModel } from '../../model/abstract-field-model';

export interface RunContext {
    checked: boolean;
    checkedFields: AbstractFieldModel[];
    field: AbstractFieldModel;
}
