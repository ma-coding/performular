import { Constructable } from '../models/misc';
import { IAbstractSchema } from '../models/schema';
import { Frameworkable, IFrameworkable } from './framework';
import { IItemable, Itemable } from './item';
import { IStyleable, Styleable } from './style';

export interface IAbstractable<T = any, F = any, A = any, S extends string = any>
    extends IItemable, IStyleable<S>, IFrameworkable<F, A> {
    isContainer: boolean;
    isControl: boolean;
    isGroup: boolean;
    isArray: boolean;
    isField: boolean;
    forEachChild(cb: (child: IAbstractable<any, any, any>) => void): void;
    getChildren(): IAbstractable<any, any, any>[];
}

export function Abstractable<T extends string, F, A, S extends string>():
    Constructable<IAbstractable<T, F, A, S>, IAbstractSchema<T, F, A, S>> {
    abstract class Abstract extends Frameworkable<IAbstractable<T, F, A, S>>(Styleable(Itemable(class { }))) {
        private _type: T;

        get isContainer(): boolean {
            return this._type === 'container';
        }

        get isControl(): boolean {
            return this._type === 'control';
        }

        get isGroup(): boolean {
            return this._type === 'group';
        }

        get isArray(): boolean {
            return this._type === 'array';
        }

        get isField(): boolean {
            return !this.isContainer;
        }

        constructor(abstract: IAbstractSchema<T, F, A, S>) {
            super(abstract);
            this._type = abstract.type;
        }

        public abstract forEachChild(cb: (child: IAbstractable) => void): void;

        public getChildren(): IAbstractable[] {
            const children: IAbstractable[] = [];
            this.forEachChild((child: IAbstractable) => {
                children.push(child);
            });
            return children;
        }

    }
    return Abstract as any;
}

export class Input extends Abstractable<'control', 'input', { t: number }, 'legend'>() { }
