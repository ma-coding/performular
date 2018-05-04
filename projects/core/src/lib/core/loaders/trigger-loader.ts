import { InjectionToken, Type } from '@angular/core';

import { Observable, of } from 'rxjs';

import { createObservable, MaybeObservable } from '../misc/maybe-observable';
import { FieldSchema } from '../schemas/field/field-schema';
import { AbstractLoader } from './abstract-loader';

export interface IOnRun<ReturnType, ParamsType> {
    performularOnRun(field: FieldSchema<any>, params?: ParamsType): MaybeObservable<ReturnType>;
    performularWhen?(field: FieldSchema<any>): boolean;
}

export const TriggerLoaderInjectionToken: InjectionToken<Type<IOnRun<any, any>>> =
    new InjectionToken<Type<IOnRun<any, any>>>('__PERFORMULAR_TRIGGER_LOADER_INJECTION_TOKEN__');

export const TriggerLoaderDecorationKey: string =
    '__PERFORMULAR_TRIGGER_LOADER_DECORATION_KEY__';

export interface ITriggerDefinition<ReturnType, ParamsType> {
    trigger: string | Type<IOnRun<ReturnType, ParamsType>>;
    params?: ParamsType;
    onlySelf?: boolean;
}

export abstract class TriggerLoader<ReturnType, ParamsType>
    extends AbstractLoader<IOnRun<ReturnType, ParamsType>> {

    protected _onlySelf: boolean;
    protected _params: ParamsType | undefined;
    protected _instance: IOnRun<ReturnType, ParamsType>;

    constructor(
        definition: ITriggerDefinition<ReturnType, ParamsType>
    ) {
        super(
            TriggerLoaderDecorationKey,
            TriggerLoaderInjectionToken,
            definition.trigger
        );
        this._onlySelf = definition.onlySelf || false;
        this._params = definition.params;
        this._instance = this._getInstanceFromTarget(this._target);
    }

    public callTrigger(field: FieldSchema<any>, checked: boolean): Observable<ReturnType | undefined | null> {
        if (checked || !this._onlySelf) {
            const whenResult: boolean = this._instance.performularWhen ? this._instance.performularWhen(field) : true;
            if (whenResult) {
                return createObservable(this._instance.performularOnRun(field, this._params));
            }
        }
        return of(null);
    }
}

/* Validation */
export type ValidationReturnType = string | undefined;

export type IOnValidate<ParamsType> = IOnRun<ValidationReturnType, ParamsType>;

export type IValidationDefinition<ParamsType> =
    ITriggerDefinition<ValidationReturnType, ParamsType>;

export class ValidationLoader<ParamsType = any>
    extends TriggerLoader<ValidationReturnType, ParamsType> { }

/* Visibility */
export type VisibilityReturnType = boolean | undefined;

export type IOnVisibility<ParamsType> = IOnRun<VisibilityReturnType, ParamsType>;

export type IVisibilityDefinition<ParamsType = any> =
    ITriggerDefinition<VisibilityReturnType, ParamsType>;

export class VisibilityLoader<ParamsType>
    extends TriggerLoader<VisibilityReturnType, ParamsType> { }
