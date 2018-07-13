import { EffectsState } from '../../../effects/types/effects-state';
import { ValueState } from '../../../value/types/value-state';
import { AbstractState } from '../../abstract/types/abstract-state';

export interface AbstractFieldState extends AbstractState, EffectsState, ValueState { }
