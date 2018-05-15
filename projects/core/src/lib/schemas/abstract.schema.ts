import { ElementRef, Type } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { ConverterHandler, ConverterSchema } from '../handler/converter.handler';
import { flatten } from '../helpers';

export enum SchemaType {
    Control,
    Group,
    Array,
    Layout
}

export interface IAbstractSchema<BType = any> {
    type: SchemaType;
    component: string | Type<any>;
    bindings: BType;
    converters?: ConverterSchema[];
}

export interface IAbstractState<BType = any> {
    type: SchemaType;
    uuid: string;
    hidden: boolean;
    component: any;
    converters: ConverterHandler[];
    bindings: BType;
    children: AbstractSchema[];
    parent?: AbstractSchema;
    elementRef?: ElementRef;
    instance?: any;
}

export abstract class AbstractSchema<State extends IAbstractState<BType> = any, BType = any> {
    protected abstract _store$: BehaviorSubject<State>;
    protected _initState: State;
    protected _updateSubject: Subject<string[]> = new Subject();

    get updates$(): Observable<void> {
        return this._updateSubject.pipe(
            // tslint:disable-next-line:no-magic-numbers
            buffer(this._updateSubject.pipe(debounceTime(500))),
            map(flatten),
            concatMap((checkList: string[]) => this._topDownUpdate(checkList))
        );
    }

    constructor(schema: IAbstractSchema<BType>) {
        this._initState = <any>{
            type: schema.type,
            uuid: '',
            hidden: false,
            component: schema.component,
            converters: (schema.converters || [])
                .map((cschema: ConverterSchema) => new ConverterHandler(cschema)),
            bindings: schema.bindings,
            children: [],
            parent: undefined,
            elementRef: undefined,
            instance: undefined
        };
    }

    public setBindings(bindings: BType): void {
        this._updateStore(<any>{ bindings });
    }

    public setParent(parent: AbstractSchema<any>): void {
        this._updateStore(<any>{ parent });
    }

    public setInstance(instance: any, elementRef: ElementRef): void {
        this._updateStore(<any>{ instance, elementRef });
    }

    public clearInstance(): void {
        this._updateStore(<any>{ instance: undefined, elementRef: undefined });
    }

    public get<K extends keyof State>(key: K): State[K] {
        return this._store$.getValue()[key];
    }

    public get$<K extends keyof State>(key: K): Observable<State[K]> {
        return this._store$.pipe(
            pluck<State, State[K]>(key),
            distinctUntilChanged()
        );
    }

    public getRoot(): AbstractSchema<any> {
        let x: AbstractSchema<any> = this;
        while (x.get('parent')) {
            x = x.get('parent');
        }
        return x;
    }

    public getChildListRecursive(): AbstractSchema[] {
        return [
            this,
            ...flatten(this.get('children').map((c: AbstractSchema) => c.getChildListRecursive()))
        ];
    }

    public update(checkList: string[] = []): void {
        this.getRoot()._updateSubject.next(checkList);
    }

    protected abstract _topDownUpdate(checklist: string[]): Observable<void>;
    protected abstract _bottomUpUpdate(): void;

    protected _updateStore(upd: Partial<State>): void {
        this._store$.next(Object.assign(this._store$.getValue(), upd));
    }

    protected _updateChildren(checklist: string[]): Observable<void> {
        if (this.get('children').length === 0) {
            return of();
        }
        return forkJoin(
            ...this.get('children')
                .map((child: AbstractSchema) => {
                    return child._topDownUpdate(checklist);
                })
        );
    }

    protected _updateParent(): void {
        const parent: AbstractSchema | undefined = this.get('parent');
        if (parent) {
            return parent._bottomUpUpdate();
        }
    }

}
