import { LayoutOptions } from '../../../layout/types/layout-options';
import { StructurOptions } from '../../../structur/types/structur-options';
import { TransformerOptions } from '../../../transformer/types/transformer-options';
import { RemoveKey } from '../../../utils/types/remove-key';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface GroupFieldOptions
    extends RemoveKey<AbstractFieldOptions, 'type'>,
        LayoutOptions,
        StructurOptions {
    transformer?: TransformerOptions;
}
