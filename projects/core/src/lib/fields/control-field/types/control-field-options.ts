import { PositioningItemOptions } from '../../../positioning/types/positioning-item-options';
import { ValueOptions } from '../../../value/types/value-options';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface ControlFieldOptions
    extends AbstractFieldOptions,
        ValueOptions,
        PositioningItemOptions {}
