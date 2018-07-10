import { AbstractField } from '../../abstract-field/abstract-field';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface GroupFieldOptions extends AbstractFieldOptions {
    children: AbstractField[];
}
