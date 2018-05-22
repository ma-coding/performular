import { IFrameworkSchema } from './framework';
import { IItemSchema } from './item';
import { ILayoutSchema } from './layout';
import { MapType } from './misc';
import { IValidationSchema } from './validation';
import { IVisibilitySchema } from './visibility';

export interface IAbstractSchema<T, F, A, S extends string> extends IItemSchema, IFrameworkSchema<F, A, S> {
    type: T;
}

export interface IContainerSchema<F, A, S extends string, P>
    extends IAbstractSchema<'container', F, A, S>, ILayoutSchema {
    autoHide?: boolean;
    children: P[];
}

export interface IFieldSchema<T, F, A, S extends string> extends IAbstractSchema<T, F, A, S> {
    validation?: IValidationSchema;
    visibility?: IVisibilitySchema;
}

export interface IControlSchema<F, A, S extends string> extends IFieldSchema<'control', F, A, S> {
    focus?: boolean;
}

export interface IGroupSchema<F, A, S extends string, P>
    extends IFieldSchema<'group', F, A, S>, ILayoutSchema {
    children: MapType<P>;
}

export interface IArraySchema<F, A, P, S extends string>
    extends IFieldSchema<'array', F, A, S>, ILayoutSchema {
    childSchema: P;
}
