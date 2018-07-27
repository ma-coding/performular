import { Observable, of } from 'rxjs';

import { Framework } from '../framework/framework';
import { State } from '../util/state';
import { LayoutAlign } from '../util/types/layout-align';
import { LayoutValues } from '../util/types/layout-values';
import { RunContext } from '../util/types/run-context';
import { ViewScales } from '../util/types/view-scales';
import { AbstractModel } from './abstract-model';
import { LayoutModelOptions } from './types/layout-model-options';
import { LayoutModelState } from './types/layout-model-state';
import { ModelType } from '../builder/types/model-type';

export class LayoutModel extends AbstractModel<LayoutModelState, any> {
    private static _cnt: number = 0;

    protected _state$: State<LayoutModelState>;

    get layout(): LayoutModelState['layout'] {
        return this._state$.select('layout');
    }

    get layout$(): Observable<LayoutModelState['layout']> {
        return this._state$.select$('layout');
    }

    get layoutAlign(): LayoutModelState['layoutAlign'] {
        return this._state$.select('layoutAlign');
    }

    get layoutAlign$(): Observable<LayoutModelState['layoutAlign']> {
        return this._state$.select$('layoutAlign');
    }

    get layoutGap(): LayoutModelState['layoutGap'] {
        return this._state$.select('layoutGap');
    }

    get layoutGap$(): Observable<LayoutModelState['layoutGap']> {
        return this._state$.select$('layoutGap');
    }

    constructor(options: LayoutModelOptions) {
        super();
        options.children.forEach((c: AbstractModel) => c.setParent(this));
        this._state$ = new State<LayoutModelState>({
            ...this._initAbstractModel({
                id: LayoutModel._cnt + '-Layout',
                attrs: undefined,
                model: Framework.getLayoutModel()
            }),
            layout: this._initLayout(options.layout),
            layoutAlign: this._initLayoutAlign(options.layoutAlign),
            layoutGap: this._initLayoutGap(options.layoutGap),
            children: options.children,
            type: ModelType.LAYOUT
        });
        LayoutModel._cnt++;
    }

    protected _onTreeUp(): void {}
    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(undefined);
    }

    private _initLayout(
        opt?: ViewScales<LayoutValues> | LayoutValues
    ): ViewScales<LayoutValues> | undefined {
        if (!opt) {
            return undefined;
        }
        return typeof opt === 'string'
            ? {
                  main: opt
              }
            : opt;
    }

    private _initLayoutAlign(
        opt?: ViewScales<LayoutAlign> | LayoutAlign
    ): ViewScales<LayoutAlign> | undefined {
        if (!opt) {
            return undefined;
        }
        return this._isLayoutAlign(opt)
            ? {
                  main: opt
              }
            : opt;
    }

    private _initLayoutGap(
        opt?: ViewScales<string> | string
    ): ViewScales<string> | undefined {
        if (!opt) {
            return undefined;
        }
        return typeof opt === 'string'
            ? {
                  main: opt
              }
            : opt;
    }

    private _isLayoutAlign(value: any): value is LayoutAlign {
        return value && !!value.cross;
    }
}
