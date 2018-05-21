import { Type } from '@angular/core';

import { IEffectOptions } from '../effects/models/effect-options.interface';
import { FieldType } from '../field/models/field.type';

export interface IMetaData<T> {
    meta: T;
    target: Type<any>;
}

export interface IMetaDatas<T> {
    [name: string]: IMetaData<T>;
}

export class MetadataStore {
    private static _validators: IMetaDatas<IEffectOptions> = {};
    private static _visibilitys: IMetaDatas<IEffectOptions> = {};
    private static _fields: { [name: string]: FieldType } = {};

    public static addField(name: string, target: FieldType): void {
        this._fields[name] = target;
    }

    public static getField(name: string): FieldType {
        const field: FieldType = this._fields[name];
        if (!field) {
            throw new Error('Unknown Field');
        }
        return field;
    }

    public static addValidator(name: string, metadata: IEffectOptions, target: Type<any>): void {
        this._validators[name] = this._buildMetadata(target, metadata);
    }

    public static getValidator(name: string): IMetaData<IEffectOptions> {
        return this._validators[name] || undefined;
    }

    public static addVisible(name: string, metadata: IEffectOptions, target: Type<any>): void {
        this._visibilitys[name] = this._buildMetadata(target, metadata);
    }

    public static getVisible(name: string): IMetaData<IEffectOptions> {
        return this._visibilitys[name] || undefined;
    }

    private static _buildMetadata<T>(target: Type<any>, metadata: T): IMetaData<T> {
        return { meta: metadata, target };
    }
}
