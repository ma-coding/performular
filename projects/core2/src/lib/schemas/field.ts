import { Constructable } from '../models/misc';
import { IFieldSchema } from '../models/schema';
import { Abstractable, IAbstractable } from './abstract';
import { IValidationable } from './validation';
import { IVisibilityable } from './visibility';

export interface IFieldable<T = any, F = any, A = any, S extends string = any>
    extends IAbstractable<T, F, A, S>, IValidationable, IVisibilityable {
    parentField(): IFieldable | undefined;
    getChildFields(fields: IAbstractable[]): IFieldable[];
}

export function Fieldable<T extends string, F, A, S extends string, P = any>():
    Constructable<IFieldable<T, F, A, S>, IFieldSchema<T, F, A, S>> {
    abstract class Field extends Abstractable<T, F, A, S>() {

        get parentField(): IFieldable | undefined {
            let schema: IAbstractable = this;
            while (schema.parent) {
                if (schema.parent.isField) {
                    return <IFieldable>schema.parent;
                }
                schema = schema.parent;
            }
        }

        constructor(abstract: IFieldSchema<T, F, A, S>) {
            super(abstract);
        }

        public getChildFields(fields: IAbstractable[] = this.getChildren()): IFieldable[] {
            const erg: IAbstractable[] = [];
            fields.forEach((field: IAbstractable) => {
                if (field.isField) {
                    erg.push(field);
                } else {
                    erg.push(...this.getChildFields(field.getChildren()));
                }
            });
            return erg as IFieldable[];
        }

    }
    return Field as any;
}
