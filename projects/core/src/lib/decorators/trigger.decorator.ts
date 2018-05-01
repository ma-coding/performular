import { IAbstractDecorationParams } from '../core/loaders/abstract-loader';
import { TriggerLoaderDecorationKey } from '../core/loaders/trigger-loader';

/**
 * Decorator Function for any Form Triggers (Visibility and Validations).
 * @export
 */
export function FormTrigger(decoration: IAbstractDecorationParams): ClassDecorator {
    return function (target: Function): void {
        Reflect.defineMetadata(TriggerLoaderDecorationKey, {
            ...decoration,
            target: target
        }, target);
    };
}
