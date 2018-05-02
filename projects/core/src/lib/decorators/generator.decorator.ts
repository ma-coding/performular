import { IAbstractDecorationParams } from '../core/loaders/abstract-loader';
import { GeneratorLoaderDecorationKey } from '../core/loaders/generator-loader';

/**
 * Decorator Function for any Form Generators.
 * @export
 */
export function FormGenerator(decoration: IAbstractDecorationParams): ClassDecorator {
    return function (target: Function): void {
        Reflect.defineMetadata(GeneratorLoaderDecorationKey, {
            ...decoration,
            target: target
        }, target);
    };
}
