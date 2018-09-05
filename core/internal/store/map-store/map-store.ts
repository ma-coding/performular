import { isFunction } from '../../utils/is';
import { AbstractStore } from '../abstract-store/abstract-store';
import { HashMap, ObjectKey, StateFn } from '../utils/types';
import { MapNode } from './map-node';
import { MapState } from './map-state';

export class MapStore<
    STATE,
    ID_KEY extends keyof STATE,
    MAP_STATE extends MapState<STATE> = MapState<STATE>
> extends AbstractStore<MAP_STATE> {
    constructor(private _idKey: ID_KEY, ...initialState: STATE[]) {
        super(MapStore._toMap<STATE, MAP_STATE>(_idKey, ...initialState));
    }

    private static _toArray<STATE, MAP_STATE extends MapState<STATE>>(
        entities: MAP_STATE
    ): STATE[] {
        return Object.keys(entities || {}).map((key: string) => entities[key]);
    }

    private static _toMap<STATE, MAP_STATE extends MapState<STATE>>(
        idKey: ObjectKey,
        ...entities: STATE[]
    ): MAP_STATE {
        return this._reduceEntity(
            (acc: MAP_STATE, entity: STATE) => ({ ...(<any>entity) }),
            idKey,
            ...entities
        );
    }

    private static _reduceEntity<STATE, MAP_STATE extends MapState<STATE>>(
        reducer: (acc: MAP_STATE, entity: STATE) => STATE | undefined,
        idKey: ObjectKey,
        ...entities: STATE[]
    ): MAP_STATE {
        return entities.reduce((acc: MAP_STATE, entity: STATE) => {
            const reducedEntity: STATE | undefined = reducer(acc, entity);
            if (!reducedEntity) {
                return acc;
            }
            return {
                ...(<any>acc),
                [entity[idKey]]: reducedEntity
            };
        }, {});
    }

    public getNode<MAP_KEY extends keyof MAP_STATE>(
        id: MAP_KEY
    ): MapNode<STATE, ID_KEY, MAP_KEY, MAP_STATE> {
        return new MapNode<STATE, ID_KEY, MAP_KEY, MAP_STATE>(this, id);
    }

    public reset(...entities: STATE[]): void {
        this.setState((state: MAP_STATE) =>
            this._updateMap(
                <MAP_STATE>{},
                MapStore._toMap<STATE, MAP_STATE>(this._idKey, ...entities)
            )
        );
    }

    public add(...entities: STATE[]): void {
        this.setState((state: MAP_STATE) =>
            this._updateMap(
                state,
                MapStore._toMap<STATE, MAP_STATE>(this._idKey, ...entities)
            )
        );
    }

    public update(
        newState: StateFn<STATE, Partial<STATE>>,
        condition?: string[] | StateFn<STATE, boolean>
    ): void {
        this.setState((state: MAP_STATE) => {
            const updatedableEntities: STATE[] = MapStore._toArray<
                STATE,
                MAP_STATE
            >(state).filter(this._getConditionFn(condition));
            return this._updateMap(
                state,
                MapStore._reduceEntity<STATE, MAP_STATE>(
                    (acc: HashMap<STATE>, entity: STATE) =>
                        this._updateEntity(entity, newState(entity)),
                    this._idKey,
                    ...updatedableEntities
                )
            );
        });
    }

    public remove(condition?: string[] | StateFn<STATE, boolean>): void {
        this.setState((state: MAP_STATE) => {
            const conditionFn: (
                entity: STATE
            ) => boolean = this._getConditionFn(condition);
            const mapedEntities: STATE[] = MapStore._toArray(state);
            const toRemoveEntities: STATE[] = mapedEntities.filter(conditionFn);
            return this._updateMap(
                state,
                MapStore._reduceEntity<STATE, MAP_STATE>(
                    (acc: MAP_STATE, entity: STATE) => {
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

    private _updateMap(prevMap: MAP_STATE, nextMap: MAP_STATE): MAP_STATE {
        return {
            ...(<any>prevMap),
            ...(<any>nextMap)
        };
    }

    private _updateEntity(prevEntity: STATE, newEntity: Partial<STATE>): STATE {
        return {
            ...(<any>prevEntity),
            ...(<any>newEntity)
        };
    }

    private _getConditionFn(
        condition?: string[] | StateFn<STATE, boolean>
    ): StateFn<STATE, boolean> {
        if (!condition) {
            return (_: STATE): boolean => true;
        } else if (isFunction(condition)) {
            return condition;
        } else {
            const cond: string[] = Array.isArray(condition)
                ? condition
                : [condition];
            return (entity: STATE): boolean =>
                cond.some((c: string) => entity[<string>this._idKey] === c);
        }
    }
}
