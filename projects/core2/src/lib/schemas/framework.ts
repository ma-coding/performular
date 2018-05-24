import { Observable } from 'rxjs';

import { State } from '../misc';
import { IFrameworkSchema } from '../models/framework';
import { Constructable } from '../models/misc';
import { IFrameworkState } from '../models/state';
import { IAbstractable } from './abstract';

export interface IFrameworkable<F, A> {
    parent: IAbstractable | undefined;
    parent$: Observable<IAbstractable | undefined>;
    attrs: A;
    attrs$: Observable<A>;
    updateAttrs<K extends keyof A>(key: K, value: A): void;
    setParent(parent: IAbstractable): void;
}

export function Frameworkable<T extends Constructable, F = any, A = any>(base: T): Constructable<IFrameworkable<F, A>> & T {
    class Framework extends base implements IFrameworkable<F, A> {
        private _framework$: State<IFrameworkState<F, A>>;

        get parent(): IAbstractable | undefined {
            return this._framework$.getValue().parent;
        }

        get parent$(): Observable<IAbstractable | undefined> {
            return this._framework$.select('parent');
        }

        get attrs$(): Observable<A> {
            return this._framework$.select('attrs');
        }

        get attrs(): A {
            return this._framework$.getValue().attrs;
        }

        constructor(arg: IFrameworkSchema<F, A>) {
            super(arg);
            this._framework$ = new State({
                field: arg.field,
                attrs: arg.attrs
            });
        }

        public setParent(parent: IAbstractable): void {
            this._framework$.updateKey('parent', parent);
        }

        public updateAttrs<K extends keyof any>(key: K, value: any): void {
            this._framework$.updateKey('attrs', value);
        }
    }
    return <any>Framework;
}
