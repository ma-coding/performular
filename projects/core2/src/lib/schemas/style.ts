import { Observable } from 'rxjs';

import { State } from '../misc';
import { Constructable } from '../models/misc';
import { IAbstractSchema } from '../models/schema';
import { IStyleSchema } from '../models/styles';

export interface IStyleable<S extends string> {
    styles$: Observable<IStyleSchema<S>>;
    styles: IStyleSchema<S>;
    updateStyle<K extends keyof IStyleSchema<S>>(key: K, style: CSSStyleDeclaration): void;
    updateStyles(styles: Partial<IStyleSchema<S>>): void;
}

export function Styleable<T = any>(base: Constructable): Constructable<T> {
    return class extends base implements IStyleable<any> {
        private _styles$: State<IStyleSchema<any>>;

        get styles$(): Observable<IStyleSchema<any>> {
            return this._styles$.asObservable();
        }

        get styles(): IStyleSchema<any> {
            return this._styles$.getValue();
        }

        constructor(arg: IAbstractSchema<any, any, any, any>) {
            super(arg as any);
            this._styles$ = new State<IStyleSchema<any>>(arg.styles || <IStyleSchema<any>>{});
        }

        public updateStyle<K extends keyof IStyleSchema<any>>(key: K, style: CSSStyleDeclaration): void {
            this._styles$.updateKey(key, style);
        }

        public updateStyles(styles: Partial<IStyleSchema<any>>): void {
            this._styles$.update(styles);
        }

    } as any;
}
