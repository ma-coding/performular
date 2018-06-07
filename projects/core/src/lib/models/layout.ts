import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IViewScales, MapType } from '../misc';
import { State } from '../state';

export type DirectionValues = 'row' | 'row wrap' | 'column' | 'column wrap' |
    'row-reverse' | 'row-reverse wrap' | 'column-reverse' | 'column-reverse wrap';

export type AlignMainValues = 'start' | 'center' | 'end' | 'space-around' | 'space-between';
export type AlignCrossValues = 'start' | 'center' | 'end' | 'stretch';

export interface ILayoutAlign {
    mainAxis: AlignMainValues;
    crossAxis: AlignCrossValues;
}

export interface ILayout {
    direction: IViewScales<DirectionValues>;
    align?: IViewScales<ILayoutAlign>;
    gap?: IViewScales<string>;
}

export class Layout {
    private _layout$: State<ILayout> = <any>undefined;

    get layout$(): Observable<ILayout> {
        return this._layout$.asObservable();
    }

    get layout(): ILayout {
        return this._layout$.getValue();
    }

    get layoutDirection$(): Observable<MapType<DirectionValues>> {
        return this._layout$.select('direction').pipe(
            map(this._convertReplaceKeys<DirectionValues>('direction', 'layout').bind(this))
        );
    }

    get layoutDirection(): MapType<DirectionValues> {
        return this._convertReplaceKeys<DirectionValues>('direction', 'layout')(this._layout$.getValue().direction);
    }

    get layoutGap$(): Observable<MapType<string>> {
        return this._layout$.select('gap').pipe(
            map(this._convertReplaceKeys<string>('gap', 'gap').bind(this))
        );
    }

    get layoutGap(): MapType<string> {
        return this._convertReplaceKeys<string>('gap', 'gap')(this._layout$.getValue().gap || <any>{});
    }

    get layoutAlign$(): Observable<MapType<string>> {
        return this._layout$.select('align').pipe(
            map(this._convertReplaceKeys<ILayoutAlign>('align', 'align').bind(this)),
            map(this._mergeAxis.bind(this))
        );
    }

    get layoutAlign(): MapType<string> {
        return this._mergeAxis(this._convertReplaceKeys<ILayoutAlign>('gap', 'gap')(this._layout$.getValue().gap || <any>{}));
    }

    protected _initLayout(layout: ILayout | undefined): void {
        this._layout$ = new State<ILayout>(layout || <ILayout>{});
    }

    private _mergeAxis(align: MapType<ILayoutAlign>): MapType<string> {
        return Object.keys(align).reduce((prev: any, curr: string) => {
            if (align[curr].mainAxis && align[curr].crossAxis) {
                prev[curr] = `${align[curr].mainAxis} ${align[curr].crossAxis}`;
            }
            if (align[curr].mainAxis && !align[curr].crossAxis) {
                prev[curr] = align[curr].mainAxis;
            }
            return prev;
        }, {});
    }

    private _convertReplaceKeys<T>(key: string, replaceKey?: string): (data: IViewScales<T>) => MapType<T> {
        return (data: IViewScales<T> | undefined): MapType<T> => {
            if (!data) {
                return {};
            }
            return Object.keys(data).reduce<any>((prev: any, curr: string) => {
                const useKey: string = replaceKey ? replaceKey : key;
                if (curr === 'main') {
                    prev[useKey] = data[curr];
                } else {
                    prev[useKey + this._capitalizeFirstLetterFunc(curr)] = data[curr];
                }
                return prev;
            }, {});
        };
    }

    private _capitalizeFirstLetterFunc(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

}
