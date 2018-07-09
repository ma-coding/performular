import { Observable } from 'rxjs';

export type MaybeObservable<T> = Observable<T> | T;
