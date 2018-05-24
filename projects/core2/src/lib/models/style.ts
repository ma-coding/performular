import { Observable } from 'rxjs';

import { State } from '../state';

export type IStyle<S extends string> = Record<S | 'host', CSSStyleDeclaration>;

export class Style<S extends string> {
    private _style$: State<IStyle<S>> = <any>undefined;

    get styles$(): Observable<IStyle<S>> {
        return this._style$.asObservable();
    }

    get styles(): IStyle<S> {
        return this._style$.getValue();
    }

    public updateStyle<K extends keyof IStyle<S>>(key: K, style: CSSStyleDeclaration): void {
        this._style$.updateKey(key, style);
    }

    public updateStyles(styles: Partial<IStyle<S>>): void {
        this._style$.update(styles);
    }

    protected _initStyle(style: IStyle<S> | undefined): void {
        this._style$ = new State<IStyle<S>>(style || <IStyle<S>>{});
    }
}
