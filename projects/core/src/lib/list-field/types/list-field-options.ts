import { AbstractField } from '../../abstract-field/abstract-field';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface ListFieldOptions extends AbstractFieldOptions {
    values: any[];
    childGenerator: (value: any) => AbstractField;
}
