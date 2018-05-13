import { Observable, of } from 'rxjs';

/**
 * Function that flats 2 Dimension Array to 1 Dimension.
 * @export
 * @param 2 Dimension Array
 * @returns Flats the Array to One Dimension
 */
export function flatten<T = any>(arr: T[][]): T[] {
    return [].concat.apply([], arr);
}

export type MaybeObservable<T> = Observable<T> | T;

/**
 * Function that returns an Observable of the parameter.
 * @export
 */
export function createObservable<T>(maybe: MaybeObservable<T>): Observable<T> {
    if (maybe instanceof Observable) {
        return maybe;
    } else {
        return of(maybe);
    }
}

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
