import { forkJoin, Observable, Subject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { IFormOptions } from '../form/form';
import { generateUUID } from '../utils/misc';
import { use } from '../utils/mixin';
import { State } from '../utils/state';
import { Framework, IFramework, IFrameworkProperty } from './framework/framework';
import { IItem, IItemProperty, Item } from './layout/item';

export type TControl = 'control';
export type TGroup = 'group';
export type TList = 'list';
export type TContainer = 'container';

export type FieldType = TControl | TGroup | TList | TContainer;

export interface IAbstractParams<
    T extends FieldType = any,
    F extends string = any,
    A = any,
    S extends string = any
    > extends IItemProperty, IFrameworkProperty<F, A, S> {
    type: T;
    id: string;
}

export interface IAbstractProperty<
    T extends FieldType = any,
    F extends string = any,
    A = any,
    S extends string = any
    > extends IItemProperty, IFrameworkProperty<F, A, S> {
    type: T;
    id: string;
    options: IFormOptions;
}

export interface IAbstract<
    T extends FieldType = any,
    A = any,
    S extends string = any
    > extends IItem, IFramework<A, S> {
    type: T;
    id: string;
    uuid: string;
    options: IFormOptions;
}

export function selectType<T extends FieldType>(state: IAbstract<T>): T {
    return state.type;
}

export function selectId(state: IAbstract): string {
    return state.id;
}

export function selectUuid(state: IAbstract): string {
    return state.uuid;
}

export function selectOptions(state: IAbstract): IFormOptions {
    return state.options;
}

export interface Abstract<
    T extends FieldType = any,
    A = any,
    S extends string = any,
    ST extends IAbstract<T, A, S> = any
    > extends Item<ST>, Framework<A, S, ST> { }

export abstract class Abstract<
    T extends FieldType = any,
    A = any,
    S extends string = any,
    ST extends IAbstract<T, A, S> = any
    > {

    private _updateSubject: Subject<Abstract[]>;

    get type(): T {
        return this._state$.get(selectType);
    }

    get type$(): Observable<T> {
        return this._state$.get$(selectType);
    }

    get id(): string {
        return this._state$.get(selectId);
    }

    get id$(): Observable<string> {
        return this._state$.get$(selectId);
    }

    get uuid(): string {
        return this._state$.get(selectUuid);
    }

    get uuid$(): Observable<string> {
        return this._state$.get$(selectUuid);
    }

    get options(): IFormOptions {
        return this._state$.get(selectOptions);
    }

    get options$(): Observable<IFormOptions> {
        return this._state$.get$(selectOptions);
    }

    protected abstract _state$: State<ST>;
    protected _init: ST;

    @use(Item, Framework) public this: Abstract | undefined;

    constructor(abs: IAbstractProperty<T, string, A, S>) {
        this._updateSubject = new Subject();
        this._init = <any>(<IAbstract<T, A, S>>{
            ...abs,
            uuid: generateUUID(),
            ...this._initFramework(abs),
            ...this._initItem(abs)
        });
    }

    public update(checklist: Abstract[]): void {
        this.root._updateSubject.next(checklist);
    }

    protected abstract _run(checklist: Abstract[]): Observable<void>;
    protected abstract _update(): void;

    protected _treeUp(): void {
        this._update();
        const p: Abstract | undefined = this.parent;
        if (p) {
            p._treeUp();
        }
    }

    protected _treeDown(checklist: Abstract[]): Observable<void> {
        const children: Abstract[] = this.children;
        if (children.length === 0) {
            return this._run(checklist).pipe(
                map(() => this._treeUp())
            );
        }
        return this._run(checklist).pipe(
            concatMap(() =>
                forkJoin(
                    ...children.map((c: Abstract) => c._treeDown(checklist))
                )
            )
        );
    }
}
