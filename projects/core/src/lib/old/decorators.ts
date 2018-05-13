import { Type } from '@angular/core';

import 'reflect-metadata';

export interface IAbstractDecoration {
    id: string;
}

export interface IAbstractMetadata extends IAbstractDecoration {
    target: Type<any>;
}

export type IConverterDecoration = IAbstractDecoration;

export interface IConverterMetadata extends IConverterDecoration, IAbstractMetadata { }

export const CONVERTER_METADATA: string = '__CONVERTER_METADATA_PERFORMULAR__';

export function Converter(decoration: IConverterDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(
            CONVERTER_METADATA, {
                ...decoration,
                target: target
            },
            target
        );
    };
}

export enum SchemaType {
    Layout,
    Control,
    Array,
    Group
}

export interface ISchemaDecoration extends IAbstractDecoration {
    type: SchemaType;
}

export interface ISchemaMetadata extends ISchemaDecoration, IAbstractMetadata {
}

export const SCHEMA_METADATA: string = '__SCHEMA_METADATA_PERFORMULAR__';

export function Schema(decoration: ISchemaDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(
            SCHEMA_METADATA, {
                ...decoration,
                target: target
            },
            target
        );
    };
}

export enum TriggerStrategy {
    Allways,
    Self
}

export interface ITriggerDecoration extends IAbstractDecoration {
    strategy: TriggerStrategy;
}

export interface ITriggerMetadata extends ITriggerDecoration, IAbstractMetadata {
}

export const TRIGGER_METADATA: string = '__TRIGGER_METADATA_PERFORMULAR__';

export function Trigger(decoration: ITriggerDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(
            TRIGGER_METADATA, {
                ...decoration,
                target: target
            },
            target
        );
    };
}
