import { PositioningOptions } from '../../../positioning/types/positioning-options';
import { TransformerOptions } from '../../../transformer/types/transformer-options';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';
import { Abstract } from '../../abstract/abstract';

export interface GroupFieldOptions
    extends AbstractFieldOptions,
        PositioningOptions {
    children: Abstract[];
    transformer?: TransformerOptions;
}
