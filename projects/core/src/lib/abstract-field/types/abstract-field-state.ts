import { AbstractField } from '../abstract-field';

export interface AbstractFieldState {
    name: string;
    uuid: string;
    parent: AbstractField | undefined;
}
