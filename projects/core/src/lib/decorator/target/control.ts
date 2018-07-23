import { Metadata } from '../../metadata/metadata';
import { ControlOptions } from '../types/control-options';

export function Control<ATTRS = any>(
    options: ControlOptions<ATTRS>
): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        Metadata.addFormItem('controls', {
            ...options,
            id: propertyKey,
            target: target.constructor
        });
    };
}
