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

    public getParentField(): Field | undefined {
        let schema: Field = this;
        while (schema.parent()) {
            if (schema.parent().isField) {
                return <Field>schema.parent();
            }
            schema = schema.parent();
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
