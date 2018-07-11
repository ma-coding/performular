import { EffectsOptions } from '../../effects/types/effects-options';
import { TransformerOptions } from '../../transformer/types/transformer-options';

export interface AbstractOptions {
    transformer?: TransformerOptions;
    effects?: EffectsOptions;
}
