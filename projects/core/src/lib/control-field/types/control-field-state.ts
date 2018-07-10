import { AbstractFieldState } from '../../abstract-field/types/abstract-field-state';

export interface ControlFieldState extends AbstractFieldState {
    defaultValue: any;
    value: any;
}
