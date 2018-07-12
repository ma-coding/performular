import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class State<T extends {}> {
    protected abstract _state$: BehaviorSubject<T>;

    public select<K extends keyof T>(key: K): T[K] {
        return this._state$.getValue()[key];
    }

    public select$<K extends keyof T>(key: K): Observable<T[K]> {
        return this._state$.pipe(
            map((state: T) => state[key]),
            distinctUntilChanged()
        );
    }

    public update(s: Partial<T>): void {
        this._state$.next(Object.assign(this._state$.getValue(), s));
    }

    public updateKey<K extends keyof T>(key: K, value: T[K]): void {
        // Todo: Better Type
        this.update(<any>{
            [key]: value
        });
    }
}
