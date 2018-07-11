import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class State<T extends {}> extends BehaviorSubject<T> {
    constructor(state: T) {
        super(state);
    }

    public abstract getUpdates$(): Observable<void>;

    protected _select<K extends keyof T>(key: K): T[K] {
        return this.getValue()[key];
    }

    protected _select$<K extends keyof T>(key: K): Observable<T[K]> {
        return this.pipe(
            map((state: T) => state[key]),
            distinctUntilChanged()
        );
    }

    protected _update(s: Partial<T>): void {
        this.next(Object.assign(this.getValue(), s));
    }

    protected _updateKey<K extends keyof T>(key: K, value: T[K]): void {
        // Todo: Better Type
        this._update(<any>{
            [key]: value
        });
    }
}
