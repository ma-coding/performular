import { IAbstractProperty } from './abstract-property.interface';
import { FormTypes, Property } from './types';

export interface ILayoutProperty<F extends string, B extends object, P extends FormTypes>
    extends IAbstractProperty<'layout', F, B> {
    id?: string;
    children: Property<P>[];
}
