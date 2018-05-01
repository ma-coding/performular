import { ElementRef } from '@angular/core';

import { ComponentLoader, IComponentDefinition } from '../../loaders/component-loader';
import { ConverterLoader, IConverterDefinition } from '../../loaders/converter-loader';
import { RemoveKeys } from '../../misc/remove-keys';
import { AbstractSchema } from './abstract-schema';

export interface IAbstractSchemaNonInitState {
    uuid: string;
    hidden: boolean;
    instance?: any;
    elementRef?: ElementRef;
    parent?: AbstractSchema<any>;
    component: ComponentLoader;
    converter: ConverterLoader<any, any, any>;
}

export interface IAbstractSchemaState<BindingsType> extends IAbstractSchemaNonInitState {
    id: string;
    children: AbstractSchema<any>[];
    bindings: BindingsType;
}

export interface IAbstractSchemaInitState<BindingsType>
    extends RemoveKeys<IAbstractSchemaState<BindingsType>, keyof IAbstractSchemaNonInitState> {
    component: IComponentDefinition;
    converter?: IConverterDefinition<BindingsType>;
}
