import { Framework } from '../framework/framework';
import { Modeler } from '../handler/modeler/modeler';
import { AbstractModel } from '../model/abstract-model';
import { ContainerModelOptions } from '../model/types/container-model-options';
import { ControlFieldModelOptions } from '../model/types/control-field-model-options';
import { GroupFieldModelOptions } from '../model/types/group-field-model-options';
import { ItemModelOptions } from '../model/types/item-model-options';
import { LayoutModelOptions } from '../model/types/layout-model-options';
import { ListFieldModelOptions } from '../model/types/list-field-model-options';
import { cloneDeep } from '../util/clone-deep';
import { InstanceDef } from '../util/types/instance-def';
import { RemoveKey } from '../util/types/remove-key';
import { JsonContainerOptions } from './types/json-container-options';
import { JsonControlOptions } from './types/json-control-options';
import { JsonGroupOptions } from './types/json-group-options';
import { JsonItemOptions } from './types/json-item-options';
import { JsonLayoutOptions } from './types/json-layout-options';
import { JsonListOptions } from './types/json-list-options';
import { JsonUnionOptions } from './types/json-unions-options';
import { ModelType } from './types/model-type';

export class JsonBuilder {
    public static build(options: JsonUnionOptions, value: any): AbstractModel {
        const opt: any = cloneDeep(options);
        const model: string | InstanceDef<any> =
            options.type === ModelType.LAYOUT
                ? Framework.getLayoutModel()
                : options.type === ModelType.ITEM
                    ? Framework.getItemModel()
                    : (<any>options).model;
        const modeler: Modeler = new Modeler(model);
        switch (options.type) {
            case ModelType.CONTROL: {
                return modeler.build(this._buildControlOptions(opt, value));
            }
            case ModelType.GROUP: {
                return modeler.build(this._buildGroupOptions(opt, value));
            }
            case ModelType.CONTAINER: {
                return modeler.build(this._buildContainerOptions(opt, value));
            }
            case ModelType.LIST: {
                return modeler.build(this._buildListOptions(opt, value));
            }
            case ModelType.LAYOUT: {
                return modeler.build(<any>this._buildLayoutOptions(opt, value));
            }
            case ModelType.ITEM: {
                return modeler.build(<any>this._buildItemOptions(opt, value));
            }
        }
    }

    private static _buildControlOptions(
        options: JsonControlOptions,
        value: any
    ): ControlFieldModelOptions {
        return {
            ...this._removeType(options),
            value: value && value[options.id] ? value[options.id] : value
        };
    }

    private static _buildGroupOptions(
        options: JsonGroupOptions,
        value: any
    ): GroupFieldModelOptions {
        return {
            ...this._removeType(options),
            children: Object.keys(options.children).map((id: string) => {
                return this.build(
                    <any>{
                        id,
                        ...options.children[id]
                    },
                    options.children[id].type === ModelType.CONTAINER
                        ? value
                        : value
                            ? value[id]
                            : null
                );
            })
        };
    }

    private static _buildListOptions(
        options: JsonListOptions,
        value: any
    ): ListFieldModelOptions {
        return {
            ...this._removeType(options),
            values: value || []
        };
    }

    private static _buildContainerOptions(
        options: JsonContainerOptions,
        value: any
    ): ContainerModelOptions {
        return {
            ...this._removeType(options),
            children: (options.children || []).map(
                (childOptions: JsonUnionOptions) => {
                    return this.build(childOptions, value);
                }
            )
        };
    }

    private static _buildLayoutOptions(
        options: JsonLayoutOptions,
        value: any
    ): LayoutModelOptions {
        return {
            ...this._removeType(options),
            children: (options.children || []).map(
                (childOptions: JsonUnionOptions) => {
                    return this.build(childOptions, value);
                }
            )
        };
    }

    private static _buildItemOptions(
        options: JsonItemOptions,
        value: any
    ): ItemModelOptions {
        return {
            ...this._removeType(options),
            child: this.build(options.child, value)
        };
    }

    private static _removeType<T extends JsonUnionOptions>(
        options: T
    ): RemoveKey<T, 'type'> {
        delete options.type;
        const opt: RemoveKey<T, 'type'> = options;
        return opt;
    }
}
