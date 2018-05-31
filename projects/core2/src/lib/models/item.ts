import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IViewScales, MapType } from '../misc';
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

    get item$(): Observable<IItem> {
        return this._item$.asObservable();
    }

    get item(): IItem {
        return this._item$.getValue();
    }

    get flex$(): Observable<MapType<FlexValues>> {
        return this._item$.select('flex').pipe(
            map(this._convertKeys<FlexValues>('flex').bind(this))
        );
    }

    get flex(): MapType<FlexValues> {
        return this._convertKeys<FlexValues>('flex')(this._item$.getValue().flex);
    }

    protected _initItem(item: IItem | undefined): void {
        this._item$ = new State<IItem>(item || <IItem>{});
    }

    private _convertKeys<T>(key: string): (data: IViewScales<T>) => MapType<T> {
        return (data: IViewScales<T> | undefined): MapType<T> => {
            if (!data) {
                return {};
            }
            return Object.keys(data).reduce<any>((prev: any, curr: string) => {
                if (curr === 'main') {
                    prev[key] = data[curr];
                } else {
                    prev[key + this._capitalizeFirstLetter(curr)] = data[curr];
                }
                return prev;
            }, {});
        };
    }

    private _capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}
