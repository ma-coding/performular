import { EntityState } from './entity-state';
import { EntityClass } from './entity';
import { HashMap } from '../../utils/types';
import { isFunction } from '../../utils/is';
import { AbstractStore } from '../abstract-store/abstract-store';
import { EntityManager } from './entity-manager';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { StateFn } from '../types/state-fn';

export class EntityStore<
    T extends EntityState<E>,
    E extends EntityClass
> extends AbstractStore<T> {
    constructor(initialState: T) {
        super(initialState);
    }

    public getEntityManager<S extends E>(id: string): EntityManager<S> {
        return {
            select: <KS extends keyof S>(key: KS): Observable<S[KS]> => {
                return this.select<S[KS]>(
                    (state: T) => (state.entities[id] as S)[key]
                ).pipe(distinctUntilChanged());
            },
            update: (setStateFn: StateFn<S>): void => {
                this.update((state: E) => setStateFn(<S>state), [id]);
            },
            get: (getStateFn: StateFn<S, void>): void => {
                this.getState((state: T) => {
                    getStateFn(<S>state.entities[id]);
                });
            }
        };
    }

    public reset(...entities: E[]): void {
        this.setState((state: T) =>
            this._updateEntities(state, this._keyBy(...entities))
        );
    }

    public add(...entities: E[]): void {
        this.setState((state: T) =>
            this._updateEntities(state, {
                ...state.entities,
                ...this._keyBy(...entities)
            })
        );
    }

    public update(
        newState: StateFn<E, Partial<E>>,
        condition?: string[] | ((entity: E) => boolean)
    ): void {
        this.setState((state: T) => {
            const updatedableEntities: E[] = this._mapEntities(
                state.entities
            ).filter(this._getConditionFn(condition));
            return this._updateEntities(state, {
                ...state.entities,
                ...this._reduceEntity(
                    (acc: HashMap<E>, entity: E) =>
                        entity.clone(newState(entity)),
                    ...updatedableEntities
                )
            });
        });
    }

    public remove(condition?: string[] | ((entity: E) => boolean)): void {
        this.setState((state: T) => {
            const conditionFn: (entity: E) => boolean = this._getConditionFn(
                condition
            );
            const mapedEntities: E[] = this._mapEntities(state.entities);
            const toRemoveEntities: E[] = mapedEntities.filter(conditionFn);
            return this._updateEntities(
                state,
                this._reduceEntity((acc: HashMap<E>, entity: E) => {
                    if (toRemoveEntities.indexOf(entity) >= 0) {
                        return undefined;
                    }
                    return entity;
                }, ...mapedEntities)
            );
        });
    }

    private _updateEntities(state: T, entities: HashMap<E>): T {
        return {
            ...(<any>state),
            entities
        };
    }

    private _getConditionFn(
        condition?: string[] | ((entity: E) => boolean)
    ): (entity: E) => boolean {
        if (!condition) {
            return (_: E): boolean => true;
        } else if (isFunction(condition)) {
            return condition;
        } else {
            const cond: string[] = Array.isArray(condition)
                ? condition
                : [condition];
            return (entity: E): boolean => cond.indexOf(entity.id) >= 0;
        }
    }

    private _mapEntities(entities: HashMap<E>): E[] {
        return Object.keys(entities || {}).map((key: string) => entities[key]);
    }

    private _keyBy(...entities: E[]): HashMap<E> {
        return this._reduceEntity(
            (acc: HashMap<E>, entity: E) => entity,
            ...entities
        );
    }

    private _reduceEntity(
        reducer: (acc: HashMap<E>, entity: E) => E | undefined,
        ...entities: E[]
    ): HashMap<E> {
        return entities.reduce((acc: HashMap<E>, entity: E) => {
            const reducedEntity: E | undefined = reducer(acc, entity);
            if (!reducedEntity) {
                return acc;
            }
            return {
                ...acc,
                [entity.id]: reducedEntity
            };
        }, {});
    }
}
