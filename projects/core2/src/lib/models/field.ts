import { use } from '../mixin';
import { Abstract, IAbstract } from './abstract';
import { IValidation, Validation } from './validation';
import { IVisibility, Visibility } from './visibility';

export interface IField<T extends string, A, S extends string> extends IAbstract<T, A, S> {
    validation?: IValidation;
    visibility?: IVisibility;
}

// tslint:disable-next-line:no-empty-interface
export interface Field<A = any, S extends string = any, P = any> extends Validation, Visibility { }

// @dynamic
export abstract class Field<A, S extends string, P> extends Abstract<A, S> {

    @use(Validation, Visibility) public this: Field<A, S> | undefined;

    constructor(field: IField<string, A, S>) {
        super(field);
        this._initValidation(field.validation, this);
        this._initVisibility(field.visibility, this);
    }

    public getParentField(): Field | undefined {
        let schema: Field = this;
        while (schema.parent) {
            if (schema.parent.isField) {
                return <Field>schema.parent;
            }
            schema = schema.parent;
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
}
