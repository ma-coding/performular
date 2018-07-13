import { LayoutOptions } from '../../../layout/types/layout-options';
import { StructurOptions } from '../../../structur/types/structur-options';
import { TransformerOptions } from '../../../transformer/types/transformer-options';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface GroupFieldOptions
    extends AbstractFieldOptions,
        LayoutOptions,
        StructurOptions {
    transformer?: TransformerOptions;
}
