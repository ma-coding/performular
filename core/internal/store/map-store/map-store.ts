import { isFunction } from '../../utils/is';
import { HashMap, ObjectKey } from '../../utils/types';
import { AbstractStore } from '../abstract-store/abstract-store';
import { StateFn } from '../types/state-fn';
import { MapNodeStore } from './map-node-store';
import { MapState } from './map-state';

export class MapStore<
    S,
    T extends MapState<S> = MapState<S>
> extends AbstractStore<T> {
    private _idKey: ObjectKey;

    constructor(idKey: keyof S, ...initialState: S[]) {
        super(MapStore._toMap<S, T>(idKey, ...initialState));
        this._idKey = idKey;
    }

    private static _toArray<S, T extends MapState<S>>(entities: T): S[] {
        return Object.keys(entities || {}).map((key: string) => entities[key]);
    }

    private static _toMap<S, T extends MapState<S>>(
        idKey: ObjectKey,
        ...entities: S[]
    ): T {
        return this._reduceEntity(
            (acc: T, entity: S) => entity,
            idKey,
            ...entities
        );
    }

    private static _reduceEntity<S, T extends MapState<S>>(
        reducer: (acc: T, entity: S) => S | undefined,
        idKey: ObjectKey,
        ...entities: S[]
    ): T {
        return entities.reduce((acc: T, entity: S) => {
            const reducedEntity: S | undefined = reducer(acc, entity);
            if (!reducedEntity) {
                return acc;
            }
            return {
                ...(<any>acc),
                [entity[idKey]]: reducedEntity
            };
        }, {});
    }

    public getNodeStore(id: string): MapNodeStore<S, T> {
        return new MapNodeStore<S, T>(this, id);
    }

    public reset(...entities: S[]): void {
        this.setState((state: T) =>
            this._updateMap(
                <T>{},
                MapStore._toMap<S, T>(this._idKey, ...entities)
            )
        );
    }

    public add(...entities: S[]): void {
        this.setState((state: T) =>
            this._updateMap(
                state,
                MapStore._toMap<S, T>(this._idKey, ...entities)
            )
        );
    }

    public update(
        newState: StateFn<S, Partial<S>>,
        condition?: string[] | StateFn<S, boolean>
    ): void {
        this.setState((state: T) => {
            const updatedableEntities: S[] = MapStore._toArray<S, T>(
                state
            ).filter(this._getConditionFn(condition));
            return this._updateMap(
                state,
                MapStore._reduceEntity<S, T>(
                    (acc: HashMap<S>, entity: S) =>
                        this._updateEntity(entity, newState(entity)),
                    this._idKey,
                    ...updatedableEntities
                )
            );
        });
    }

    public remove(condition?: string[] | StateFn<S, boolean>): void {
        this.setState((state: T) => {
            const conditionFn: (entity: S) => boolean = this._getConditionFn(
                condition
            );
            const mapedEntities: S[] = MapStore._toArray(state);
            const toRemoveEntities: S[] = mapedEntities.filter(conditionFn);
            return this._updateMap(
                state,
                MapStore._reduceEntity<S, T>(
                    (acc: T, entity: S) => {
                        if (toRemoveEntities.indexOf(entity) >= 0) {
                            return undefined;
                        }
                        return entity;
                    },
                    this._idKey,
                    ...mapedEntities
                )
            );
        });
    }

    private _updateMap(prevMap: T, nextMap: T): T {
        return {
            ...(<any>prevMap),
            ...(<any>nextMap)
        };
    }

    private _updateEntity(prevEntity: S, newEntity: Partial<S>): S {
        return {
            ...(<any>prevEntity),
            ...(<any>newEntity)
        };
    }

    private _getConditionFn(
        condition?: string[] | StateFn<S, boolean>
    ): StateFn<S, boolean> {
        if (!condition) {
            return (_: S): boolean => true;
        } else if (isFunction(condition)) {
            return condition;
        } else {
            const cond: string[] = Array.isArray(condition)
                ? condition
                : [condition];
            return (entity: S): boolean =>
                cond.some((c: string) => entity[this._idKey] === c);
        }
    }
}
