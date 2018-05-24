
export type Constructor<T> = new (...args: any[]) => T;
export type Mixin<T> = Constructor<T> | object;

export function mix(baseClass: Constructor<any>, mixins: Mixin<any>[]): void {
    const baseClassNames: string[] = getClassMethodsWithoutConstructor(baseClass);
    for (const mixin of mixins) {
        const methodNames: string[] = getMethodNames(mixin);
        methodNames.forEach((methodName: string) => {
            if (baseClassNames.indexOf(methodName) > -1) {
                return;
            }
            if (typeof mixin === 'object') {
                baseClass.prototype[methodName] = mixin[methodName];
            } else {
                baseClass.prototype[methodName] = mixin.prototype[methodName];
            }
        });
    }
}

export function getMethodNames(mixin: Mixin<any>): string[] {
    let methodNames: string[] = [];
    switch (typeof mixin) {
        case 'object':
            methodNames = getObjectMethods(mixin);
            break;
        case 'function':
            methodNames = getClassMethodsWithoutConstructor(mixin as Constructor<any>);
            break;
    }
    return methodNames;
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

export class Transportable<T> {
    public distance: T | undefined;
    public transport(): void {
        console.log(`moved ${this.distance}km.`);
    }
}

export class Transportable2 {
    public distance2: number | undefined;
    public transport2(): void {
        console.log(`moved ${this.distance2}km.`);
    }
}

export interface Shopperholic<T> extends Transportable2, Transportable<T> { }

// @dynamic
export class Shopperholic<T> {
    @use(Transportable, Transportable2) public this: Shopperholic<T> | undefined;

    public price: number = 2000;
    public distance: T | undefined;

    constructor() {
        this.transport();
    }
}
export const shop: Shopperholic<string> = new Shopperholic<string>();
shop.distance = ' ABC ';
shop.transport();
