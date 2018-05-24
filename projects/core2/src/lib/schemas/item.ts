import { Observable } from 'rxjs';

import { State } from '../misc';
import { IItem } from '../models/item';
import { Constructable } from '../models/misc';
import { IAbstractSchema } from '../models/schema';

export interface IItemable {
    item$: Observable<IItem>;
    item: IItem;
}

export function Itemable<T = any>(base: Constructable): Constructable<T> {
    return class extends base implements IItemable {
        private _item$: State<IItem>;

        get item$(): Observable<IItem> {
            return this._item$.asObservable();
        }

        get item(): IItem {
            return this._item$.getValue();
        }

        constructor(arg: IAbstractSchema<any, any, any, any>) {
            super(arg as any);
            this._item$ = new State<IItem>(arg.item || <IItem>{});
        }

    } as any;
}
