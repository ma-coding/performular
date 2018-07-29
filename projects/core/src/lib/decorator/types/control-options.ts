import { ControlFieldModelOptions } from '../../model/types/control-field-model-options';
import { RemoveKey } from '../../util/types/remove-key';

export interface ControlOptions<ATTRS = any>
    extends RemoveKey<ControlFieldModelOptions<ATTRS>, 'value' | 'id'> {}
