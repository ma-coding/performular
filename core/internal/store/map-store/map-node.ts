import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { getProjector } from '../utils/projector';
import { StateFn } from '../utils/types';
import { MapState } from './map-state';
import { MapStore } from './map-store';

export class MapNode<
    STATE,
    ID_KEY extends keyof STATE,
    MAP_KEY extends keyof MAP_STATE,
    MAP_STATE extends MapState<STATE> = MapState<STATE>
> {
    constructor(
        private _store: MapStore<STATE, ID_KEY, MAP_STATE>,
        private _id: MAP_KEY
    ) {}

    public select(): Observable<STATE>;
    public select<K extends keyof STATE>(projector?: K): Observable<STATE[K]>;
    public select<K>(projector?: StateFn<STATE, K>): Observable<K>;
    public select(projector?: any): Observable<any> {
        return this._store.select(this._id).pipe(
            map(getProjector(projector)),
            distinctUntilChanged()
        );
    }

    public update(setStateFn: StateFn<STATE, Partial<STATE>>): void {
        this._store.update((state: STATE) => setStateFn(state), [
            <string>this._id
        ]);
    }

    public get(getStateFn: StateFn<STATE, void>): void {
        this._store.getState((state: MapState<STATE>) => {
            getStateFn(state[<string>this._id]);
        });
    }
}
