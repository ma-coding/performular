import { InjectionToken, Type } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    CONVERTER_METADATA,
    IAbstractMetadata,
    IConverterMetadata,
    ISchemaMetadata,
    ITriggerMetadata,
    SCHEMA_METADATA,
    TRIGGER_METADATA,
    TriggerStrategy,
} from './decorators';
import { createObservable, flatten, MaybeObservable } from './helpers';
import { LoaderService } from './loader.service';
import { AbstractSchema, FieldSchema, ITriggerSchema, TriggerAction } from './schemas';

/**
 * Abstract Class that manages the mapping from Decorated Class to Injectable Elements.
 * @export
 */
export abstract class AbstractLoader<DefinitionType, MetadataType extends IAbstractMetadata> {

    get target(): Type<DefinitionType> {
        return this._target;
    }

    get metadata(): MetadataType {
        return this._metadata;
    }

    /**
     * Member that holds the key for the metadata.
     */
    protected _metadataKey: string;

    /**
     * Member that holds the Injectiontoken for DI.
     */
    protected _injectionToken: InjectionToken<Type<DefinitionType>>;

    /**
     * Member that holds the target class that is Injectable.
     */
    protected _target: Type<DefinitionType>;

    /**
     * Member that holds the registerd metadata.
     */
    protected _metadata: MetadataType;

    constructor(
        metadataKey: string,
        injectionToken: InjectionToken<Type<DefinitionType>>,
        definition: string
    ) {
        this._metadataKey = metadataKey;
        this._injectionToken = injectionToken;
        this._metadata = this._getMetadata(definition);
        this._target = this._metadata.target;
    }

    protected _injectInstance(target: Type<DefinitionType>): DefinitionType {
        if (!LoaderService.injector) {
            throw new Error('NO INJECTOR OR INJECTIONTOKEN FOUND');
        }
        const instance: DefinitionType | undefined = LoaderService.injector.get<DefinitionType>(target, undefined);
        if (!instance) {
            throw new Error('NOT INJECTABLE');
        }
        return instance;
    }

    private _getMetadata(defintion: string): MetadataType {
        if (!this._injectionToken || !LoaderService.injector) {
            throw new Error('NO INJECTOR OR INJECTIONTOKEN FOUND');
        }
        const metadata: MetadataType | undefined =
            flatten<Type<DefinitionType>>(LoaderService.injector.get<Type<DefinitionType>[][]>(this._injectionToken, []))
                .map((def: Type<DefinitionType>) => this._getMetadataFromTarget(def))
                .find((deco: MetadataType) => {
                    return defintion === deco.id;
                });

        if (!metadata) {
            throw new Error('NO METADATA FOUND');
        }
        return metadata;
    }

    private _getMetadataFromTarget(target: Function): MetadataType {
        const metadata: MetadataType = Reflect.getMetadata(this._metadataKey, target);
        if (!metadata) {
            throw new Error('NO DECORATION');
        }
        return metadata;
    }

}

export interface IOnConvert<Type1 = any, Type2 = any> {
    convert(data: Type1): Type2;
}

export const ConverterLoaderInjectionToken: InjectionToken<Type<IOnConvert>> =
    new InjectionToken<Type<IOnConvert>>('__CONVERTER_INJECTION_PERFORMULAR__');

export class ConverterLoader extends AbstractLoader<IOnConvert, IConverterMetadata> {
    protected _instance: IOnConvert;

    constructor(
        definition: string
    ) {
        super(
            CONVERTER_METADATA,
            ConverterLoaderInjectionToken,
            definition
        );
        this._instance = this._injectInstance(this._target);
    }

    public callConverter(data: any): any {
        return this._instance.convert(data);
    }
}

export interface IOnSchemaInit {
    onSchemaInit(schema: AbstractSchema): void;
}

export const SchemaLoaderInjectionToken: InjectionToken<Type<IOnSchemaInit>> =
    new InjectionToken<Type<IOnSchemaInit>>('__SCHEMA_INJECTION_PERFORMULAR__');

export class SchemaLoader extends AbstractLoader<IOnSchemaInit, ISchemaMetadata> {

    constructor(
        definition: string
    ) {
        super(
            SCHEMA_METADATA,
            SchemaLoaderInjectionToken,
            definition
        );
    }

}

export interface IOnTrigger {
    trigger(field: FieldSchema, params: any): MaybeObservable<boolean>;
}

export const TriggerLoaderInjectionToken: InjectionToken<Type<IOnTrigger>> =
    new InjectionToken<Type<IOnTrigger>>('__TRIGGER_INJECTION_PERFORMULAR__');

export interface ITriggerResult {
    trigger: TriggerLoader;
    result: boolean | undefined;
}

export class TriggerLoader extends AbstractLoader<IOnTrigger, ITriggerMetadata> {
    protected _instance: IOnTrigger;
    protected _params: any;
    public action: TriggerAction;
    public errorMsg: string | undefined;

    constructor(
        definition: ITriggerSchema
    ) {
        super(
            TRIGGER_METADATA,
            TriggerLoaderInjectionToken,
            definition.type
        );
        this._instance = this._injectInstance(this._target);
        this._params = definition.params;
        this.action = definition.action;
        this.errorMsg = definition.errorMsg;
    }

    public callTrigger(field: FieldSchema, checked: boolean): Observable<ITriggerResult> {
        if (checked || this._metadata.strategy === TriggerStrategy.Allways) {
            return createObservable(this._instance.trigger(field, this._params)).pipe(
                map((res: boolean | undefined) => {
                    return {
                        trigger: this,
                        result: res
                    };
                })
            );
        }
        return of({
            trigger: this,
            result: undefined
        });
    }

}
