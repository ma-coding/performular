import { AbstractField } from '../../abstract-field/abstract-field';
import { AbstractFieldState } from '../../abstract-field/types/abstract-field-state';

export interface GroupFieldState extends AbstractFieldState {
    children: AbstractField[];
}
