import { IAbstractSchema } from '../models/schema';
import { FrameworkSchema } from './framework';
import { ItemSchema } from './item';

export abstract class AbstractSchema<T = any, F = any, A = any, S extends string = any> {
    private _type: T;
    public item: ItemSchema;
    public framework: FrameworkSchema<F, A, S>;

    constructor(abstract: IAbstractSchema<T, F, A, S>) {
        this._type = abstract.type;
        this.item = new ItemSchema(abstract.item);
        this.framework = new FrameworkSchema({
            field: abstract.field,
            attrs: abstract.attrs,
            styles: abstract.styles
        });
    }

    protected abstract _forEachChild(cb: (child: AbstractSchema) => void): void;
}
