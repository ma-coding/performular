import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class State<T extends {}> extends BehaviorSubject<T> {
    constructor(state: T) {
        super(state);
    }

    public get<K>(selector: (state: T) => K): K {
        return selector(this.getValue());
    }

    public get$<K>(selector: (state: T) => K): Observable<K> {
        return this.pipe(
            map((state: T) => selector(state)),
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
