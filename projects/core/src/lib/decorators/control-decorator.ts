import 'reflect-metadata';

import { ControlOptions } from './types/control-options';

export function Control(options: ControlOptions): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol): void => {
        const controls: any[] = Reflect.getMetadata('CONTROLS', target.constructor) || [];
        Reflect.defineMetadata('CONTROLS', [...controls, {
            id: propertyKey,
            ...options
        }], target.constructor);
    };
}
