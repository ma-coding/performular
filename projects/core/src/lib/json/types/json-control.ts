import { ControlFieldOptions } from '../../fields/control-field/types/control-field-options';
import { FrameworkType } from '../../framework/types/framework-type';
import { RemoveKey } from '../../utils/types/remove-key';

export interface JsonControl extends RemoveKey<ControlFieldOptions, 'value'> {
    type: FrameworkType;
}
