import { Observable } from 'rxjs';

import { IViewScales } from '../misc';
import { State } from '../state';

export type DirectionValues = 'row' | 'row wrap' | 'column' | 'column wrap' |
    'row-reverse' | 'row-reverse wrap' | 'column-reverse' | 'column-reverse wrap';

export type AlignMainValues = 'start' | 'center' | 'end' | 'space-around' | 'space-between';
export type AlignCrossValues = 'start' | 'center' | 'end' | 'stretch';

export interface ILayoutAlign {
    main: IViewScales<AlignMainValues>;
    cross: IViewScales<AlignCrossValues>;
}

export interface ILayout {
    direction: IViewScales<DirectionValues>;
    align?: ILayoutAlign;
    gap?: string;
}

export class Layout {
    private _layout$: State<ILayout> = <any>undefined;

    public layout$(): Observable<ILayout> {
        return this._layout$.asObservable();
    }

    public layout(): ILayout {
        return this._layout$.getValue();
    }

    protected _initLayout(layout: ILayout | undefined): void {
        this._layout$ = new State<ILayout>(layout || <ILayout>{});
    }

}
