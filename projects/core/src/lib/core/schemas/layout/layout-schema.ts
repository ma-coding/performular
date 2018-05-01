import { Observable } from 'rxjs';

import { AbstractSchema } from '../abstract/abstract-schema';
import { AbstractSchemaActions } from '../abstract/abstract-schema.actions';
import { LayoutSchemaActions } from './layout-schema.actions';
import { ILayoutSchemaInitState, ILayoutSchemaState } from './layout-schema.state';

export abstract class LayoutSchema<BindingsType> extends AbstractSchema<BindingsType> {

    get autoHide(): boolean {
        return this._getStore<ILayoutSchemaState<BindingsType>>().getState().autoHide;
    }

    get autoHide$(): Observable<boolean> {
        return this._getStore<ILayoutSchemaState<BindingsType>>().select((k: ILayoutSchemaState<BindingsType>) => k.autoHide);
    }

    public setAutoHide(value: boolean): void {
        this._getStore().dispatch(
            new LayoutSchemaActions.SetAutoHideAction(value)
        );
    }

    protected _init(initial: ILayoutSchemaInitState<BindingsType>): ILayoutSchemaState<BindingsType> {
        return {
            ...initial,
            ...super._init(initial)
        };
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        return this._updateChildren(checklist);
    }

    protected _bottomUpUpdate(): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.SetHiddenAction(
                this._calculateHidden(this.state as ILayoutSchemaState<BindingsType>)
            )
        );
        this._updateParent();
    }

    private _calculateHidden(state: ILayoutSchemaState<BindingsType>): boolean {
        if (!state.autoHide) {
            return false;
        }
        return state.children.every((element: AbstractSchema<any>) => element.hidden);
    }

}
