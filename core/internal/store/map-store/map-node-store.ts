import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { StateFn } from '../types/state-fn';
import { getProjector } from '../utils/projector';
import { MapState } from './map-state';
import { MapStore } from './map-store';

export class MapNodeStore<S, T extends MapState<S>> {
    constructor(private _store: MapStore<S, T>, private _id: string) {}

    public select(): Observable<S>;
    public select<K extends keyof S>(projector?: K): Observable<S[K]>;
    public select<K>(projector?: StateFn<S, K>): Observable<K>;
    public select(projector?: any): Observable<any> {
        return this._store.select(this._id).pipe(
            map(getProjector(projector)),
            distinctUntilChanged()
        );
    }

    public update(setStateFn: StateFn<S, Partial<S>>): void {
        this._store.update((state: S) => setStateFn(state), [this._id]);
    }

    public get(getStateFn: StateFn<S, void>): void {
        this._store.getState((state: MapState<S>) => {
            getStateFn(state[this._id]);
        });
    }
}
