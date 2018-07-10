import { AbstractField } from '../../abstract-field/abstract-field';

export interface RunContext {
    checked: boolean;
    checkedFields: AbstractField[]; // Todo: Add right Field Type
    field: AbstractField;
}
