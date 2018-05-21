import { IFieldProperty } from './field-property.interface';
import { FormTypes, Property } from './types';

export interface IArrayProperty<F extends string, B extends object, P extends FormTypes> extends IFieldProperty<'array', F, B> {
    childSchema: Property<P>;
}
