import { Observable, of } from 'rxjs';

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
