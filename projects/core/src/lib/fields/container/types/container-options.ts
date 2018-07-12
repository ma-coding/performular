import { PositioningOptions } from '../../../positioning/types/positioning-options';
import { Abstract } from '../../abstract/abstract';
import { AbstractOptions } from '../../abstract/types/abstract-options';

export interface ContainerOptions extends AbstractOptions, PositioningOptions {
    children: Abstract[];
}
