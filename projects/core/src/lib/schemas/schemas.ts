import { cloneDeep, isEqual } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractFieldSchema, IAbstractFieldSchema, IAbstractFieldState } from './abstract-field.schema';
import { AbstractSchema, IAbstractSchema, IAbstractState, SchemaType } from './abstract.schema';

export interface ILayoutSchema<BType = any> extends IAbstractSchema<BType> {
    autoHide?: boolean;
    children: IFieldSchema[];
}

export interface ILayoutState<BType = any> extends IAbstractState<BType> {
    autoHide: boolean;
}

export class LayoutSchema<BType = any> extends AbstractSchema<ILayoutState, BType> {

    protected _store$: BehaviorSubject<ILayoutState<any>>;

    constructor(schema: ILayoutSchema<BType>) {
        super(schema);
        this._initState = {
            ...this._initState,
            autoHide: schema.autoHide || false,
            children: schema.children.map(creator)
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    public setAutoHide(autoHide: boolean): void {
        this._updateStore({ autoHide });
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        return this._updateChildren(checklist);
    }

    protected _bottomUpUpdate(): void {
        this._updateStore({ hidden: this._calculateHidden() });
        this._updateParent();
    }

    private _calculateHidden(): boolean {
        if (!this.get('autoHide')) {
            return false;
        }
        return this.get('children').every((element: AbstractSchema<any>) => element.get('hidden'));
    }
}

export interface IControlSchema<BType = any> extends IAbstractFieldSchema<BType> {
    value?: any;
    focus?: boolean;
}

export interface IControlState<BType = any> extends IAbstractFieldState<BType> {
    focus: boolean;
}

export class ControlSchema<BType = any> extends AbstractFieldSchema<IControlState, BType> {

    protected _store$: BehaviorSubject<IControlState<any>>;

    constructor(schema: IControlSchema<BType>) {
        super(schema);
        this._initState = {
            ...this._initState,
            value: schema.value || null,
            initValue: cloneDeep(schema.value),
            focus: schema.focus || false,
            children: []
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    public setFocus(focus: boolean): void {
        this._updateStore({
            focus: focus
        });
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        this._updateStore({
            value: value,
            changed: isEqual(this.get('initValue'), value),
            dirty: true
        });
        if (emitUpdate) {
            this._updateParentValue();
        }
    }
    public patchValue(value: any, emitUpdate: boolean = true): void {
        this._updateStore({
            value: value
        });
        if (emitUpdate) {
            this._updateParentValue();
        }
    }

    protected _buildValue(childFields: AbstractSchema[]): any {
        return this.get('value');
    }
}

export interface IGroupSchema<BType = any> extends IAbstractFieldSchema<BType> {
    children?: any;
}

export type IGroupState<BType = any> = IAbstractFieldState<BType>;

export class GroupSchema<BType = any> extends AbstractFieldSchema<IGroupState, BType> {

    protected _store$: BehaviorSubject<IGroupState<any>>;

    constructor(schema: IGroupSchema<BType>) {
        super(schema);
        const children: AbstractSchema[] = schema.children.map(creator);
        const value: any = this._buildValue(children);
        this._initState = {
            ...this._initState,
            value: value,
            initValue: cloneDeep(value),
            children: children
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        const childFields: AbstractFieldSchema[] = this.getChildFields();
        const keys: string[] = Object.keys(value);
        const keysLength: number = keys.length;
        keys.forEach((key: string, index: number) => {
            const foundChildField: AbstractFieldSchema | undefined =
                childFields.find((child: AbstractFieldSchema) => child.get('id') === key);
            if (foundChildField) {
                foundChildField.setValue(value[key], keysLength === index + 1);
            }
        });
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        const childFields: AbstractFieldSchema<any>[] = this.getChildFields();
        const keys: string[] = Object.keys(value);
        const keysLength: number = keys.length;
        Object.keys(value).forEach((key: string, index: number) => {
            const foundChildField: AbstractFieldSchema | undefined =
                childFields.find((child: AbstractFieldSchema) => child.get('id') === key);
            if (foundChildField) {
                foundChildField.setValue(value[key], keysLength === index + 1);
            }
        });
    }

    protected _buildValue(children: AbstractSchema[]): any {
        const childFields: AbstractFieldSchema<any>[] = this.getChildFields(children);
        return childFields.reduce((prev: any, child: AbstractFieldSchema<any>) => {
            prev[child.get('id')] = child.get('value');
            return prev;
        }, {});
    }
}
export interface IArraySchema<BType = any> extends IAbstractFieldSchema<BType> {
    values: any[];
    childSchema: IFieldSchema;
}

export interface IArrayState<BType = any> extends IAbstractFieldState<BType> {
    childSchema: IFieldSchema;
}

export class ArraySchema<BType = any> extends AbstractFieldSchema<IArrayState<BType>, BType> {

    protected _store$: BehaviorSubject<IArrayState<any>>;

    constructor(schema: IArraySchema<BType>) {
        super(schema);
        const children: AbstractSchema[] = schema.values.map((val: any) => creator(schema.childSchema));
        const value: any = this._buildValue(children);
        this._initState = {
            ...this._initState,
            children: children,
            value: value,
            initValue: cloneDeep(value)
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    public setValue(value: any[], emitUpdate: boolean = false): void {
        this._handleChildFields(value);
        const childFields: AbstractFieldSchema[] = this.getChildFields();
        value.forEach((val: any, index: number) => {
            if (childFields[index]) {
                childFields[index].setValue(val, value.length === index + 1);
            }
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this._handleChildFields(value);
        const childFields: AbstractFieldSchema[] = this.getChildFields();
        value.forEach((val: any, index: number) => {
            if (childFields[index]) {
                childFields[index].patchValue(val, value.length === index + 1);
            }
        });
    }

    public pushField(emitUpdate: boolean = true): void {
        this._updateStore({
            children: [
                ...this.get('children'),
                this._createChild()
            ]
        });
        if (emitUpdate) {
            this._resetChildParents();
            this._updateValue();
            this._updateParentValue();
        }
    }

    public popField(emitUpdate: boolean = true): void {
        const children: AbstractSchema[] = this.get('children');
        children.pop();
        this._updateStore({
            children: children
        });
        if (emitUpdate) {
            this._resetChildParents();
            this._updateValue();
            this._updateParentValue();
        }
    }

    public removeFieldAtIndex(index: number): void {
        const children: AbstractSchema[] = this.get('children');
        children.splice(index, 1);
        this._updateStore({
            children: children
        });
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    protected _buildValue(children: AbstractSchema<any>[]): any {
        const childFields: AbstractFieldSchema[] = this.getChildFields(children);
        return childFields.map((child: AbstractFieldSchema) => {
            return child.get('value');
        });
    }

    protected _createChild(): AbstractSchema {
        return creator(this.get('childSchema'));
    }

    protected _handleChildFields(values: any[]): void {
        if (!values || !Array.isArray(values)) {
            this._updateStore({
                children: []
            });
            return;
        }
        let childFields: AbstractFieldSchema[] = this.getChildFields();
        if (values.length === childFields.length) {
            return;
        }
        while (values.length !== childFields.length) {
            if (values.length > childFields.length) {
                this.pushField();
            }
            if (values.length < childFields.length) {
                this.popField();
            }
            childFields = this.getChildFields();
        }
        this._resetChildParents();
    }

    protected _resetChildParents(children: AbstractSchema<any>[] = this.get('children')): void {
        children.forEach((child: AbstractSchema<any>) => {
            child.setParent(this);
        });
    }
}

export type IFieldSchema = ILayoutSchema | IControlSchema | IGroupSchema | IArraySchema;

export function creator(schema: IFieldSchema): AbstractSchema {
    switch (schema.type) {
        case SchemaType.Layout: {
            return new LayoutSchema(<ILayoutSchema>schema);
        }
        case SchemaType.Control: {
            return new ControlSchema(<IControlSchema>schema);
        }
        case SchemaType.Group: {
            return new GroupSchema(<IGroupSchema>schema);
        }
        case SchemaType.Array: {
            return new ArraySchema(<IArraySchema>schema);
        }
    }
}
