import { Observable } from 'rxjs';

import { IViewScales, MapType } from '../../misc';
import { State } from '../../state';
import { BaseLayout } from './base-layout';

export type FlexValues = string | number;

export type FlexAlignValues = 'start' | 'baseline' | 'center' | 'end';

export interface IItemProperty {
    flex: IViewScales<FlexValues>;
    flexOrder?: IViewScales<number>;
    flexOffset?: IViewScales<string>;
    flexAlign?: IViewScales<FlexAlignValues>;
}

export type IItemParams = IItemProperty;

export type IItem = IItemParams;

function selectFlex(state: IItem): MapType<FlexValues> {
    return BaseLayout.convertKeys<FlexValues>('flex')(state.flex);
}

function selectFlexOrder(state: IItem): MapType<number> {
    return BaseLayout.convertKeys<number>('order')(state.flexOrder);
}

function selectFlexAlign(state: IItem): MapType<FlexAlignValues> {
    return BaseLayout.convertKeys<FlexAlignValues>('align')(state.flexAlign);
}

function selectFlexOffset(state: IItem): MapType<string> {
    return BaseLayout.convertKeys<string>('offset')(state.flexOffset);
}

export abstract class Item<S extends IItem> {
    protected abstract _state$: State<S>;

    get flex(): MapType<FlexValues> {
        return this._state$.get(selectFlex);
    }

    get flex$(): Observable<MapType<FlexValues>> {
        return this._state$.get$(selectFlex);
    }

    get flexOrder(): MapType<number> {
        return this._state$.get(selectFlexOrder);
    }

    get flexOrder$(): Observable<MapType<number>> {
        return this._state$.get$(selectFlexOrder);
    }

    get flexAlign(): MapType<FlexAlignValues> {
        return this._state$.get(selectFlexAlign);
    }

    get flexAlign$(): Observable<MapType<FlexAlignValues>> {
        return this._state$.get$(selectFlexAlign);
    }

    get flexOffset(): MapType<string> {
        return this._state$.get(selectFlexAlign);
    }

    get flexOffset$(): Observable<MapType<string>> {
        return this._state$.get$(selectFlexAlign);
    }

}
