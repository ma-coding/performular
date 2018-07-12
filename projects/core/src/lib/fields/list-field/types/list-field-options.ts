import { PositioningOptions } from '../../../positioning/types/positioning-options';
import { TransformerOptions } from '../../../transformer/types/transformer-options';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface ListFieldOptions
    extends AbstractFieldOptions,
        PositioningOptions {
    value: any[];
    childDef: any;
    transformer?: TransformerOptions;
}
