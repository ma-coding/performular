import { AbstractModel } from '../../model/abstract-model';

export interface RunContext {
    checked: boolean;
    checkedFields: AbstractModel[];
    field: AbstractModel;
}
