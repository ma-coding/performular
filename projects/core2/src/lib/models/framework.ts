import { ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

import { State } from '../state';

export type IStyle<S extends string> = Record<S | 'host', CSSStyleDeclaration>;

export interface IFramework<F extends string, A, S extends string> {
    field: F;
    attrs: A;
    styles?: IStyle<S>;
}

export interface IFrameworkState<F extends string, A, S extends string> extends IFramework<F, A, S> {
    parent?: any;
    elementRef?: ElementRef;
    instance?: any;
}

export class Framework<F extends string, A, S extends string> {
    private _framework$: State<IFrameworkState<F, A, S>> = <any>undefined;

    public parent(): any | undefined {
        return this._framework$.getValue().parent;
    }

    public parent$(): Observable<any | undefined> {
        return this._framework$.select('parent');
    }

    public attrs$(): Observable<A> {
        return this._framework$.select('attrs');
    }

    public attrs(): A {
        return this._framework$.getValue().attrs;
    }

    public updateAttrs<K extends keyof any>(key: K, value: any): void {
        this._framework$.updateKey('attrs', value);
    }

    public setParent(parent: any): void {
        this._framework$.updateKey('parent', parent);
    }

    protected _initFramework(framework: IFramework<F, A, S>): void {
        this._framework$ = new State<IFrameworkState<F, A, S>>({
            field: <any>framework.field, // TODO DEFINE FIELD
            attrs: framework.attrs,
            styles: framework.styles
        });
    }
}
