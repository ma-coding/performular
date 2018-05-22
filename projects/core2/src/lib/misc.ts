import { BehaviorSubject } from 'rxjs';

export class State<T extends {}> extends BehaviorSubject<T> {
    constructor(state: T) {
        super(state);
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
