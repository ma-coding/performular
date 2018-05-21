import { IItemSchema } from './item';
import { ILayoutSchema } from './layout';
import { IValidationSchema } from './validation';
import { IVisibilitySchema } from './visibility';

export interface IAbstractSchema<T, A> extends IItemSchema {
    type: T;
    field: string;
    attrs: A;
}

export interface IFieldSchema<T, A> extends IAbstractSchema<T, A> {
    validations?: IValidationSchema;
    visibility?: IVisibilitySchema;
}

export interface IControlSchema<A> extends IFieldSchema<'control', A> {
    focus?: boolean;
}

export interface IGroupSchema<A, P extends IAbstractSchema<any, any>> extends IFieldSchema<'group', A>, ILayoutSchema {
    children: { [id: string]: P };
}

export interface IArraySchema<A, P extends IAbstractSchema<any, any>> extends IFieldSchema<'array', A>, ILayoutSchema {
    childSchema: P;
}

export interface IContainerSchema<A, P extends IAbstractSchema<any, any>> extends IAbstractSchema<'container', A>, ILayoutSchema {
    autoHide?: boolean;
    children: P[];
}
