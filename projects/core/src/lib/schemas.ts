import { ElementRef } from '@angular/core';

import { cloneDeep } from 'lodash';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { buffer, concatMap, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { AbstractActions, FieldActions, LayoutActions } from './actions';
import { ISchemaMetadata, SchemaType } from './decorators';
import { flatten, generateUUID, Store } from './helpers';
import { ConverterLoader, ITriggerResult, SchemaLoader, TriggerLoader } from './loaders';

/*
    ABSTRACT SECTION
*/

export interface IAbstractSchema {
    component: string;
    bindings: any;
    converters?: string[];
}

export interface IAbstractState {
    uuid: string;
    hidden: boolean;
    component: SchemaLoader;
    converters: ConverterLoader[];
    bindings: any;
    children: AbstractSchema[];
    parent?: AbstractSchema;
    elementRef?: ElementRef;
    instance?: any;
}

export abstract class AbstractSchema<State extends IAbstractState = any> {
    protected abstract _store$: Store<State>;
    protected _initialState: State;

    protected _updateSubject: Subject<string[]> = new Subject();

    get updates$(): Observable<void> {
        return this._updateSubject.pipe(
            // tslint:disable-next-line:no-magic-numbers
            buffer(this._updateSubject.pipe(debounceTime(500))),
            map(flatten),
            concatMap((checkList: string[]) => this._topDownUpdate(checkList))
        );
    }

    get uuid(): string {
        return this._store$.getState().uuid;
    }

    get uuid$(): Observable<string> {
        return this._select('uuid');
    }

    get hidden(): boolean {
        return this._store$.getState().hidden;
    }

    get hidden$(): Observable<boolean> {
        return this._select('hidden');
    }

    get component(): SchemaLoader {
        return this._store$.getState().component;
    }

    get component$(): Observable<SchemaLoader> {
        return this._select('component');
    }

    get bindings(): any {
        return this._store$.getState().bindings;
    }

    get bindings$(): Observable<any> {
        return this._select('bindings');
    }

    get children(): AbstractSchema[] {
        return this._store$.getState().children;
    }

    get children$(): Observable<AbstractSchema[]> {
        return this._select('children');
    }

    get parent(): AbstractSchema | undefined {
        return this._store$.getState().parent;
    }

    get parent$(): Observable<AbstractSchema | undefined> {
        return this._select('parent');
    }

    get elementRef(): ElementRef | undefined {
        return this._store$.getState().elementRef;
    }

    get elementRef$(): Observable<ElementRef | undefined> {
        return this._select('elementRef');
    }

    get instance(): any | undefined {
        return this._store$.getState().instance;
    }

    get instance$(): Observable<any | undefined> {
        return this._select('instance');
    }

    get root(): AbstractSchema<any> {
        let x: AbstractSchema<any> = this;
        while (x.parent) {
            x = x.parent;
        }
        return x;
    }

    constructor(schema: IAbstractSchema, options?: ISchemaBuildOptions) {
        const converters: ConverterLoader[] = (schema.converters || []).map((converter: string) => {
            const con: ConverterLoader = new ConverterLoader(converter);
            schema.bindings = con.callConverter(schema.bindings);
            return con;
        });
        this._initialState = <any>{
            uuid: generateUUID(),
            hidden: false,
            children: [],
            component: new SchemaLoader(schema.component),
            converters: converters,
            bindings: schema.bindings
        };
    }

    public setBindings(bindings: any): void {
        this._store$.dispatch(
            new AbstractActions.SetBindingsAction(bindings)
        );
    }

    public setParent(parent: AbstractSchema<any>): void {
        this._store$.dispatch(
            new AbstractActions.SetParentAction(parent)
        );
    }

    public setInstance(instance: any, elementRef: ElementRef): void {
        this._store$.dispatch(
            new AbstractActions.SetInstanceAction(instance, elementRef)
        );
    }

    public clearInstance(): void {
        this._store$.dispatch(
            new AbstractActions.SetInstanceAction(undefined, undefined)
        );
    }

    public getChildListRecursive(): AbstractSchema<any>[] {
        return [
            this,
            ...flatten(this.children.map((c: AbstractSchema<any>) => c.getChildListRecursive()))
        ];
    }

    public update(checkList: string[] = []): void {
        this._updateSubject.next(checkList);
    }

    protected abstract _topDownUpdate(checklist: string[]): Observable<void>;
    protected abstract _bottomUpUpdate(): void;

    protected _select<K extends keyof State>(key: K): Observable<State[K]> {
        return this._store$.select((state: State) => state[key]);
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

/*
    LAYOUT SECTION
*/

export interface ILayoutSchema extends IAbstractSchema {
    autoHide?: boolean;
    children: IAbstractSchema[];
}

export interface ILayoutState extends IAbstractState {
    autoHide: boolean;
}

export class LayoutSchema extends AbstractSchema<ILayoutState> {

    protected _store$: Store<ILayoutState>;

    get autoHide(): boolean {
        return this._store$.getState().autoHide;
    }

    get autoHide$(): Observable<boolean> {
        return this._select('autoHide');
    }

    constructor(schema: ILayoutSchema, options?: ISchemaBuildOptions) {
        super(schema, options);
        this._initialState = {
            ...this._initialState,
            autoHide: schema.autoHide || false,
            children: schema.children.map(
                (child: IAbstractSchema) => {
                    const childSchema: AbstractSchema = SchemaBuilder.create(child, options);
                    childSchema.setParent(this);
                    return childSchema;
                })
        };
        this._store$ = new Store(this._initialState);
    }

    public setAutoHide(value: boolean): void {
        this._store$.dispatch(
            new LayoutActions.SetAutoHideAction(value)
        );
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        return this._updateChildren(checklist);
    }

    protected _bottomUpUpdate(): void {
        this._store$.dispatch(
            new AbstractActions.SetHiddenAction(
                this._calculateHidden()
            )
        );
        this._updateParent();
    }

    private _calculateHidden(): boolean {
        if (!this._store$.getState().autoHide) {
            return false;
        }
        return this._store$.getState().children.every((element: AbstractSchema<any>) => element.hidden);
    }

}

/*
    FIELD SECTION
*/

export enum TriggerAction {
    Hide = 'Hide',
    Disable = 'Disable',
    Error = 'Error'
}

export interface ITriggerSchema {
    type: string;
    action: TriggerAction;
    errorMsg?: string;
    params?: any;
}

export interface IFieldSchema extends IAbstractSchema {
    id: string;
    effects?: ITriggerSchema[];
}

export interface IFieldState extends IAbstractState {
    id: string;
    effects: TriggerLoader[];
    effectResults: ITriggerResult[];
    initValue: any;
    value: any;
    disabled: boolean;
    invalid: boolean;
    errorState: boolean;
    changed: boolean;
    dirty: boolean;
}

export abstract class FieldSchema<State extends IFieldState = any> extends AbstractSchema<State> {

    get id(): string {
        return this._store$.getState().id;
    }

    get id$(): Observable<string> {
        return this._select('id');
    }

    get effects(): TriggerLoader[] {
        return this._store$.getState().effects;
    }

    get effects$(): Observable<TriggerLoader[]> {
        return this._select('effects');
    }

    get effectResults(): ITriggerResult[] {
        return this._store$.getState().effectResults;
    }

    get effectResults$(): Observable<ITriggerResult[]> {
        return this._select('effectResults');
    }

    get initValue(): any {
        return this._store$.getState().initValue;
    }

    get initValue$(): Observable<any> {
        return this._select('initValue');
    }

    get value(): any {
        return this._store$.getState().value;
    }

    get value$(): Observable<any> {
        return this._select('value');
    }

    get disabled(): boolean {
        return this._store$.getState().disabled;
    }

    get disabled$(): Observable<boolean> {
        return this._select('disabled');
    }

    get invalid(): boolean {
        return this._store$.getState().invalid;
    }

    get invalid$(): Observable<boolean> {
        return this._select('invalid');
    }

    get errorState(): boolean {
        return this._store$.getState().errorState;
    }

    get errorState$(): Observable<boolean> {
        return this._select('errorState');
    }

    get errors(): (string | undefined)[] {
        return this.effectResults
            .filter((result: ITriggerResult) => result.trigger.action === TriggerAction.Error && result.result === true)
            .map((result: ITriggerResult) => result.trigger.errorMsg);

    }

    get errors$(): Observable<(string | undefined)[]> {
        return this.effectResults$.pipe(
            map((results: ITriggerResult[]) =>
                results.filter((result: ITriggerResult) => result.trigger.action === TriggerAction.Error && result.result === true)
                    .map((result: ITriggerResult) => result.trigger.errorMsg)
            ),
            distinctUntilChanged()
        );
    }

    get changed(): boolean {
        return this._store$.getState().changed;
    }

    get changed$(): Observable<boolean> {
        return this._select('changed');
    }

    get dirty(): boolean {
        return this._store$.getState().dirty;
    }

    get dirty$(): Observable<boolean> {
        return this._select('dirty');
    }

    get rootField(): FieldSchema {
        let x: FieldSchema = this;
        let y: AbstractSchema | undefined = this;
        while (y) {
            if (y instanceof FieldSchema) {
                x = y;
            }
            y = y.parent;
        }
        return x;
    }

    get parentField(): FieldSchema | undefined {
        let schema: AbstractSchema<any> = this;
        let ret: FieldSchema<any> = this;
        while (schema.parent) {
            if (schema.parent instanceof FieldSchema) {
                ret = schema.parent;
                break;
            }
            schema = schema.parent;
        }
        return ret !== this ? ret : undefined;
    }

    constructor(schema: IFieldSchema, options?: ISchemaBuildOptions) {
        super(schema, options);
        this._initialState = <any>{
            ...<IAbstractState>this._initialState,
            id: schema.id,
            effects: (schema.effects || []).map((triggerSchema: ITriggerSchema) => new TriggerLoader(triggerSchema)),
            effectResults: [],
            value: undefined,
            invalid: false,
            errorState: false,
            changed: false,
            dirty: false
        };
    }

    public getChildFields(fields: AbstractSchema<any>[] = this.children): FieldSchema<any>[] {
        const erg: FieldSchema<any>[] = [];
        fields.forEach((field: AbstractSchema<any>) => {
            if (field instanceof FieldSchema) {
                erg.push(field);
            } else if (field instanceof LayoutSchema) {
                erg.push(...this.getChildFields(field.children));
            }
        });
        return erg;
    }

    public abstract setValue(value: any, emitUpdate: boolean): void;
    public abstract patchValue(value: any, emitUpdate: boolean): void;

    protected _updateValue(): void {
        const newValue: any = this._buildValue(this.getChildFields());
        this._store$.dispatch(
            new FieldActions.SetValueAction(newValue)
        );
    }

    protected _updateParentValue(checklist: string[] = [(this.uuid || '')]): void {
        const parent: FieldSchema | undefined = this.parentField;
        if (parent) {
            parent._updateValue();
            parent._updateParentValue([...checklist, (parent.uuid || '')]);
        } else {
            this.root.update(checklist);
        }
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        const checked: boolean = checklist.indexOf(this.uuid) >= 0;
        return this._updateEffects(checked).pipe(
            switchMap(() => this._updateChildren(checklist)),
            map(() => {
                if (this instanceof ControlSchema) {
                    this._bottomUpUpdate();
                }
            })
        );
    }

    protected _bottomUpUpdate(): void {
        this._updateParent();
    }

    protected _updateEffects(checked: boolean): Observable<void> {
        return forkJoin(
            ...this._store$.getState().effects.map((effect: TriggerLoader) => {
                return effect.callTrigger(this, checked);
            }),
            of(false)
        ).pipe(
            map((results: ITriggerResult[]) => {
                results.pop();
                this._store$.dispatch(new FieldActions.SetEffectResultsAction(results, this.parentField));
            })
        );
    }

    protected abstract _buildValue(childFields: AbstractSchema[]): any;
}

/*
    CONTROL SECTION
*/

export interface IControlSchema extends IFieldSchema {
    value: any;
    focus?: boolean;
}

export interface IControlState extends IFieldState {
    focus: boolean;
}

export class ControlSchema extends FieldSchema<IControlState> {

    protected _store$: Store<IControlState>;

    get focus(): boolean {
        return this._store$.getState().focus;
    }

    get focus$(): Observable<boolean> {
        return this._select('focus');
    }

    constructor(schema: IControlSchema, options?: ISchemaBuildOptions) {
        super(schema, options);
        this._initialState.value = schema.value;
        this._initialState.initValue = cloneDeep(schema.value);
        this._initialState.focus = schema.focus || false;
        this._store$ = new Store(this._initialState);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        this._store$.dispatch(
            new FieldActions.SetValueAction(value)
        );
        if (emitUpdate) {
            this._updateParentValue();
        }
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        this._store$.dispatch(
            new FieldActions.PatchValueAction(value)
        );
        if (emitUpdate) {
            this._updateParentValue();
        }
    }
    protected _buildValue(): any {
        return this.value;
    }

}

/*
    GROUP SECTION
*/

export interface IGroupSchema extends IFieldSchema {
    children: IAbstractSchema[];
}

export type IGroupState = IFieldState;

export class GroupSchema extends FieldSchema<IGroupState> {

    protected _store$: Store<IGroupState>;

    constructor(schema: IGroupSchema, options?: ISchemaBuildOptions) {
        super(schema, options);
        const children: AbstractSchema[] = this._createChildren(schema.children, options);
        const value: any = this._buildValue(children);
        this._initialState = {
            ...this._initialState,
            children: children,
            value: value,
            initValue: cloneDeep(value)
        };
        this._store$ = new Store(this._initialState);
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        const childFields: FieldSchema[] = this.getChildFields();
        const keys: string[] = Object.keys(value);
        const keysLength: number = keys.length;
        keys.forEach((key: string, index: number) => {
            const foundChildField: FieldSchema | undefined = childFields.find((child: FieldSchema) => child.id === key);
            if (foundChildField) {
                foundChildField.setValue(value[key], keysLength === index + 1);
            }
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        const childFields: FieldSchema<any>[] = this.getChildFields();
        const keys: string[] = Object.keys(value);
        const keysLength: number = keys.length;
        Object.keys(value).forEach((key: string, index: number) => {
            const foundChildField: FieldSchema | undefined = childFields.find((child: FieldSchema) => child.id === key);
            if (foundChildField) {
                foundChildField.setValue(value[key], keysLength === index + 1);
            }
        });
    }
    protected _buildValue(children: AbstractSchema[]): any {
        const childFields: FieldSchema<any>[] = this.getChildFields(children);
        return childFields.reduce((prev: any, child: FieldSchema<any>) => {
            prev[child.id] = child.value;
            return prev;
        }, {});
    }

    private _createChildren(children: IAbstractSchema[], options?: ISchemaBuildOptions): AbstractSchema[] {
        return children.map((child: IAbstractSchema) => {
            const schema: AbstractSchema = SchemaBuilder.create(child, options);
            schema.setParent(this);
            return schema;
        });
    }

}

/*
    ARRAY SECTION
*/

export interface IArraySchema extends IFieldSchema {
    child: IAbstractSchema;
    values: any[];
}

export interface IArrayState extends IFieldState {
    childSchema: IAbstractSchema;
}

export class ArraySchema extends FieldSchema<IArrayState> {

    protected _store$: Store<IArrayState>;

    get childSchema(): IAbstractSchema {
        return this._store$.getState().childSchema;
    }

    get childSchema$(): Observable<IAbstractSchema> {
        return this._select('childSchema');
    }

    constructor(schema: IArraySchema, options?: ISchemaBuildOptions) {
        super(schema, options);
        const children: AbstractSchema[] = schema.values.map((val: any) => {
            const child: AbstractSchema = SchemaBuilder.create(schema.child, options);
            child.setParent(this);
            return child;
        });

        this._initialState = {
            ...this._initialState,
            childSchema: schema.child,
            children: children
        };
        this._store$ = new Store(this._initialState);
        this.patchValue(schema.values);
    }

    public setValue(value: any[], emitUpdate: boolean = false): void {
        this._handleChildFields(value);
        const childFields: FieldSchema<any>[] = this.getChildFields();
        value.forEach((val: any, index: number) => {
            if (childFields[index]) {
                childFields[index].setValue(val, value.length === index + 1);
            }
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this._handleChildFields(value);
        const childFields: FieldSchema<any>[] = this.getChildFields();
        value.forEach((val: any, index: number) => {
            if (childFields[index]) {
                childFields[index].patchValue(val, value.length === index + 1);
            }
        });
    }

    public pushField(): void {
        this._store$.dispatch(
            new AbstractActions.PushChildAction(
                this._createChild()
            )
        );
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    public popField(): void {
        this._store$.dispatch(
            new AbstractActions.PopChildAction()
        );
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    public removeFieldAtIndex(index: number): void {
        this._store$.dispatch(
            new AbstractActions.RemoveChildAtIndexAction(index)
        );
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    protected _buildValue(children: AbstractSchema<any>[]): any {
        const childFields: FieldSchema<any>[] = this.getChildFields(children);
        return childFields.map((child: FieldSchema<any>) => {
            return child.value;
        });
    }

    protected _createChild(): AbstractSchema {
        return SchemaBuilder.create(this.childSchema);
    }

    protected _handleChildFields(values: any[]): void {
        if (!values || !Array.isArray(values)) {
            this._store$.dispatch(
                new AbstractActions.ClearChildrenAction()
            );
            return;
        }
        let childFields: FieldSchema<any>[] = this.getChildFields();
        if (values.length === childFields.length) {
            return;
        }
        while (values.length !== childFields.length) {
            if (values.length > childFields.length) {
                this._store$.dispatch(
                    new AbstractActions.PushChildAction(
                        this._createChild()
                    )
                );
            }
            if (values.length < childFields.length) {
                this._store$.dispatch(
                    new AbstractActions.PopChildAction()
                );
            }
            childFields = this.getChildFields();
        }
        this._resetChildParents();
    }

    protected _resetChildParents(children: AbstractSchema<any>[] = this.children): void {
        children.forEach((child: AbstractSchema<any>) => {
            child.setParent(this);
        });
    }
}

export interface ISchemaBuildOptions {
    errorState: boolean;
}

export class SchemaBuilder {

    public static create(schema: IAbstractSchema, options?: ISchemaBuildOptions): AbstractSchema {
        const metadata: ISchemaMetadata = this._getMetadata(schema);
        switch (metadata.type) {
            case SchemaType.Group: {
                return new GroupSchema(<IGroupSchema>schema, options);
            }
            case SchemaType.Array: {
                return new ArraySchema(<IArraySchema>schema, options);
            }
            case SchemaType.Control: {
                return new ControlSchema(<IControlSchema>schema, options);
            }
            case SchemaType.Layout: {
                return new LayoutSchema(<ILayoutSchema>schema, options);
            }
            default: {
                throw new Error('Unknown SchemaType');
            }
        }
    }

    private static _getMetadata(schema: IAbstractSchema): ISchemaMetadata {
        const schemaLoader: SchemaLoader = new SchemaLoader(schema.component);
        return schemaLoader.metadata;
    }
}
