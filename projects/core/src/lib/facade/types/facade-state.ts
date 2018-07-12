import { EffectsState } from '../../effects/types/effects-state';
import { FrameworkState } from '../../framework/types/framework-state';
import { IdentificationState } from '../../identification/types/identification-state';
import { PositioningState } from '../../positioning/types/positioning-state';
import { StructurState } from '../../structur/types/structur-state';
import { ValueState } from '../../value/types/value-state';

export interface FacadeState
    extends IdentificationState,
        EffectsState,
        ValueState,
        StructurState,
        FrameworkState,
        PositioningState {}
