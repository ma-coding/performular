import { JsonUnionOptions } from '../../builder/types/json-unions-options';
import { LayoutOptions } from '../../handler/layout/types/layout-options';
import { InstanceDef } from '../../util/types/instance-def';
import { AbstractFieldModelOptions } from './abstract-field-model-options';

export interface ListFieldModelOptions
    extends AbstractFieldModelOptions,
        LayoutOptions {
    childModel: JsonUnionOptions;
    values: any[];
}
