import { ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

import { State } from '../state';

export type IStyle<S extends string> = Record<S | 'host', CSSStyleDeclaration>;

export interface IFramework<A, S extends string> {
    field: any;
    attrs: A;
    styles?: IStyle<S>;
}

export interface IFrameworkState<A, S extends string> extends IFramework<A, S> {
    parent?: any;
    elementRef?: ElementRef;
    instance?: any;
}

export class Framework<A, S extends string> {
    private _framework$: State<IFrameworkState<A, S>> = <any>undefined;

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

    protected _initFramework(framework: IFramework<A, S>): void {
        this._framework$ = new State<IFrameworkState<A, S>>({
            field: <any>framework.field, // TODO DEFINE FIELD
            attrs: framework.attrs,
            styles: framework.styles
        });
    }
}
