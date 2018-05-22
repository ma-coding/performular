import { Observable } from 'rxjs';

import { State } from '../misc';
import { IStyleSchema } from '../models/styles';

export class StyleSchema<S extends string> {
    private _styles$: State<IStyleSchema<S>>;

    get styles$(): Observable<IStyleSchema<S>> {
        return this._styles$.asObservable();
    }

    get styles(): IStyleSchema<S> {
        return this._styles$.getValue();
    }

    constructor(styles: IStyleSchema<S>) {
        this._styles$ = new State(styles);
    }

    public updateStyle<K extends keyof IStyleSchema<S>>(key: K, style: CSSStyleDeclaration): void {
        this._styles$.updateKey(key, style);
    }

    public updateStyles(styles: Partial<IStyleSchema<S>>): void {
        this._styles$.update(styles);
    }
}
