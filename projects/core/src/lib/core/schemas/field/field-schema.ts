import { Type } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
    IValidationDefinition,
    IVisibilityDefinition,
    TriggerLoader,
    ValidationLoader,
    VisibilityLoader,
} from '../../loaders/trigger-loader';
import { AbstractSchema } from '../abstract/abstract-schema';
import { AbstractSchemaActions } from '../abstract/abstract-schema.actions';
import { LayoutSchema } from '../layout/layout-schema';
import { FieldSchemaActions } from './field-schema.actions';
import { FieldType, IFieldSchemaInitState, IFieldSchemaState } from './field-schema.state';

export abstract class FieldSchema<BindingsType> extends AbstractSchema<BindingsType> {

    get type(): FieldType {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().type;
    }

    get type$(): Observable<FieldType> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.type);
    }

    get focus(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().focus || false;
    }

    get focus$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.focus).pipe(
                map((f: boolean | undefined) => !!f)
            );
    }

    get disabled(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().disabled;
    }

    get disabled$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.disabled);
    }

    get invalid(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().invalid;
    }

    get invalid$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.invalid);
    }

    get errorState(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().errorState;
    }

    get errorState$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.errorState);
    }

    get changed(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().changed;
    }

    get changed$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.changed);
    }

    get dirty(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().dirty;
    }

    get dirty$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.dirty);
    }

    get forceDisabled(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().forceDisabled || false;
    }

    get forceDisabled$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.forceDisabled).pipe(
                map((f: boolean | undefined) => !!f)
            );
    }

    get forceHidden(): boolean {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().forceHidden || false;
    }

    get forceHidden$(): Observable<boolean> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.forceHidden).pipe(
                map((f: boolean | undefined) => !!f)
            );
    }

    get value(): any {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().value;
    }

    get value$(): Observable<any> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.value);
    }

    get hiddenWhen(): any[] {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().hiddenWhen || [];
    }

    get hiddenResults(): boolean[] {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().hiddenResults;
    }

    get hiddenResults$(): Observable<boolean[]> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.hiddenResults);
    }

    get disabledResults(): boolean[] {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().disabledResults;
    }

    get disabledResults$(): Observable<boolean[]> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.disabledResults);
    }

    get errorResults(): string[] {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().errorResults;
    }

    get errorResults$(): Observable<string[]> {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .select((state: IFieldSchemaState<BindingsType>) => state.errorResults);
    }

    get disabledWhen(): any[] {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().disabledWhen || [];
    }

    get errorWhen(): any[] {
        return this._getStore<IFieldSchemaState<BindingsType>>()
            .getState().errorWhen || [];
    }

    get rootField(): FieldSchema<any> {
        let x: FieldSchema<any> = this;
        let y: AbstractSchema<any> | undefined = this;
        while (y) {
            if (y instanceof FieldSchema) {
                x = y;
            }
            y = y.parent;
        }
        return x;
    }

    public abstract setValue(value: any, emitUpdate: boolean): void;
    public abstract patchValue(value: any, emitUpdate: boolean): void;

    public setForceDisabled(disabled: boolean): void {
        this._getStore<IFieldSchemaState<BindingsType>>().dispatch(
            new FieldSchemaActions.SetForceDisabledAction(disabled)
        );
        (this.root as any)._updateSubject.next([this.uuid]);
    }

    public setForceHidden(hidden: boolean): void {
        this._getStore<IFieldSchemaState<BindingsType>>().dispatch(
            new FieldSchemaActions.SetForceHiddenAction(hidden)
        );
        (this.root as any)._updateSubject.next([this.uuid]);
    }

    public findField(ids: (string | number)[]): IFieldSchemaState<any> | undefined {
        return ids.reduce((prev: IFieldSchemaState<any>, curr: string | number) => {
            if (!prev) {
                return undefined;
            }
            return (prev as any)._getChildFields().find((child: IFieldSchemaState<any>, index: number) => {
                if (prev.type === FieldType.Array) {
                    return index === curr;
                } else {
                    return child.id === curr;
                }
            });
        }, this);
    }

    protected abstract _buildValue(state: IFieldSchemaState<BindingsType>): any;

    protected _init(initial: IFieldSchemaInitState<BindingsType>): IFieldSchemaState<BindingsType> {
        return {
            ...initial,
            ...super._init(initial),
            initialValue: initial.value,
            hiddenResults: [],
            disabledResults: [],
            errorResults: [],
            disabled: false,
            invalid: false,
            errorState: false,
            changed: false,
            dirty: false,
            disabledWhen: (initial.disabledWhen || [])
                .map((def: IVisibilityDefinition<any>) => new VisibilityLoader(def)),
            hiddenWhen: (initial.hiddenWhen || [])
                .map((def: IVisibilityDefinition<any>) => new VisibilityLoader(def)),
            errorWhen: (initial.errorWhen || [])
                .map((def: IValidationDefinition<any>) => new ValidationLoader(def))
        };
    }

    protected _getChildFields(fields: AbstractSchema<any>[] = this.children): FieldSchema<any>[] {
        const erg: FieldSchema<any>[] = [];
        fields.forEach((field: AbstractSchema<any>) => {
            if (field instanceof FieldSchema) {
                erg.push(field);
            } else if (field instanceof LayoutSchema) {
                erg.push(...this._getChildFields(field.children));
            }
        });
        return erg;
    }

    protected _getParentField(): FieldSchema<any> | undefined {
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

    protected _updateParentValue(checklist: string[] = [(this.uuid || '')]): void {
        const parent: FieldSchema<any> | undefined = this._getParentField();
        if (parent) {
            parent._updateValue();
            parent._updateParentValue([...checklist, (parent.uuid || '')]);
        } else {
            (this.root as any)._updateSubject.next(checklist);
        }
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        const checked: boolean = checklist.indexOf(this.uuid) >= 0;
        return this._updateHiddenWhen(checked).pipe(
            switchMap(() => this._updateDisabledWhen(checked)),
            switchMap(() => this._updateErrorWhen(checked)),
            switchMap(() => this._updateChildren(checklist)),
            map(() => {
                if (this.type === FieldType.Control) {
                    this._bottomUpUpdate();
                }
            })
        );
    }

    protected _bottomUpUpdate(): void {
        const anyChildInvalid: boolean = this._getChildFields().some((child: FieldSchema<any>) => child.invalid);
        if (!this.invalid && anyChildInvalid) {
            this._getStore<IFieldSchemaState<BindingsType>>().dispatch(
                new FieldSchemaActions.SetInvalidAction(true)
            );
        }
        this._updateParent();
    }

    protected _updateHiddenWhen(checked: boolean): Observable<void> {
        const parentField: FieldSchema<any> | undefined = this._getParentField();
        const parentHidden: boolean = parentField ? parentField.hidden : false;
        return this.__updateTrigger<boolean>(
            this.disabledWhen,
            checked,
            FieldSchemaActions.SetHiddenResultsAction,
            AbstractSchemaActions.SetHiddenAction,
            (results: boolean[]) => results.indexOf(true) >= 0 || this.forceHidden || parentHidden
        );
    }

    protected _updateDisabledWhen(checked: boolean): Observable<void> {
        const parentField: FieldSchema<any> | undefined = this._getParentField();
        const parentDisabled: boolean = parentField ? parentField.disabled : false;
        return this.__updateTrigger<boolean>(
            this.disabledWhen,
            checked,
            FieldSchemaActions.SetDisabledResultsAction,
            FieldSchemaActions.SetDisabledAction,
            (results: boolean[]) => results.indexOf(true) >= 0 || this.forceDisabled || parentDisabled
        );
    }

    protected _updateErrorWhen(checked: boolean): Observable<void> {
        return this.__updateTrigger<string>(
            this.errorWhen,
            checked,
            FieldSchemaActions.SetErrorResultsAction,
            FieldSchemaActions.SetInvalidAction,
            (results: string[]) => !!results.find((error: string): boolean => error != null && error !== undefined)
        );
    }

    protected _updateValue(): void {
        const newValue: any = this._buildValue(this.state as IFieldSchemaState<BindingsType>);
        this._getStore<IFieldSchemaState<BindingsType>>().dispatch(
            new FieldSchemaActions.SetValueAction(newValue)
        );
    }

    private __updateTrigger<T>(
        triggers: TriggerLoader<any, T>[],
        checked: boolean,
        resultAction: Type<any>,
        keyAction: Type<any>,
        keyConditionFunction: (results: T[]) => boolean
    ): Observable<void> {
        return forkJoin(
            ...triggers.map((triggerDef: TriggerLoader<any, T>) => triggerDef.callTrigger(this, checked)),
            of(false)
        ).pipe(
            map((results: T[]) => {
                results.pop();
                this._getStore<IFieldSchemaState<BindingsType>>().dispatch(
                    new resultAction(results)
                );
                this._getStore<IFieldSchemaState<BindingsType>>().dispatch(
                    new keyAction(
                        keyConditionFunction(results)
                    )
                );
            })
        );
    }
}
