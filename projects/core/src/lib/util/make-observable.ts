import { Observable, of } from 'rxjs';

import { MaybeObservable } from './types/maybe-observable';

export function makeObservable<T>(value: MaybeObservable<T>): Observable<T> {
    return value instanceof Observable ? value : of(value);
}
