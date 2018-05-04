import { InjectionToken, Type } from '@angular/core';

import { AbstractSchema } from '../schemas/abstract/abstract-schema';
import { AbstractLoader } from './abstract-loader';

export interface IOnGenerate<ReturnType, EventType, ParamsType> {
    performularOnGenerate(event: EventType, params?: ParamsType): ReturnType;
}

export const GeneratorLoaderInjectionToken: InjectionToken<Type<IOnGenerate<any, any, any>>> =
    new InjectionToken<Type<IOnGenerate<any, any, any>>>('__PERFORMULAR_GENERATOR_LOADER_INJECTION_TOKEN__');

export const GeneratorLoaderDecorationKey: string =
    '__PERFORMULAR_GENERATOR_LOADER_DECORATION_KEY__';

export interface IGeneratorDefinition<ReturnType, EventType, ParamsType> {
    generator: string | Type<IOnGenerate<ReturnType, EventType, ParamsType>>;
    params?: ParamsType;
}

export class GeneratorLoader<ReturnType, EventType, ParamsType>
    extends AbstractLoader<IOnGenerate<ReturnType, EventType, ParamsType>> {

    protected _params: ParamsType | undefined;
    protected _instance: IOnGenerate<ReturnType, EventType, ParamsType>;

    constructor(
        definition: IGeneratorDefinition<ReturnType, EventType, ParamsType>
    ) {
        super(
            GeneratorLoaderDecorationKey,
            GeneratorLoaderInjectionToken,
            definition.generator
        );
        this._params = definition.params;
        this._instance = this._getInstanceFromTarget(this._target);
    }

    public callGenerator(event: EventType): ReturnType {
        return this._instance.performularOnGenerate(event, this._params);
    }
}

/* CHILD GENERATOR */
export interface IChildGeneratorEvent {
    value: any;
}

export type IOnChildGenerate<ParamsType> = IOnGenerate<AbstractSchema<any>, IChildGeneratorEvent, ParamsType>;

export type IChildGeneratorDefinition<ParamsType> =
    IGeneratorDefinition<AbstractSchema<any>, IChildGeneratorEvent, ParamsType>;

export class ChildGeneratorLoader<ParamsType>
    extends GeneratorLoader<AbstractSchema<any>, IChildGeneratorEvent, ParamsType> {
}
