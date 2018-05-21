import { ElementRef } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { IField } from '../field/models/field.interface';
import { MetadataStore } from '../helpers/metadata-store';
import { generateUUID } from '../helpers/uuid';
import { IAbstractProperty } from '../properties/models/abstract-property.interface';
import { IPropertyOptions } from '../properties/models/property-options.interface';
import { PropertyType } from '../properties/models/types';
import { IAbstractSchemaState } from './models/abstract-schema-state.interface';

export abstract class AbstractSchema<State extends IAbstractSchemaState<BType> = any, BType = any> {
    protected abstract _store$: BehaviorSubject<State>;
    protected _initState: State;
    protected _options: IPropertyOptions;
    protected _update$: Subject<string[]>;

    get type(): PropertyType {
        return this._get('type');
    }

    get uuid(): string {
        return this._get('uuid');
    }

    get parent(): AbstractSchema | undefined {
        return this._get('parent');
    }

    get root(): AbstractSchema {
        let r: AbstractSchema = this;
        while (r.parent) {
            r = r.parent;
        }
        return r;
    }

    get children(): AbstractSchema[] {
        return this._get('children');
    }

    get hidden(): boolean {
        return this._get('hidden');
    }

    constructor(property: IAbstractProperty<any, any, any>, options: IPropertyOptions, value: any) {
        this._options = options;
        this._initState = <any>{
            type: property.type,
            bindings: property.bindings,
            field: MetadataStore.getField(property.field),
            children: [],
            hidden: false,
            uuid: generateUUID(),
        };
        this._update$ = new Subject();
    }

    public update(): void {
        this.root._update$.next([this.uuid]);
    }

    public setBindings(bindings: BType): void {
        this._set(<any>{ bindings });
    }

    public setParent(parent: AbstractSchema<any>): void {
        this._set(<any>{ parent });
    }

    public setInstance(instance: IField, elementRef: ElementRef): void {
        this._set(<any>{ instance, elementRef });
        if (instance && 'onInitField' in instance) {
            instance.onInitField(this);
        }
    }

    public clearInstance(): void {
        this._set(<any>{ instance: undefined, elementRef: undefined });
    }

    public isControl(): boolean {
        return this.type === PropertyType.control;
    }

    public isGroup(): boolean {
        return this.type === PropertyType.group;
    }

    public isArray(): boolean {
        return this.type === PropertyType.array;
    }

    public isLayout(): boolean {
        return this.type === PropertyType.layout;
    }

    public isField(): boolean {
        return !this.isLayout();
    }

    protected _get(): State;
    protected _get<K extends keyof State>(key: K): State[K];
    protected _get<K extends keyof State = any>(key?: any): State | State[K] {
        return key ? this._store$.getValue()[key] : this._store$.getValue();
    }

    protected _get$<K extends keyof State>(key: K): Observable<State[K]> {
        return this._store$.pipe(
            pluck<State, State[K]>(key),
            distinctUntilChanged()
        );
    }

    protected _set(upd: Partial<State>): void {
        this._store$.next(Object.assign(this._store$.getValue(), upd));
    }

    protected abstract _buildChild(child: IAbstractProperty<any, any, any>, value: any, index: number): AbstractSchema;

    protected _buildChildren(properties: IAbstractProperty<any, any, any>[], value: any): AbstractSchema[] {
        return properties.map((prop: IAbstractProperty<any, any, any>, index: number) => {
            const child: AbstractSchema = this._buildChild(prop, value, index);
            child.setParent(this);
            return child;
        });
    }

}
