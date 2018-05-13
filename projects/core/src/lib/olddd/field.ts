import { ElementRef } from '@angular/core';

import { cloneDeep, isEqual } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { buffer, debounceTime, distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { ComponentHandler, ConverterHandler, EffectHandler } from './handler';
import { flatten, generateUUID } from './helpers';
import { ConverterSchema, EffectSchema, FieldType, IField, IFieldOptions, IFieldState } from './types';

export class Field<BType = any> {

    private _store: BehaviorSubject<IFieldState<BType>>;
    private _update: Subject<string[]>;

    constructor(schema: IField<BType>, value?: any, options?: IFieldOptions) {
        this._validateField(schema);
        const children: Field[] = this._createChildren(schema, value, options);
        const effectHandlers: EffectHandler[] = (schema.effects || [])
            .map((effectSchema: EffectSchema) => new EffectHandler(effectSchema));
        const converterHandlers: ConverterHandler[] = (schema.converters || [])
            .map((converterSchema: ConverterSchema) => new ConverterHandler(converterSchema));
        const componentHandler: ComponentHandler = new ComponentHandler(schema.component);
        const initValue: any = schema.type !== FieldType.Control ? this._buildValue(schema.type, children) : value;
        this._update = new Subject();
        this._store = new BehaviorSubject<IFieldState<BType>>({
            ...schema,
            uuid: generateUUID(),
            id: schema.id || generateUUID(),
            options: options,
            value: initValue,
            initValue: cloneDeep(initValue),
            childSchema: schema.type === FieldType.Array ? <IField>schema.children : undefined,
            parent: undefined,
            elementRef: undefined,
            instance: undefined,
            hidden: false,
            disabled: false,
            invalid: false,
            errorState: false,
            changed: false,
            dirty: false,
            converters: converterHandlers,
            effects: effectHandlers,
            component: componentHandler,
            children: children,
            autoHide: schema.autoHide || false,
            focus: schema.focus || false,
        });
    }

    public get<K extends keyof IFieldState>(key: K): IFieldState[K] {
        return this._store.getValue()[key];
    }

    public get$<K extends keyof IFieldState>(key: K): IFieldState[K] {
        return this._store.pipe(
            pluck<IFieldState, IFieldState[K]>(key),
            distinctUntilChanged()
        );
    }

    public getRoot(): Field {
        let x: Field = this;
        while (x.get('parent')) {
            x = <Field>x.get('parent');
        }
        return x;
    }

    public getUpdates$(): Observable<void> {
        return this._update.pipe(
            // tslint:disable-next-line:no-magic-numbers
            buffer(this._update.pipe(debounceTime(500))),
            map(flatten),
            map((checkList: string[]) => {
                // TODO UPDATE
            })
        );
    }

    public setParent(parent: Field | undefined): void {
        this._updateStore({
            parent
        });
    }

    public setInstance(instance: any | undefined): void {
        this._updateStore({
            instance
        });
    }

    public setElementRef(elementRef: ElementRef | undefined): void {
        this._updateStore({
            elementRef
        });
    }

    public setBindings(bindings: BType): void {
        this._updateStore({
            bindings
        });
    }

    public setAutoHide(autoHide: boolean): void {
        this._updateStore({
            autoHide
        });
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        switch (this.get('type')) {
            case FieldType.Control: {
                this._updateStore({
                    value,
                    changed: isEqual(value, this.get('initValue')),
                    dirty: true
                });
                break;
            }
            case FieldType.Group: {
                const childFields: Field[] = this.getChildFields();
                const keys: string[] = Object.keys(value);
                const keysLength: number = keys.length;
                keys.forEach((key: string, index: number) => {
                    const foundChildField: Field | undefined = childFields.find((child: Field) => child.get('id') === key);
                    if (foundChildField) {
                        foundChildField.setValue(value[key], keysLength === index + 1);
                    }
                });
                break;
            }
            case FieldType.Array: {
                this._adjustChilds(value);
                const childFields: Field[] = this.getChildFields();
                value.forEach((val: any, index: number) => {
                    if (childFields[index]) {
                        childFields[index].setValue(val, value.length === index + 1);
                    }
                });
            }
        }
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        switch (this.get('type')) {
            case FieldType.Control: {
                this._updateStore({
                    value,
                    initValue: value,
                    changed: false,
                    dirty: true
                });
                break;
            }
            case FieldType.Group: {
                const childFields: Field[] = this.getChildFields();
                const keys: string[] = Object.keys(value);
                const keysLength: number = keys.length;
                keys.forEach((key: string, index: number) => {
                    const foundChildField: Field | undefined = childFields.find((child: Field) => child.get('id') === key);
                    if (foundChildField) {
                        foundChildField.patchValue(value[key], keysLength === index + 1);
                    }
                });
                break;
            }
            case FieldType.Array: {
                this._adjustChilds(value);
                const childFields: Field[] = this.getChildFields();
                value.forEach((val: any, index: number) => {
                    if (childFields[index]) {
                        childFields[index].patchValue(val, value.length === index + 1);
                    }
                });
            }
        }
    }

    public mergeBindings(bindings: Partial<BType>): void {
        this._updateStore({
            bindings: Object.assign(this.get('bindings'), bindings)
        });
    }

    public getChildFields(fields: Field[] = this.get('children')): Field[] {
        const erg: Field[] = [];
        fields.forEach((field: Field) => {
            if (field.get('type') !== FieldType.Layout) {
                erg.push(field);
            } else {
                erg.push(...this.getChildFields(field.get('children')));
            }
        });
        return erg;
    }

    public getChildListRecursive(): Field[] {
        return [
            this,
            ...flatten(this.get('children').map((c: Field) => c.getChildListRecursive()))
        ];
    }

    private _validateField(schema: IField<BType>): void {
        // TODO: MAKE VALIDATIONS FOR EACH TYPE TO DETERMINE WRONG SCHEMAS
    }

    private _createChildren(schema: IField<BType>, value?: any, options?: IFieldOptions): Field[] {
        let children: Field[] = [];
        switch (schema.type) {
            case FieldType.Control: {
                break;
            }
            case FieldType.Layout:
            case FieldType.Group: {
                children = (<IField[]>schema.children || [])
                    .map((child: IField) =>
                        this._createChild(child, value && child.id ? value[child.id] || null : null, options)
                    );
                break;
            }
            case FieldType.Array: {
                if (!Array.isArray(value)) {
                    break;
                }
                children = value.map((val: any) => this._createChild(<IField>schema.children, val, options));
            }
        }
        this._resetParents(children);
        return children;
    }

    private _createChild(schema: IField, value: any, options: IFieldOptions | undefined): Field {
        return new Field(schema, value, options);
    }

    private _resetParents(children: Field[] = this.get('children')): void {
        children.forEach((child: Field) => child.setParent(this));
    }

    private _adjustChilds(values: any[]): void {
        if (!values || !Array.isArray(values)) {
            this._updateStore({
                children: []
            });
            return;
        }
        let childFields: Field[] = this.getChildFields();
        if (values.length === childFields.length) {
            return;
        }
        const childSchema: IField | undefined = this.get('childSchema');
        if (!childSchema) {
            return;
        }
        while (values.length !== childFields.length) {
            if (values.length > childFields.length) {
                this._updateStore({
                    children: [
                        ...this.get('children'),
                        this._createChild(childSchema, null, this.get('options'))
                    ]
                });
            }
            if (values.length < childFields.length) {
                const childs: Field[] = this.get('children');
                childs.pop();
                this._updateStore({
                    children: childs
                });
            }
            childFields = this.getChildFields();
        }
        this._resetParents();
    }

    private _updateParentValue(checklist: string[] = [this.get('uuid')]): void {
        const parent: Field | undefined = this.get('parent');
        if (parent) {
            parent._updateValue();
            parent._updateParentValue(
                [
                    ...checklist,
                    parent.get('uuid')
                ]
            );
        } else {
            this.getRoot()._update.next(checklist);
        }
    }

    private _updateValue(): void {
        const type: FieldType = this.get('type');
        if (type === FieldType.Control || type === FieldType.Layout) {
            return;
        }
        const newValue: any = this._buildValue(type, this.get('children'));
        const anyChildChanged: boolean = this._isAnyChildChanged();
        const initValue: any = anyChildChanged ? this.get('initValue') : cloneDeep(newValue);
        this._updateStore({
            value: newValue,
            initValue: initValue,
            changed: isEqual(newValue, initValue)
        });
    }

    private _isAnyChildChanged(): boolean {
        return this.get('children').some((child: Field) => child.get('changed'));
    }

    private _buildValue(type: FieldType, children: Field[]): any {
        switch (type) {
            case FieldType.Control: {
                break;
            }
            case FieldType.Layout: {
                break;
            }
            case FieldType.Group: {
                const childFields: Field[] = this.getChildFields(children);
                return childFields.reduce((prev: any, child: Field) => {
                    prev[child.get('id')] = child.get('value');
                    return prev;
                }, {});
            }
            case FieldType.Array: {
                const childFields: Field[] = this.getChildFields(children);
                return childFields.map((child: Field) => {
                    return child.get('value');
                });
            }
        }
    }

    private _updateStore(value: Partial<IFieldState>): void {
        this._store.next({
            ...this._store.getValue(),
            ...value
        });
    }
}
