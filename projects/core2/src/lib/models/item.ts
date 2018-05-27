import { Observable } from 'rxjs';

import { IViewScales } from '../misc';
import { State } from '../state';

export type FlexValues = string | number;

export type FlexAlignValues = 'start' | 'baseline' | 'center' | 'end';

export interface IItem {
    flex: IViewScales<FlexValues>;
    order?: IViewScales<number>;
    offset?: IViewScales<string>;
    align?: IViewScales<FlexAlignValues>;
}

export class Item {
    private _item$: State<IItem> = new State(<IItem>{});

    public item$(): Observable<IItem> {
        return this._item$.asObservable();
    }

    public item(): IItem {
        return this._item$.getValue();
    }

    protected _initItem(item: IItem | undefined): void {
        this._item$ = new State<IItem>(item || <IItem>{});
    }

}
