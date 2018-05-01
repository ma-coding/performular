import { InjectionToken, Type } from '@angular/core';

import { AbstractSchema } from '../schemas/abstract/abstract-schema';
import { AbstractLoader } from './abstract-loader';

/**
 * Interface that gives the Form Component access to the AbstractSchema (see {@link AbstractSchema})
 * @export
 */
export interface IOnInitField<T extends AbstractSchema<any>> {
    performularOnInit(field: T): void;
}

export const ComponentLoaderInjectionToken: InjectionToken<Type<IOnInitField<any>>> =
    new InjectionToken<Type<IOnInitField<any>>>('__PERFORMULAR_COMPONENT_LOADER_INJECTION_TOKEN__');

export const ComponentLoaderDecorationKey: string =
    '__PERFORMULAR_COMPONENT_LOADER_DECORATION_KEY__';

export type IComponentDefinition = Type<IOnInitField<any>> | string;

/**
 * Class that handle the loading of the Component from
 * several Componentdefinitions (see {@link IComponentDefinition}).
 */
export class ComponentLoader extends AbstractLoader<IOnInitField<any>> {
    constructor(
        definition: IComponentDefinition
    ) {
        super(
            ComponentLoaderDecorationKey,
            ComponentLoaderInjectionToken,
            definition
        );
    }
}
