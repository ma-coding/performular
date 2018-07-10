import { Transformer } from '../../transformer/transformer';
import { AbstractField } from '../abstract-field';

export interface AbstractFieldState {
    name: string;
    uuid: string;
    transformer: Transformer;
    parent: AbstractField | undefined;
}
