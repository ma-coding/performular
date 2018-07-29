import { Metadata } from '../../metadata/metadata';
import { ListOptions } from '../types/list-options';

export function List<ATTRS = any>(
    options: ListOptions<ATTRS>
): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        Metadata.addFormItem('lists', {
            ...options,
            id: propertyKey,
            target: target.constructor
        });
    };
}
