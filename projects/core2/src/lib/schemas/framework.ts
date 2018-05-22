import { Observable } from 'rxjs';

import { State } from '../misc';
import { IFrameworkSchema } from '../models/framework';
import { IFrameworkState } from '../models/state';
import { IStyleSchema } from '../models/styles';
import { StyleSchema } from './style';

export class FrameworkSchema<F, A, S extends string> {
    private _framework$: State<IFrameworkState<F, A>>;
    public styles: StyleSchema<S>;

    get framework$(): Observable<IFrameworkState<F, A>> {
        return this._framework$.asObservable();
    }

    get framework(): IFrameworkState<F, A> {
        return this._framework$.getValue();
    }

    constructor(framework: IFrameworkSchema<F, A, S>) {
        this._framework$ = new State({
            field: framework.field,
            attrs: framework.attrs
        });
        this.styles = new StyleSchema(framework.styles || <IStyleSchema<S>>{});
    }

    public updateAttrs<K extends keyof A>(key: K, value: A): void {
        this._framework$.updateKey('attrs', value);
    }
}
