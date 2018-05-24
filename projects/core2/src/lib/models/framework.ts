import { ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

import { State } from '../state';

export interface IFramework<A> {
    field: any;
    attrs: A;
}

export interface IFrameworkState<A> extends IFramework<A> {
    parent?: any;
    elementRef?: ElementRef;
    instance?: any;
}

export class Framework<A> {
    private _framework$: State<IFrameworkState<A>> = <any>undefined;

    get parent(): any | undefined {
        return this._framework$.getValue().parent;
    }

    get parent$(): Observable<any | undefined> {
        return this._framework$.select('parent');
    }

    get attrs$(): Observable<A> {
        return this._framework$.select('attrs');
    }

    get attrs(): A {
        return this._framework$.getValue().attrs;
    }

    public updateAttrs<K extends keyof any>(key: K, value: any): void {
        this._framework$.updateKey('attrs', value);
    }

    protected _initFramework(framework: IFramework<A>): void {
        this._framework$ = new State<IFrameworkState<A>>({
            field: <any>framework.field, // TODO DEFINE FIELD
            attrs: framework.attrs
        });
    }

    protected _setParent(parent: any): void {
        this._framework$.updateKey('parent', parent);
    }
}
