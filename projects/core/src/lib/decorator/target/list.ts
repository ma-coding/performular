import { ListOptions } from '../types/list-options';

export function List(options: ListOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {};
}
