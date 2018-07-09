import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { use } from '../utils/mixin';
import { Abstract, FieldType, IAbstract, IAbstractParams, IAbstractProperty } from './abstract';
import { IEffectContext } from './effects/effect';
import { IValidation, IValidationProperty, Validation } from './effects/validation/validation';
import { IVisibility, IVisibilityProperty, Visibility } from './effects/visibility/visibility';
import { IValue, IValueProperty, Value, ValueMode } from './value/value';

export interface IAbstractFieldParams<
    T extends FieldType = any,
    F extends string = any,
    A = any,
    S extends string = any
    > extends IAbstractParams<T, F, A, S>, IValidationProperty, IVisibilityProperty { }

export interface IAbstractFieldProperty<
    T extends FieldType = any,
    F extends string = any,
    A = any,
    S extends string = any,
    > extends IAbstractProperty<T, F, A, S>, IValidationProperty, IVisibilityProperty, IValueProperty { }

export interface IAbstractField<
    T extends FieldType = any,
    A = any,
    S extends string = any
    > extends IAbstract<T, A, S>, IValidation, IVisibility, IValue {
}

export interface AbstractField<
    T extends FieldType = any,
    A = any,
    S extends string = any,
    ST extends IAbstractField<T, A, S> = any
    > extends Abstract<T, A, S, ST>, Validation<ST>, Visibility<ST>, Value<ST> { }

export abstract class AbstractField<
    T extends FieldType = any,
    A = any,
    S extends string = any,
    ST extends IAbstractField<T, A, S> = any
    > extends Abstract<T, A, S, ST> {

    get parentField(): AbstractField | undefined {
        let schema: Abstract = this;
        while (schema.parent) {
            const p: Abstract | undefined = schema.parent;
            if (!p) {
                return;
            }
            if (p instanceof AbstractField) {
                return p;
            } else {
                schema = p;
            }
        }
    }

    get rootField(): AbstractField {
        let field: AbstractField = this;
        while (field.parentField) {
            field = field.parentField;
        }
        return field;
    }

    get childFields(): AbstractField[] {
        return this._getRecursiveChildFields(this.children);
    }

    @use(Validation, Visibility, Value) public this: AbstractField | undefined;

    constructor(property: IAbstractFieldProperty<T, string, A, S>) {
        super(property);
        this._init = <any>(<IAbstractField<T, A, S>>{
            ...(<IAbstract<T, A, S>>(<any>this._init)),
            ...this._initValidation(property),
            ...this._initVisibility(property)
        });
    }

    public find<F extends AbstractField = AbstractField>(path: Array<string | number>): F | undefined {
        if (path instanceof Array && (path.length === 0)) {
            return undefined;
        }

        return (<Array<string | number>>path).reduce((v: AbstractField | undefined, name: string | number) => {
            if (!v) {
                return undefined;
            }

            if (v.type === 'group') {
                return v.childFields.find((c: AbstractField) => c.id === name);
            }

            if (v.type === 'array') {
                return v.childFields[name];
            }

            return undefined;
        }, this);
    }

    public abstract setValue(value: any, emitUpdate: boolean): void;
    public abstract patchValue(value: any, emitUpdate: boolean): void;
    public abstract resetValue(emitUpdate: boolean): void;

    protected abstract _buildValue(children?: AbstractField[]): any;

    protected _updateParentValue(checklist: Abstract[] = [this], mode: ValueMode): void {
        const parent: AbstractField | undefined = this.parentField;
        if (parent) {
            parent._createValue(mode, parent._buildValue());
            parent._updateParentValue([...checklist, parent], mode);
        } else {
            this.update(checklist);
        }
    }

    protected _run(checklist: Abstract[]): Observable<void> {
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

    protected _getRecursiveChildFields(children: Abstract[]): AbstractField[] {
        const erg: AbstractField[] = [];
        children.forEach((child: Abstract) => {
            if (child instanceof AbstractField) {
                erg.push(child);
            } else {
                erg.push(
                    ...this._getRecursiveChildFields(child.children)
                );
            }
        });
        return erg;
    }

}
