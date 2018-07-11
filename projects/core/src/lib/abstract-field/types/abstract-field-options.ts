import { EffectsOptions } from '../../effects/types/effects-options';
import { TransformerOptions } from '../../transformer/types/transformer-options';

export interface AbstractFieldOptions extends EffectsOptions {
    name: string;
    transformer?: TransformerOptions;
    effects?: EffectsOptions;
}
