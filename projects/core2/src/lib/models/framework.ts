import { ElementRef, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { Metadata } from '../metadata';
import { State } from '../state';
import { Abstract } from './abstract';

export interface IOnInitFramework<F extends Abstract = any> {
    onInitFramework(field: F): void;
}

export type FrameworkType = Type<IOnInitFramework>;

export interface IFrameworkDecoration {
    name: string;
}

export function FormComponent(options: IFrameworkDecoration): ClassDecorator {
    return (target: Function): void => {
        Metadata.addFormComponent(options, <FrameworkType>target);
    };
}

export type IStyle<S extends string> = Record<S | 'host', CSSStyleDeclaration>;

export interface IFramework<F extends string, A, S extends string> {
    field: F;
    attrs: A;
    styles?: IStyle<S>;
}

export interface IFrameworkState<A, S extends string> {
    field: FrameworkType;
    attrs: A;
    styles?: IStyle<S>;
    parent?: Abstract;
    elementRef?: ElementRef;
    instance?: any;
}

export class Framework<F extends string, A, S extends string> {
    private _framework$: State<IFrameworkState<A, S>> = <any>undefined;

    get parent(): Abstract | undefined {
        return this._framework$.getValue().parent;
    }

    get parent$(): Observable<Abstract | undefined> {
        return this._framework$.select('parent');
    }

    get attrs$(): Observable<A> {
        return this._framework$.select('attrs');
    }

    get attrs(): A {
        return this._framework$.getValue().attrs;
    }

    get field(): FrameworkType {
        return this._framework$.getValue().field;
    }

    get instance(): any | undefined {
        return this._framework$.getValue().instance;
    }

    public updateAttrs<K extends keyof any>(key: K, value: any): void {
        this._framework$.updateKey('attrs', value);
    }

    public setParent(parent: any): void {
        this._framework$.updateKey('parent', parent);
    }

    public registerFramework(elementRef: ElementRef, instance: any): void {
        this._framework$.update({
            elementRef: elementRef,
            instance: instance
        });
    }

    public clearFramework(): void {
        this._framework$.update({
            elementRef: undefined,
            instance: undefined
        });
    }

    protected _initFramework(framework: IFramework<F, A, S>): void {
        this._framework$ = new State<IFrameworkState<A, S>>({
            field: Metadata.getFormComponent(framework.field).target,
            attrs: framework.attrs,
            styles: framework.styles
        });
    }
}
