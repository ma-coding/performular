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
