import { IStyleSchema } from './styles';

export interface IFrameworkSchema<F, A, S extends string> {
    field: F;
    attrs: A;
    styles?: IStyleSchema<S>;
}
