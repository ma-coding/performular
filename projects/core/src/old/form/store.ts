import { Injector, Type } from '@angular/core';

import { FieldType } from '../models/abstract';
import { ControlDatasourceType, IControlDatasource, IControlDatasourceDecoration } from '../models/datasource/datasource';
import { EffectType, IEffectDecoration, IOnEffect } from '../models/effects/effect';
import { IRunDetector, RunDetectorType } from '../models/effects/run-detection/run-detection';
import { FormComponentType, IFormComponentDecoration } from '../models/framework/decorator';
import { MapType } from '../utils/misc';

export interface IMetadata<M, T> {
    target: T;
    metadata: M;
}

export interface IInstancedMetadata<I, M, T> extends IMetadata<M, T> {
    instance: I;
}
// @dynamic
export class Store {

    private static _runDetectors: MapType<IMetadata<string, RunDetectorType>> = {};
    private static _effects: MapType<IMetadata<IEffectDecoration, EffectType>> = {};
    private static _controlDatasources: MapType<IMetadata<IControlDatasourceDecoration, ControlDatasourceType>> = {};
    private static _formComponents: MapType<IMetadata<IFormComponentDecoration<FieldType>, FormComponentType>> = {};

    /**
     * Static member that holds the Injector.
     */
    public static injector: Injector | undefined;

    public static get<Instance>(target: Type<Instance>): Instance {
        this._throwError();
        const inst: Instance | undefined = (<Injector>this.injector).get<Instance>(target, undefined);
        if (!inst) {
            this._throwError();
        }
        return inst;
    }

    public static addControlDatasource(options: IControlDatasourceDecoration, target: ControlDatasourceType): void {
        this._controlDatasources[options.name] = {
            metadata: options,
            target: target
        };
    }

    public static addEffect(options: IEffectDecoration, target: EffectType): void {
        this._effects[options.name] = {
            metadata: options,
            target: target
        };
    }

    public static addFormComponent(options: IFormComponentDecoration<FieldType>, target: FormComponentType): void {
        this._formComponents[options.name] = {
            metadata: options,
            target: target
        };
    }

    public static addRunDetector(name: string, target: RunDetectorType): void {
        this._runDetectors[name] = {
            metadata: name,
            target: target
        };
    }

    public static getEffect<ET extends IOnEffect>(name: string): IInstancedMetadata<ET, IEffectDecoration, EffectType> {
        if (!this._effects[name]) {
            this._throwNotFound('effect', name);
        }
        return {
            ...this._effects[name],
            instance: this.get<ET>(<Type<ET>>this._effects[name].target)
        };
    }

    public static getControlDatasource(
        name: string
    ): IInstancedMetadata<IControlDatasource, IControlDatasourceDecoration, ControlDatasourceType> {
        if (!this._controlDatasources[name]) {
            this._throwNotFound('controlDatasource', name);
        }
        return {
            ...this._controlDatasources[name],
            instance: this.get<IControlDatasource>(this._controlDatasources[name].target)
        };
    }

    public static getFormComponent(name: string): IMetadata<IFormComponentDecoration<FieldType>, FormComponentType> {
        if (!this._formComponents[name]) {
            this._throwNotFound('formComponent', name);
        }
        return this._formComponents[name];
    }

    public static getRunDetector(name: string): IInstancedMetadata<IRunDetector, string, RunDetectorType> {
        if (!this._runDetectors[name]) {
            this._throwNotFound('runDetector', name);
        }
        return {
            ...this._runDetectors[name],
            instance: this.get<IRunDetector>(this._runDetectors[name].target)
        };
    }

    private static _throwError(): void {
        if (!this.injector) {
            throw new Error(
                'No Injector provided please import PerformularCoreModule to your ngModule'
            );
        }
    }

    private static _throwNotFound(type: string, name: string): void {
        throw new Error(`The ${type}: ${name} is not registerd to performular!`);
    }

    /**
     * Method that connects the Injector with the static member.
     */
    public connect(injector: Injector): void {
        if (!Store.injector) {
            Store.injector = injector;
        }
    }
}
