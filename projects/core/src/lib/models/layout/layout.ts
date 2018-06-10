import { IViewScales } from '../../misc';
import { State } from '../../state';

export type DirectionValues = 'row' | 'row wrap' | 'column' | 'column wrap' |
    'row-reverse' | 'row-reverse wrap' | 'column-reverse' | 'column-reverse wrap';

export type AlignMainValues = 'start' | 'center' | 'end' | 'space-around' | 'space-between';
export type AlignCrossValues = 'start' | 'center' | 'end' | 'stretch';

export interface ILayoutAlign {
    mainAxis: AlignMainValues;
    crossAxis: AlignCrossValues;
}

export interface ILayoutKeys {
    direction: IViewScales<DirectionValues>;
    align?: IViewScales<ILayoutAlign>;
    gap?: IViewScales<string>;
}

export interface ILayout {
    layout: ILayoutKeys;
}

export abstract class Layout<S extends ILayout>  {
    protected abstract _state$: State<S>;

    // get layoutDirection(): MapType<DirectionValues> {
    //     return this._convertKeys<DirectionValues>('direction', 'layout')(this._state$.getValue().layout.direction);
    // }

    // get layoutGap(): MapType<string> {
    //     return this._convertKeys<string>('gap', 'gap')(this._state$.getValue().layout.gap || <any>{});
    // }

    // get layoutAlign(): MapType<string> {
    //     return this._mergeAxis(this._convertKeys<ILayoutAlign>('gap', 'gap')(this._state$.getValue().layout.gap || <any>{}));
    // }

    // private _mergeAxis(align: MapType<ILayoutAlign>): MapType<string> {
    //     return Object.keys(align).reduce((prev: any, curr: string) => {
    //         if (align[curr].mainAxis && align[curr].crossAxis) {
    //             prev[curr] = `${align[curr].mainAxis} ${align[curr].crossAxis}`;
    //         }
    //         if (align[curr].mainAxis && !align[curr].crossAxis) {
    //             prev[curr] = align[curr].mainAxis;
    //         }
    //         return prev;
    //     }, {});
    // }


}
