import { Observable } from 'rxjs';

import { State } from '../misc';
import { ILayout } from '../models/layout';

export class LayoutSchema {
    private _layout$: State<ILayout>;

    get layout$(): Observable<ILayout> {
        return this._layout$.asObservable();
    }

    get layout(): ILayout {
        return this._layout$.getValue();
    }

    constructor(item: ILayout | undefined) {
        this._layout$ = new State(item || <ILayout>{});
    }
}
