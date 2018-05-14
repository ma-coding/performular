import { InjectionToken, Type } from '@angular/core';

import { IMetadataTarget, LoaderService } from '../loader.service';

export interface IConverterDecoration {
    id: string;
}

export const ConverterMetadataKey: string = '__PERFORMULAR_CONVERTER_META__';

export function Converter(decoration: IConverterDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(ConverterMetadataKey, decoration, target);
    };
}

export interface IOnConvert<B1 = any, B2 = any> {
    onConvert(binding: B1): B2;
}

export type ConverterType = Type<IOnConvert>;

export const ConverterToken: InjectionToken<ConverterType> =
    new InjectionToken('__PERFORMULAR_CONVERTER_TOKEN__');

export type ConverterSchema = ConverterType | string;

export class ConverterHandler {
    private _instance: IOnConvert;

    constructor(schema: ConverterSchema) {
        if (typeof schema === 'string') {
            const metadataTarget: IMetadataTarget | undefined =
                LoaderService.getFromString(schema, ConverterMetadataKey, ConverterToken);
            if (!metadataTarget) {
                throw new Error('Not Provided');
            }
            const instance: IOnConvert | undefined = LoaderService.get<IOnConvert>(metadataTarget.target);
            if (!instance) {
                throw new Error('Not Provided');
            }
            this._instance = instance;
        } else {
            const instance: IOnConvert | undefined =
                LoaderService.get<IOnConvert>(schema);
            if (!instance) {
                throw new Error('Not Provided');
            }
            this._instance = instance;
        }
    }

    public call(bindings: any): any {
        return this._instance.onConvert(bindings);
    }
}
