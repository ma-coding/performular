import { Observable } from 'rxjs';

import { State } from '../misc';
import { ILayout, ILayoutSchema } from '../models/layout';
import { Constructable } from '../models/misc';

export interface ILayoutable {
    layout$: Observable<ILayout>;
    layout: ILayout;
}

export function Layoutable<T = any>(base: Constructable): Constructable<T> {
    return class extends base implements ILayoutable {
        private _layout$: State<ILayout>;

        get layout$(): Observable<ILayout> {
            return this._layout$.asObservable();
        }

        get layout(): ILayout {
            return this._layout$.getValue();
        }

        constructor(arg: ILayoutSchema) {
            super(arg as any);
            this._layout$ = new State<ILayout>(arg.layout || <ILayout>{});
        }

    } as any;
}
