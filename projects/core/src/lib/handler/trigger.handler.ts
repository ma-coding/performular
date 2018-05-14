import { InjectionToken, Type } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { createObservable } from '../helpers';
import { IMetadataTarget, LoaderService } from '../loader.service';
import { AbstractSchema } from '../schemas/abstract.schema';

export enum TriggerStrategy {
    Any,
    Self
}

export interface ITriggerDecoration {
    id: string;
    strategy?: TriggerStrategy;
}

export const TriggerMetadataKey: string = '__PERFORMULAR_TRIGGER_META__';

export function Trigger(decoration: ITriggerDecoration): ClassDecorator {
    return (target: Function): void => {
        Reflect.defineMetadata(TriggerMetadataKey, decoration, target);
    };
}

export interface IOnTrigger<FType extends AbstractSchema = any, PType = any> {
    onTrigger(field: FType, params?: PType): boolean | Observable<boolean>;
}

export type TriggerType = Type<IOnTrigger>;

export const TriggerToken: InjectionToken<TriggerType> =
    new InjectionToken('__PERFORMULAR_TRIGGER_TOKEN__');

export type TriggerFunction<FType extends AbstractSchema = any, PType = any> =
    (field: FType, params?: PType) => boolean | Observable<boolean>;

export enum TriggerAction {
    Disable,
    Hide,
    Error
}

export interface TriggerSchema {
    id: string;
    trigger: TriggerType | string | TriggerFunction;
    action: TriggerAction;
    strategy?: TriggerStrategy;
    errorMsg?: string;
    params?: any;
}

export interface ITriggerResult {
    trigger: TriggerSchema;
    result: boolean | undefined;
}

export class TriggerHandler {
    private _instance: IOnTrigger;
    private _metadata: IMetadataTarget | undefined;
    private _schema: TriggerSchema;

    constructor(schema: TriggerSchema) {
        this._schema = schema;
        if (typeof schema.trigger === 'string') {
            const metadataTarget: IMetadataTarget | undefined =
                LoaderService.getFromString(schema.trigger, TriggerMetadataKey, TriggerToken);
            if (!metadataTarget) {
                throw new Error('Not Provided');
            }
            const instance: IOnTrigger | undefined = LoaderService.get<IOnTrigger>(metadataTarget.target);
            if (!instance) {
                throw new Error('Not Provided');
            }
            this._metadata = metadataTarget.metadata;
            this._instance = instance;
        } else {
            let instance: IOnTrigger | undefined =
                LoaderService.get<IOnTrigger>(schema.trigger as TriggerType);
            if (!instance) {
                instance = <IOnTrigger>{
                    onTrigger: schema.trigger
                };
            }
            this._instance = instance;
        }
    }

    public call(field: any, checked: boolean): Observable<ITriggerResult> {
        const strategy: TriggerStrategy =
            this._metadata ? this._metadata.metadata.strategy :
                this._schema.strategy ? this._schema.strategy : TriggerStrategy.Self;
        if (checked || strategy === TriggerStrategy.Any) {
            return createObservable(this._instance.onTrigger(field, this._schema.params)).pipe(
                map((result: boolean) => {
                    return {
                        trigger: this._schema,
                        result: result
                    };
                })
            );
        }
        return of({
            trigger: this._schema,
            result: undefined
        });
    }
}
