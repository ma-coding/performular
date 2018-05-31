
export type Constructor<T> = new (...args: any[]) => T;
export type Mixin<T> = Constructor<T>;

export function mix(baseClass: Constructor<any>, mixins: Mixin<any>[]): void {
    const baseClassNames: string[] = getClassMethodsWithoutConstructor(baseClass);
    for (const mixin of mixins) {
        const methodNames: string[] = getMethodNames(mixin);
        methodNames.forEach((methodName: string) => {
            if (baseClassNames.indexOf(methodName) > -1) {
                return;
            }
            const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(mixin.prototype, methodName);
            if (descriptor) {
                Object.defineProperty(baseClass.prototype, methodName, descriptor);
            } else {
                console.log(methodName);
                baseClass.prototype[methodName] = mixin.prototype[methodName];
            }
        });
    }
}

export function getMethodNames(mixin: Mixin<any>): string[] {
    return getClassMethodsWithoutConstructor(mixin as Constructor<any>);
}

export function getObjectMethods(obj: object): string[] {
    return Object.getOwnPropertyNames(obj).filter((key: string) => {
        return obj[key] && (typeof obj[key] === 'function');
    });
}

export function getClassMethodsWithoutConstructor(cls: Constructor<any>): string[] {
    const baseClassMethodNames: string[] = Object.getOwnPropertyNames(cls.prototype);
    return baseClassMethodNames.slice(1, baseClassMethodNames.length); // Don't mess with the constructor.
}

export function use(...options: Mixin<any>[]): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        mix(target.constructor, options);
    };
}
