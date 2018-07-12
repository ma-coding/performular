import { Abstract } from '../../fields/abstract/abstract';

export interface RunContext {
    checked: boolean;
    checkedFields: Abstract[];
    field: Abstract;
}
