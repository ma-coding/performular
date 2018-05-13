import { BehaviorSubject, Observable } from 'rxjs';

import { AbstractSchema, IAbstractSchema, IAbstractState } from './abstract.schema';

export interface ILayoutSchema<BType = any> extends IAbstractSchema<BType> {
    autoHide?: boolean;
    children: IAbstractSchema[];
}

export interface ILayoutState<BType = any> extends IAbstractState<BType> {
    autoHide: boolean;
}

export class LayoutSchema<BType = any> extends AbstractSchema<ILayoutState, BType> {

    protected _store$: BehaviorSubject<ILayoutState<any>>;

    constructor(schema: ILayoutSchema<BType>) {
        super(schema);
        this._initState = {
            ...this._initState,
            autoHide: schema.autoHide || false,
            children: [] // Todo
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    public setAutoHide(autoHide: boolean): void {
        this._updateStore({ autoHide });
    }

    protected _topDownUpdate(checklist: string[]): Observable<void> {
        return this._updateChildren(checklist);
    }

    protected _bottomUpUpdate(): void {
        const hidden: boolean = this._calculateHidden();
        this._updateStore({ hidden });
        this._updateParent();
    }

    private _calculateHidden(): boolean {
        if (!this.get('autoHide')) {
            return false;
        }
        return this.get('children').every((element: AbstractSchema<any>) => element.get('hidden'));
    }
}
