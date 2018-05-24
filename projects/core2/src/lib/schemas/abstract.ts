import { Constructable } from '../models/misc';
import { IAbstractSchema } from '../models/schema';
import { Frameworkable, IFrameworkable } from './framework';
import { IItemable, Itemable } from './item';
import { IStyleable, Styleable } from './style';

export interface IAbstractable<F = any, A = any, S extends string = any> extends IItemable, IStyleable<S>, IFrameworkable<F, A> { }

export interface IRequiredAbstractables {
    _forEachChild(cb: (child: Constructable<IAbstractable<any, any, any>>) => void): void;
}

export function Abstractable<T, F, A, S extends string>(): Constructable<IAbstractable<F, A, S>, IAbstractSchema<T, F, A, S>> {
    return class extends Frameworkable<IAbstractable>(Styleable(Itemable(class { }))) {
        private _type: T;

        constructor(abstract: IAbstractSchema<T, F, A, S>) {
            super(abstract);
            this._type = abstract.type;
        }

    } as any;
}

export class Input extends Abstractable<'control', 'input', { t: number }, 'legend'>() { }

const f: Input = new Input({
    type: 'control',
    field: 'input',
    attrs: {
        t: 5
    }
});
