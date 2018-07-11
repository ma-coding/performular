import { AbstractField } from '../abstract-field';

export interface AbstractFieldState {
    id: string;
    uuid: string;
    parent: AbstractField | undefined;
}
