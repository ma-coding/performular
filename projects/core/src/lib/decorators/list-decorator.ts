import { ListOptions } from './types/list-options';

export function List(options: ListOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        const controls: any[] = Reflect.getMetadata('LISTS', target.constructor) || [];
        Reflect.defineMetadata('LISTS', [...controls, {
            id: propertyKey,
            ...options
        }], target.constructor);
    };
}
