import { Abstract } from '../fields/abstract/abstract';
import { Container } from '../fields/container/container';
import { ControlField } from '../fields/control-field/control-field';
import { GroupField } from '../fields/group-field/group-field';
import { ListField } from '../fields/list-field/list-field';
import { FrameworkType } from '../framework/types/framework-type';
import { JsonContainer } from './types/json-container';
import { JsonControl } from './types/json-control';
import { JsonGroup } from './types/json-grouo';
import { JsonList } from './types/json-list';
import { JsonSchemaOptions } from './types/json-schema-options';
import { JsonUnions } from './types/json-unions';

export class JsonSchema {
    public static create<T extends Abstract>(
        options: JsonSchemaOptions
    ): Abstract {
        switch (options.schema.type) {
            case FrameworkType.CONTAINER: {
                return this._createContainer(
                    options.schema as any,
                    options.value
                );
            }
            case FrameworkType.CONTROL: {
                return this._createControl(
                    options.schema as any,
                    options.value
                );
            }
            case FrameworkType.GROUP: {
                return this._createGroup(options.schema as any, options.value);
            }
            case FrameworkType.LIST: {
                return this._createList(options.schema as any, options.value);
            }
        }
    }

    private static _createControl(
        options: JsonControl,
        value: any
    ): ControlField {
        return new ControlField(<any>{
            ...options,
            value: value
        });
    }

    private static _createGroup(options: JsonGroup, value: any): GroupField {
        return new GroupField(<any>{
            ...options,
            children: options.children.map((child: JsonUnions) => {
                return this.create({
                    schema: child,
                    value: this._isContainer(child) ? value : value[child.id]
                });
            })
        });
    }

    private static _createContainer(
        options: JsonContainer,
        value: any
    ): Container {
        return new Container(<any>{
            ...options,
            children: options.children.map((child: JsonUnions) => {
                return this.create({
                    schema: child,
                    value: value
                });
            })
        });
    }

    private static _createList(options: JsonList, value: any): ListField {
        return new ListField(<any>{
            ...options,
            values: value,
            childGenerator: (val: any): Abstract => {
                return this.create({
                    schema: options.childDef,
                    value: val
                });
            }
        });
    }

    private static _isContainer(schema: JsonUnions): boolean {
        return schema.type === FrameworkType.CONTAINER;
    }
}
