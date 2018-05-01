import { IAbstractDecorationParams } from '../core/loaders/abstract-loader';
import { ConverterLoaderDecorationKey } from '../core/loaders/converter-loader';

/**
 * Decorator Function for any Form Converters.
 * @export
 */
export function FormConverter(decoration: IAbstractDecorationParams): ClassDecorator {
    return function (target: Function): void {
        Reflect.defineMetadata(ConverterLoaderDecorationKey, {
            ...decoration,
            target: target
        }, target);
    };
}
