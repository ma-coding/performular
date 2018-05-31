import { MapType } from './misc';
import { EffectType, IEffectDecoration } from './models/effect';
import { FrameworkType, IFrameworkDecoration } from './models/framework';
import { RunDetectorType } from './models/run-detector';

export interface IMetadata<M, T> {
    target: T;
    metadata: M;
}

export class Metadata {

    private static _runDetectors: MapType<IMetadata<string, RunDetectorType>> = {};
    private static _effects: MapType<IMetadata<IEffectDecoration, EffectType>> = {};
    private static _formComponents: MapType<IMetadata<IFrameworkDecoration, FrameworkType>> = {};

    public static addEffect(options: IEffectDecoration, target: EffectType): void {
        this._effects[options.name] = {
            metadata: options,
            target: target
        };
    }

    public static addFormComponent(options: IFrameworkDecoration, target: FrameworkType): void {
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

    public static getEffect(name: string): IMetadata<IEffectDecoration, EffectType> {
        if (!this._effects[name]) {
            this._throwNotFound('effect', name);
        }
        return this._effects[name];
    }

    public static getFormComponent(name: string): IMetadata<IFrameworkDecoration, FrameworkType> {
        if (!this._formComponents[name]) {
            this._throwNotFound('formComponent', name);
        }
        return this._formComponents[name];
    }

    public static getRunDetector(name: string): IMetadata<string, RunDetectorType> {
        if (!this._runDetectors[name]) {
            this._throwNotFound('runDetector', name);
        }
        return this._runDetectors[name];
    }

    private static _throwNotFound(type: string, name: string): void {
        throw new Error(`The ${type}: ${name} is not registerd to performular!`);
    }
}
