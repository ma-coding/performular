import { InjectionToken, Type } from '@angular/core';

import { AbstractLoader } from './abstract-loader';

export interface IOnConvert<Type1, Type2, ParamsType> {
    performularOnConvert(data: Type1, params?: ParamsType): Type2;
}

export const ConverterLoaderInjectionToken: InjectionToken<Type<IOnConvert<any, any, any>>> =
    new InjectionToken<Type<IOnConvert<any, any, any>>>('__PERFORMULAR_CONVERTER_LOADER_INJECTION_TOKEN__');

export const ConverterLoaderDecorationKey: string =
    '__PERFORMULAR_CONVERTER_LOADER_DECORATION_KEY__';

export interface IConverterDefinition<Type2 = any, ParamsType = any> {
    converter: string | Type<IOnConvert<any, any, ParamsType>>;
    params?: ParamsType;
}

export class ConverterLoader<Type1, Type2, ParamsType>
    extends AbstractLoader<IOnConvert<Type1, Type2, ParamsType>> {

    protected _params: ParamsType | undefined;
    protected _instance: IOnConvert<Type1, Type2, ParamsType>;

    constructor(
        definition: IConverterDefinition<Type2, ParamsType>
    ) {
        super(
            ConverterLoaderDecorationKey,
            ConverterLoaderInjectionToken,
            definition.converter
        );
        this._params = definition.params;
        this._instance = this._getInstanceFromTarget(this._target);
    }

    public callConverter(data: Type1): Type2 {
        return this._instance.performularOnConvert(data, this._params);
    }
}
