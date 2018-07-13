import { Abstract } from '../../fields/abstract/abstract';

export interface StructurState {
    parent: Abstract | undefined;
    children: Abstract[];
}
