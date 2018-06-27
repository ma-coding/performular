import 'reflect-metadata';

export type Constructor<T> = Function & { prototype: T };
export type Mixin<T> = Constructor<T>;

export function mix(baseClass: Constructor<any>, mixins: Mixin<any>[]): void {
    for (const mixin of mixins) {
        const baseClassDescriptors: PropertyDescriptorMap = getAllPropertyDescriptors(baseClass);
        const descriptors: PropertyDescriptorMap = getAllPropertyDescriptors(mixin);

        Object.keys(descriptors).forEach((key: string) => {
            if (key in baseClassDescriptors) {
                console.error(`${key} ist schon vorhanden!`);
                return;
            }
            Object.defineProperty(baseClass.prototype, key, descriptors[key]);
        });
    }
}

export function use(...options: Mixin<any>[]): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        mix(target.constructor, options);
    };
}

export function getAllPropertyDescriptors(mixClass: Constructor<any>): PropertyDescriptorMap {
    let map: PropertyDescriptorMap = getOwnDescriptors(mixClass.prototype);
    let prototype: any = Object.getPrototypeOf(mixClass.prototype);
    while (prototype) {
        map = {
            ...map,
            ...getOwnDescriptors(prototype)
        };
        prototype = Object.getPrototypeOf(prototype);
    }
    delete map['constructor'];
    delete map['hasOwnProperty'];
    delete map['isPrototypeOf'];
    delete map['propertyIsEnumerable'];
    delete map['toLocaleString'];
    delete map['toString'];
    delete map['valueOf'];
    delete map['__defineGetter__'];
    delete map['__defineSetter__'];
    delete map['__lookupGetter__'];
    delete map['__lookupSetter__'];
    return map;
}

export function getOwnDescriptors(object: any): PropertyDescriptorMap {
    return Reflect.ownKeys(object).reduce((descriptors: any, key: string | number | symbol) => {
        return Object.defineProperty(
            descriptors,
            key,
            {
                configurable: true,
                enumerable: true,
                writable: true,
                value: Object.getOwnPropertyDescriptor(object, key)
            }
        );
    }, {});
}
