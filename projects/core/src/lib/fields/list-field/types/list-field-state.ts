import { LayoutState } from '../../../layout/types/layout-state';
import { AbstractFieldState } from '../../abstract-field/types/abstract-field-state';
import { Abstract } from '../../abstract/abstract';

export interface ListFieldState extends AbstractFieldState, LayoutState {
    childGenerator: (value: any) => Abstract;
}
