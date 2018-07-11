import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class State<T extends {}> extends BehaviorSubject<T> {
    constructor(state: T) {
        super(state);
    }

    public _select<K extends keyof T>(key: K): T[K] {
        return this.getValue()[key];
    }

    public _select$<K extends keyof T>(key: K): Observable<T[K]> {
        return this.pipe(
            map((state: T) => state[key]),
            distinctUntilChanged()
        );
    }

    public _update(s: Partial<T>): void {
        this.next(Object.assign(this.getValue(), s));
    }

    public _updateKey<K extends keyof T>(key: K, value: T[K]): void {
        // Todo: Better Type
        this._update(<any>{
            [key]: value
        });
    }
}
