import { IPerformularTypes } from '../utils/misc';
import { use } from '../utils/mixin';
import { Abstract, FieldType, IAbstract, IAbstractProperty } from './abstract';
import { IValidation, IValidationProperty, Validation } from './effects/validation/validation';

export interface IAbstractFieldProperty<
    T extends FieldType = any,
    F extends string = any,
    A = any,
    S extends string = any,
    P extends IPerformularTypes = any
    > extends IAbstractProperty<T, F, A, S>, IValidationProperty {

}

export interface IAbstractField<
    T extends FieldType = any,
    A = any,
    S extends string = any
    > extends IAbstract<T, A, S>, IValidation {
}

export interface AbstractField<
    T extends FieldType = any,
    A = any,
    S extends string = any,
    ST extends IAbstractField<T, A, S> = any
    > extends Abstract<T, A, S, ST>, Validation<ST> { }

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

    get childFields(): AbstractField[] {
        return this._getRecursiveChildFields(this.children);
    }

    @use(Validation) public this: AbstractField | undefined;

    constructor(property: IAbstractFieldProperty<T, string, A, S>) {
        super(property);
        this._init = <any>(<IAbstractField<T, A, S>>{
            ...(<IAbstract<T, A, S>>(<any>this._init)),
            ...this._initValidation(property)
        });
    }

    public update(checklist: Abstract[]): void { }

    private _getRecursiveChildFields(children: Abstract[]): AbstractField[] {
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
