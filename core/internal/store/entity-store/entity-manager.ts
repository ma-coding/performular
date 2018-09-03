import { Entity } from './entity';
import { Observable } from 'rxjs';
import { StateFn } from '../types/state-fn';

export interface EntityManager<T extends Entity> {
    select<K extends keyof T>(key: K): Observable<T[K]>;
    update(setStateFn: StateFn<T>): void;
    get(getStateFn: StateFn<T, void>): void;
}
