import { IMetadata } from './models/metadata';
import { MapType } from './models/misc';
import { IRunDecoration } from './models/run';
import { ValidatorType } from './models/validation';
import { VisibleType } from './models/visibility';

export class Metadata {

    private static _visibles: MapType<IMetadata<IRunDecoration, VisibleType>> = {};
    private static _validators: MapType<IMetadata<IRunDecoration, ValidatorType>> = {};

    public static addVisible(options: IRunDecoration, target: VisibleType): void {
        this._visibles[options.name] = {
            metadata: options,
            target: target
        };
    }

    public static addValidator(options: IRunDecoration, target: ValidatorType): void {
        this._validators[options.name] = {
            metadata: options,
            target: target
        };
    }

    public static getVisible(name: string): IMetadata<IRunDecoration, VisibleType> {
        if (!this._visibles[name]) {
            this._throwNotFound('visible', name);
        }
        return this._visibles[name];
    }

    public static getValidator(name: string): IMetadata<IRunDecoration, ValidatorType> {
        if (!this._validators[name]) {
            this._throwNotFound('validator', name);
        }
        return this._validators[name];
    }

    private static _throwNotFound(type: string, name: string): void {
        throw new Error(`The ${type}: ${name} is not registerd to performular!`);
    }
}
