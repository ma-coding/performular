import { Observable } from 'rxjs';

import { IViewScales, MapType } from '../../utils/misc';
import { State } from '../../utils/state';
import { BaseLayout } from './base-layout';

export type DirectionValues = 'row' | 'row wrap' | 'column' | 'column wrap' |
    'row-reverse' | 'row-reverse wrap' | 'column-reverse' | 'column-reverse wrap';

export type AlignMainValues = 'start' | 'center' | 'end' | 'space-around' | 'space-between';
export type AlignCrossValues = 'start' | 'center' | 'end' | 'stretch';

export interface ILayoutAlign {
    mainAxis: AlignMainValues;
    crossAxis: AlignCrossValues;
}

export interface ILayoutProperty {
    layout?: IViewScales<DirectionValues>;
    layoutAlign?: IViewScales<ILayoutAlign>;
    layoutGap?: IViewScales<string>;
}

export type ILayout = ILayoutProperty;

function selectLayout(state: ILayout): MapType<DirectionValues> {
    return BaseLayout.convertKeys<DirectionValues>('layout')(state.layout);
}

function selectLayoutAlign(state: ILayout): MapType<string> {
    return this._mergeAxis(BaseLayout.convertKeys<ILayoutAlign>('layoutAlign', 'align')(state.layoutAlign));
}

function selectLayoutGap(state: ILayout): MapType<string> {
    return BaseLayout.convertKeys<string>('layoutGap', 'gap')(state.layoutGap);
}

export abstract class Layout<S extends ILayout>  {
    protected abstract _state$: State<S>;

    get layoutDirection(): MapType<DirectionValues> {
        return this._state$.get(selectLayout);
    }

    get layoutDirection$(): Observable<MapType<DirectionValues>> {
        return this._state$.get$(selectLayout);
    }

    get layoutGap(): MapType<string> {
        return this._state$.get(selectLayoutGap);
    }

    get layoutGap$(): Observable<MapType<string>> {
        return this._state$.get$(selectLayoutGap);
    }

    get layoutAlign(): MapType<string> {
        return this._state$.get(selectLayoutAlign);
    }

    get layoutAlign$(): Observable<MapType<string>> {
        return this._state$.get$(selectLayoutAlign);
    }

    protected _initLayout(property: ILayoutProperty): ILayout {
        return property;
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

}
