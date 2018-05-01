import { IAbstractDecorationParams } from '../core/loaders/abstract-loader';
import { ComponentLoaderDecorationKey } from '../core/loaders/component-loader';

/**
 * Decorator Function for any Form Field.
 * @export
 */
export function FormField(decoration: IAbstractDecorationParams): ClassDecorator {
    return function (target: Function): void {
        Reflect.defineMetadata(ComponentLoaderDecorationKey, {
            ...decoration,
            target: target
        }, target);
    };
}
