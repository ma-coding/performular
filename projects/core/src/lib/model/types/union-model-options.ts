import { ContainerModelOptions } from './container-model-options';
import { ControlFieldModelOptions } from './control-field-model-options';
import { GroupFieldModelOptions } from './group-field-model-options';
import { ListFieldModelOptions } from './list-field-model-options';

export type UnionModelOptions =
    | ControlFieldModelOptions
    | GroupFieldModelOptions
    | ListFieldModelOptions
    | ContainerModelOptions;
