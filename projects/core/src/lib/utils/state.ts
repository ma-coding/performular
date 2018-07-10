import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class State<T extends {}> extends BehaviorSubject<T> {
    constructor(state: T) {
        super(state);
    }

    public select<K extends keyof T>(key: K): T[K] {
        return this.getValue()[key];
    }

    public select$<K extends keyof T>(key: K): Observable<T[K]> {
        return this.pipe(
            map((state: T) => state[key]),
            distinctUntilChanged()
        );
    }

    public update(s: Partial<T>): void {
        this.next(Object.assign(this.getValue(), s));
    }

    public updateKey<K extends keyof T>(key: K, value: T[K]): void {
        const tmpT: Partial<T> = {};
        tmpT[key] = value;
        this.update(tmpT);
    }
}
