import { Observable } from 'rxjs';

import { State } from '../misc';
import { IItem } from '../models/item';

export class ItemSchema {
    private _item$: State<IItem>;

    get item$(): Observable<IItem> {
        return this._item$.asObservable();
    }

    get item(): IItem {
        return this._item$.getValue();
    }

    constructor(item: IItem | undefined) {
        this._item$ = new State(item || <IItem>{});
    }
}
