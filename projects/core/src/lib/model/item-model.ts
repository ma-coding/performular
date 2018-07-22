import { Observable, of } from 'rxjs';

import { Framework } from '../framework/framework';
import { State } from '../util/state';
import { ItemAlignValues } from '../util/types/item-align-values';
import { ItemValues } from '../util/types/item-values';
import { RunContext } from '../util/types/run-context';
import { ViewScales } from '../util/types/view-scales';
import { AbstractModel } from './abstract-model';
import { ItemModelOptions } from './types/item-model-options';
import { ItemModelState } from './types/item-model-state';

// Todo: add full implementation
export class ItemModel extends AbstractModel<ItemModelState> {
    private static _cnt: number = 0;

    protected _state$: State<ItemModelState>;

    get flex(): ItemModelState['flex'] {
        return this._state$.select('flex');
    }

    get flex$(): Observable<ItemModelState['flex']> {
        return this._state$.select$('flex');
    }

    get flexOrder(): ItemModelState['flexOrder'] {
        return this._state$.select('flexOrder');
    }

    get flexOrder$(): Observable<ItemModelState['flexOrder']> {
        return this._state$.select$('flexOrder');
    }

    get flexAlign(): ItemModelState['flexAlign'] {
        return this._state$.select('flexAlign');
    }

    get flexAlign$(): Observable<ItemModelState['flexAlign']> {
        return this._state$.select$('flexAlign');
    }

    get flexOffset(): ItemModelState['flexOffset'] {
        return this._state$.select('flexOffset');
    }

    get flexOffset$(): Observable<ItemModelState['flexOffset']> {
        return this._state$.select$('flexOffset');
    }

    constructor(options: ItemModelOptions) {
        super();
        options.child.setParent(this);
        this._state$ = new State<ItemModelState>({
            ...this._initAbstractModel({
                id: ItemModel._cnt + '-Item',
                attrs: undefined,
                model: Framework.getItemModel()
            }),
            children: [options.child],
            flex: this._initFlex(options.flex),
            flexOrder: this._initFlexOrder(options.flexOrder),
            flexAlign: this._initFlexAlign(options.flexAlign),
            flexOffset: this._initFlexOffset(options.flexOffset)
        });
        ItemModel._cnt++;
    }

    protected _getUpdateWhen(): Observable<AbstractModel[]> {
        return of([]);
    }

    protected _onTreeUp(): void {}
    protected _onTreeDown(context: RunContext): Observable<void> {
        return of(undefined);
    }

    private _initFlex(
        opt?: ViewScales<ItemValues> | ItemValues
    ): ViewScales<ItemValues> | undefined {
        if (!opt) {
            return undefined;
        }
        return typeof opt === 'object'
            ? opt
            : {
                  main: opt
              };
    }

    private _initFlexOrder(
        opt?: ViewScales<number> | number
    ): ViewScales<number> | undefined {
        if (!opt) {
            return undefined;
        }
        return typeof opt === 'object'
            ? opt
            : {
                  main: opt
              };
    }

    private _initFlexAlign(
        opt?: ViewScales<ItemAlignValues> | ItemAlignValues
    ): ViewScales<ItemAlignValues> | undefined {
        if (!opt) {
            return undefined;
        }
        return typeof opt === 'object'
            ? opt
            : {
                  main: opt
              };
    }

    private _initFlexOffset(
        opt?: ViewScales<string> | string
    ): ViewScales<string> | undefined {
        if (!opt) {
            return undefined;
        }
        return typeof opt === 'object'
            ? opt
            : {
                  main: opt
              };
    }
}
