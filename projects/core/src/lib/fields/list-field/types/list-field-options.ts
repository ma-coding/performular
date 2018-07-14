import { LayoutOptions } from '../../../layout/types/layout-options';
import { TransformerOptions } from '../../../transformer/types/transformer-options';
import { RemoveKey } from '../../../utils/types/remove-key';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';
import { Abstract } from '../../abstract/abstract';

export interface ListFieldOptions
    extends RemoveKey<AbstractFieldOptions, 'type'>,
        LayoutOptions {
    transformer?: TransformerOptions;
    values?: any[];
    childGenerator: (value: any) => Abstract;
}
