import { AbstractField } from '../../abstract-field/abstract-field';
import { AbstractFieldState } from '../../abstract-field/types/abstract-field-state';

export interface ListFieldState extends AbstractFieldState {
    children: AbstractField[];
    childGenerator: (value: any) => AbstractField;
}
