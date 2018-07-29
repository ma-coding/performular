import { Metadata } from '../../metadata/metadata';
import { SubGroupOptions } from '../types/sub-group-options';

export function SubGroup(options: SubGroupOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        Metadata.addFormItem('subGroups', {
            ...options,
            id: propertyKey,
            target: target.constructor
        });
    };
}
