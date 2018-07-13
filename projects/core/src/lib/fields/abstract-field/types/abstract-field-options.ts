import { EffectsOptions } from '../../../effects/types/effects-options';
import { ValueOptions } from '../../../value/types/value-options';
import { AbstractOptions } from '../../abstract/types/abstract-options';

export interface AbstractFieldOptions extends AbstractOptions, EffectsOptions, ValueOptions { }
