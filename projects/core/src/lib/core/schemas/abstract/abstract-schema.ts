import { ElementRef } from '@angular/core';

import { forkJoin, Observable, of, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, map } from 'rxjs/operators';

import { DefaultConverter } from '../../../build-in/converter/default.converter';
import { ComponentLoader } from '../../loaders/component-loader';
import { ConverterLoader } from '../../loaders/converter-loader';
import { flatten } from '../../misc/flatten';
import { generateUUID } from '../../misc/uuid';
import { Store } from '../../redux/store';
import { AbstractSchemaActions } from './abstract-schema.actions';
import { IAbstractSchemaInitState, IAbstractSchemaState } from './abstract-schema.state';

export abstract class AbstractSchema<BindingsType> {

    protected _updateSubject: Subject<string[]> = new Subject();

    get updates$(): Observable<void> {
        return this._updateSubject.pipe(
            // tslint:disable-next-line:no-magic-numbers
            buffer(this._updateSubject.pipe(debounceTime(500))),
            map((results: string[][]) => {
                return [].concat.apply([], results);
            }),
            concatMap((checkList: string[]) => this._topDownUpdate(checkList))
        );
    }

    get state(): IAbstractSchemaState<BindingsType> {
        return this._getStore().getState();
    }

    get state$(): Observable<IAbstractSchemaState<BindingsType>> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state);
    }

    get id(): string {
        return this._getStore().getState().id;
    }

    get id$(): Observable<string> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.id);
    }

    get uuid(): string {
        return this._getStore().getState().uuid;
    }

    get uuid$(): Observable<string> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.uuid);
    }

    get hidden(): boolean {
        return this._getStore().getState().hidden;
    }

    get hidden$(): Observable<boolean> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.hidden);
    }

    get parent(): AbstractSchema<any> | undefined {
        return this._getStore().getState().parent;
    }

    get parent$(): Observable<AbstractSchema<any> | undefined> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.parent);
    }

    get children(): AbstractSchema<any>[] {
        return this._getStore().getState().children;
    }

    get children$(): Observable<AbstractSchema<any>[]> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.children);
    }

    get component(): any {
        return this._getStore().getState().component;
    }

    get component$(): Observable<any> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.component);
    }

    get bindings(): BindingsType {
        return this._getStore().getState().bindings;
    }

    get bindings$(): Observable<BindingsType> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.bindings);
    }

    get instance(): any | undefined {
        return this._getStore().getState().instance;
    }

    get instance$(): Observable<any | undefined> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.instance);
    }

    get elementRef(): ElementRef | undefined {
        return this._getStore().getState().elementRef;
    }

    get elementRef$(): Observable<ElementRef | undefined> {
        return this._getStore().select((state: IAbstractSchemaState<BindingsType>) => state.elementRef);
    }

    get root(): AbstractSchema<any> {
        let x: AbstractSchema<any> = this;
        while (x.parent) {
            x = x.parent;
        }
        return x;
    }

    constructor() { }

    public setBindings(bindings: BindingsType): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.SetBindingsAction<BindingsType>(bindings)
        );
    }

    public setParent(parent: AbstractSchema<any>): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.SetParentAction(parent)
        );
    }

    public setInstance(instance: any, elementRef: ElementRef): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.SetInstanceAction(instance, elementRef)
        );
    }

    public clearInstance(): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.SetInstanceAction(undefined, undefined)
        );
    }

    public getChildListRecursive(): AbstractSchema<any>[] {
        return [
            this,
            ...flatten(this.children.map((c: AbstractSchema<any>) => c.getChildListRecursive()))
        ];
    }

    protected abstract _topDownUpdate(checklist: string[]): Observable<void>;
    protected abstract _bottomUpUpdate(): void;
    protected abstract _getStore<T extends IAbstractSchemaState<BindingsType>>(): Store<T>;

    protected _init(initial: IAbstractSchemaInitState<BindingsType>): IAbstractSchemaState<BindingsType> {
        initial.children.forEach((child: AbstractSchema<any>) => {
            child.setParent(this);
        });
        const converter: ConverterLoader<any, BindingsType, any> =
            new ConverterLoader(initial.converter || { converter: DefaultConverter });
        return {
            ...initial,
            uuid: generateUUID(),
            hidden: false,
            component: new ComponentLoader(initial.component),
            converter: converter,
            bindings: converter.callConverter(initial.bindings)
        };
    }

    protected _updateChildren(checklist: string[]): Observable<void> {
        if (this.children.length === 0) {
            return of();
        }
        return forkJoin(
            ...this.children
                .map((child: AbstractSchema<any>) => {
                    return (child as any)._topDownUpdate(checklist);
                })
        );
    }

    protected _updateParent(): void {
        const parent: AbstractSchema<any> | undefined = this.parent;
        if (parent) {
            return parent._bottomUpUpdate();
        }
    }

}
