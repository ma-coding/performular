import { Observable } from 'rxjs';

import { State } from '../state';
import { IViewScales } from '../misc';

export type FlexValues = string | number;

export type FlexAlignValues = 'start' | 'baseline' | 'center' | 'end';

export interface IItem {
    flex: IViewScales<FlexValues>;
    order?: IViewScales<number>;
    offset?: IViewScales<string>;
    align?: IViewScales<FlexAlignValues>;
}

export class Item {
    private _item$: State<IItem> = <any>undefined;

    get item$(): Observable<IItem> {
        return this._item$.asObservable();
    }

    get item(): IItem {
        return this._item$.getValue();
    }

    protected _initItem(item: IItem | undefined): void {
        this._item$ = new State<IItem>(item || <IItem>{});
    }

}
