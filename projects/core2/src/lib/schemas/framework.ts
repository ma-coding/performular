import { Observable } from 'rxjs';

import { State } from '../misc';
import { Constructable } from '../models/misc';
import { IAbstractSchema } from '../models/schema';
import { IFrameworkState } from '../models/state';

export interface IFrameworkable<F, A> {
    framework$: Observable<IFrameworkState<F, A>>;
    framework: IFrameworkState<F, A>;
    updateAttrs<K extends keyof A>(key: K, value: A): void;
}

export function Frameworkable<T = any>(base: Constructable): Constructable<T> {
    return class extends base implements IFrameworkable<any, any> {
        private _framework$: State<IFrameworkState<any, any>>;

        get framework$(): Observable<IFrameworkState<any, any>> {
            return this._framework$.asObservable();
        }

        get framework(): IFrameworkState<any, any> {
            return this._framework$.getValue();
        }

        constructor(arg: IAbstractSchema<any, any, any, any>) {
            super(arg as any);
            this._framework$ = new State({
                field: arg.field,
                attrs: arg.attrs
            });
        }

        public updateAttrs<K extends keyof any>(key: K, value: any): void {
            this._framework$.updateKey('attrs', value);
        }

    } as any;
}
