import { EffectsOptions } from '../../effects/types/effects-options';
import { FrameworkOptions } from '../../framework/types/framework-options';
import { IdentificationOptions } from '../../identification/types/identification-options';
import { PositioningOptions } from '../../positioning/types/positioning-options';
import { StructurOptions } from '../../structur/types/structur-options';
import { ValueOptions } from '../../value/types/value-options';

export interface FacadeOptions
    extends IdentificationOptions,
        EffectsOptions,
        ValueOptions,
        StructurOptions,
        FrameworkOptions,
        PositioningOptions {}
