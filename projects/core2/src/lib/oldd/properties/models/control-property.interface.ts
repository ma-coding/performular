import { IFieldProperty } from './field-property.interface';

export interface IControlProperty<F extends string, B extends object> extends IFieldProperty<'control', F, B> {
    focus?: boolean;
}
