import { ControlFieldModelOptions } from '../../model/types/control-field-model-options';
import { RemoveKey } from '../../util/types/remove-key';

export interface ControlOptions
    extends RemoveKey<ControlFieldModelOptions, 'value' | 'id'> {}
