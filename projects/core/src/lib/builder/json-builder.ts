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

export type IndexType = number | string;

// @dynamic
export class JsonBuilder {
    public static build(
        options: JsonUnionOptions,
        value: any,
        paths: IndexType[] = []
    ): any {
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
                return modeler.build(
                    this._buildControlOptions(opt, value, paths)
                );
            }
            case ModelType.GROUP: {
                return modeler.build(
                    this._buildGroupOptions(opt, value, paths)
                );
            }
            case ModelType.CONTAINER: {
                return modeler.build(
                    this._buildContainerOptions(opt, value, paths)
                );
            }
            case ModelType.LIST: {
                return modeler.build(this._buildListOptions(opt, value, paths));
            }
            case ModelType.LAYOUT: {
                return modeler.build(<any>this._buildLayoutOptions(opt, value));
            }
            case ModelType.ITEM: {
                return modeler.build(<any>this._buildItemOptions(opt, value));
            }
        }
    }

    private static _getValue(value: any, path: IndexType[]): any {
        return path.reduce((prev: any, current: IndexType) => {
            return prev && prev[current] !== null && prev[current] !== undefined
                ? prev[current]
                : null;
        }, value);
    }

    private static _buildControlOptions(
        options: JsonControlOptions,
        value: any,
        paths: IndexType[]
    ): ControlFieldModelOptions {
        return {
            ...this._removeType(options),
            value: this._getValue(value, [...paths, options.id])
        };
    }

    private static _buildGroupOptions(
        options: JsonGroupOptions,
        value: any,
        paths: IndexType[]
    ): GroupFieldModelOptions {
        return {
            ...this._removeType(options),
            children: options.children.map((child: JsonUnionOptions) => {
                return this.build(child, value, [...paths, options.id]);
            })
        };
    }

    private static _buildListOptions(
        options: JsonListOptions,
        value: any,
        paths: IndexType[]
    ): ListFieldModelOptions {
        return {
            ...(<RemoveKey<JsonListOptions, 'childModel' | 'type'>>options),
            childGenerator: (val: any): AbstractModel =>
                JsonBuilder.build(options.childModel, val),
            values: this._getValue(value, [...paths, options.id]) || []
        };
    }

    private static _buildContainerOptions(
        options: JsonContainerOptions,
        value: any,
        paths: IndexType[]
    ): ContainerModelOptions {
        return {
            ...this._removeType(options),
            children: (options.children || []).map(
                (childOptions: JsonUnionOptions) => {
                    return this.build(childOptions, value, paths);
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
