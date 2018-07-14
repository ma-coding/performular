import { RemoveKey } from '../../../utils/types/remove-key';
import { ValueOptions } from '../../../value/types/value-options';
import { AbstractFieldOptions } from '../../abstract-field/types/abstract-field-options';

export interface ControlFieldOptions
    extends RemoveKey<AbstractFieldOptions, 'type'>,
        ValueOptions {}
