import { Observable, of } from 'rxjs';

export interface IViewScales<T> {
    main: T;
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    gtXs?: T;
    gtSm?: T;
    gtMd?: T;
    gtLg?: T;
    ltSm?: T;
    ltMd?: T;
    ltLg?: T;
    ltXl?: T;
}

export interface MapType<T> {
    [key: string]: T;
}

// tslint:disable-next-line
export type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type Property<T extends Array<any>> = T[Exclude<NonFunctionPropertyNames<T>, 'length'>];
export type RemoveKey<T, S> = { [K in Exclude<keyof T, S>]: T[K] };

export type FormComponentTypes = Array<any>;
export type EffectTypes = Array<any>;

/**
 * Function that returns an unique string.
 * @export
 * @returns an unique string
 */
export function generateUUID(): string {
    const s4: () => string = (): string => {
        // tslint:disable-next-line:no-magic-numbers
        return Math.floor((1 + Math.random()) * 0x10000)
            // tslint:disable-next-line:no-magic-numbers
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function createObservable<T>(maybe: T | Observable<T>): Observable<T> {
    if (maybe instanceof Observable) {
        return maybe;
    } else {
        return of(maybe);
    }
}

/**
 * Function that flats 2 Dimension Array to 1 Dimension.
 * @export
 * @param 2 Dimension Array
 * @returns Flats the Array to One Dimension
 */
export function flatten<T = any>(arr: T[][]): T[] {
    return [].concat.apply([], arr);
}

export function cloneDeep(o: any): any {
    const gdcc: string = '__getDeepCircularCopy__';
    if (o !== Object(o)) {
        return o; // primitive value
    }

    const set: boolean = gdcc in o;
    const cache: any = o[gdcc];
    let result: any;
    if (set && typeof cache === 'function') {
        return cache();
    }
    // else
    o[gdcc] = (): any => result; // overwrite
    if (o instanceof Array) {
        result = [];
        for (let i: number = 0; i < o.length; i++) {
            result[i] = cloneDeep(o[i]);
        }
    } else {
        result = {};
        for (const prop in o) {
            if (prop !== gdcc) {
                result[prop] = cloneDeep(o[prop]);
            } else if (set) {
                result[prop] = cloneDeep(cache);
            }
        }
    }
    if (set) {
        o[gdcc] = cache; // reset
    } else {
        delete o[gdcc]; // unset again
    }
    return result;
}

export function isEqual(value: any, other: any): boolean {

    // Get the value type
    const type: any = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) {
        return false;
    }

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
        return false;
    }

    // Compare the length of the length of the two items
    const valueLen: number = type === '[object Array]' ? value.length : Object.keys(value).length;
    const otherLen: number = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) {
        return false;
    }

    // Compare two items
    const compare: any = (item1: any, item2: any): boolean | undefined => {

        // Get the object type
        const itemType: any = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) {
                return false;
            }
        } else {
            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) {
                return false;
            }
            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) {
                    return false;
                }
            } else {
                if (item1 !== item2) {
                    return false;
                }
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (let i: number = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) {
                return false;
            }
        }
    } else {
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) {
                    return false;
                }
            }
        }
    }

    // If nothing failed, return true
    return true;
}
