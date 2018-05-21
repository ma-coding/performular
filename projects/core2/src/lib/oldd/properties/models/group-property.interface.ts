import { IFieldProperty } from './field-property.interface';
import { FormTypes, Property } from './types';

export interface IGroupProperty<F extends string, B extends object, P extends FormTypes> extends IFieldProperty<'group', F, B> {
    children: Property<P>[];
}
