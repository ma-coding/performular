import { ElementRef } from '@angular/core';

import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { use } from '../mixin';
import { Abstract, IAbstract } from './abstract';
import { CheckList, IEffectContext } from './effect';
import { IValidation, Validation } from './validation';
import { Value } from './value';
import { IVisibility, Visibility } from './visibility';

export interface IField<T extends string, F extends string = any, A = any, S extends string = any> extends IAbstract<T, F, A, S> {
    validation?: IValidation;
    visibility?: IVisibility;
}

export interface IFieldParams<T extends string, F extends string = any, A = any, S extends string = any> extends IAbstract<T, F, A, S> {
    validation?: IValidation;
    visibility?: IVisibility;
}

// tslint:disable-next-line:no-empty-interface
export interface Field<
    T extends string = any,
    F extends string = any,
    A = any,
    S extends string = any
    > extends Validation, Visibility, Value { }

// @dynamic
export abstract class Field<
    T extends string = any,
    F extends string = any,
    A = any,
    S extends string = any
    > extends Abstract<T, F, A, S> {

    @use(Validation, Visibility, Value) public this: Field<T, F, A, S> | undefined;

    constructor(field: IFieldParams<T, F, A, S>) {
        super(field);
        this._initValidation(field.validation, this);
        this._initVisibility(field.visibility, this);
    }

    public registerFramework(elementRef: ElementRef, instance: any): void {
        super.registerFramework(elementRef, instance);
        this._setValidationInstance();
    }

    public getParentField(): Field | undefined {
        let schema: Abstract = this;
        while (schema.parent) {
            const p: Abstract | undefined = schema.parent;
            if (!p) {
                return;
            }
            if (p.isField) {
                return <Field>p;
            } else {
                schema = p;
            }
        }
    }

    public getChildFields(fields: Abstract[] = this.getChildren()): Field[] {
        const erg: Field[] = [];
        fields.forEach((field: Abstract) => {
            if (field instanceof Field) {
                erg.push(field);
            } else {
                erg.push(...this.getChildFields(field.getChildren()));
            }
        });
        return erg;
    }

    protected _updateParentValue(checklist: CheckList = [this]): void {
        const parent: Field | undefined = this.getParentField();
        if (parent) {
            parent._setValue(this._buildValue());
            parent._updateParentValue([...checklist, parent]);
        } else {
            this.update(checklist);
        }
    }

    protected abstract _buildValue(): any;

    protected _run(checklist: CheckList): Observable<void> {
        const context: IEffectContext = {
            checklist: checklist,
            checked: checklist.indexOf(this) >= 0,
            field: this
        };
        return this._runVisibility(context).pipe(
            concatMap(() => this._runValidation(context))
        );
    }

    protected _update(): void {
        this._updateVisibility();
        this._updateValidation();
    }
}
