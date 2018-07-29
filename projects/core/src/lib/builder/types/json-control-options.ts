import { ControlFieldModelOptions } from '../../model/types/control-field-model-options';
import { RemoveKey } from '../../util/types/remove-key';
import { JsonAbstractModelOptions } from './json-abstract-model-options';

export interface JsonControlOptions
    extends JsonAbstractModelOptions,
        RemoveKey<ControlFieldModelOptions, 'value'> {}
