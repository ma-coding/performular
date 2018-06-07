import { ElementRef, Renderer2, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { FormComponent as PerformularComponent } from '../form';
import { Metadata } from '../metadata';
import { RendererDirective } from '../renderer';
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

export type IStyle<S extends string> = Record<S | 'host', Partial<CSSStyleDeclaration>>;

export interface IFramework<F extends string, A, S extends string> {
    field: F;
    attrs: A;
    styles?: Partial<IStyle<S>>;
}

export interface IFrameworkState<A, S extends string> {
    field: FrameworkType;
    fieldDef: string;
    attrs: A;
    styles?: Partial<IStyle<S>>;
    parent?: Abstract;
    elementRef?: ElementRef;
    instance?: any;
    renderer?: RendererDirective;
    ngRenderer?: Renderer2;
    form?: PerformularComponent;
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

    get styles$(): Observable<Partial<IStyle<S>> | undefined> {
        return this._framework$.select('styles');
    }

    get styles(): Partial<IStyle<S>> | undefined {
        return this._framework$.getValue().styles;
    }

    get field(): FrameworkType {
        return this._framework$.getValue().field;
    }

    get fieldDef(): string {
        return this._framework$.getValue().fieldDef;
    }

    get instance(): any | undefined {
        return this._framework$.getValue().instance;
    }

    get elementRef(): ElementRef | undefined {
        return this._framework$.getValue().elementRef;
    }

    get elementRef$(): Observable<ElementRef | undefined> {
        return this._framework$.select('elementRef');
    }

    get renderer(): RendererDirective | undefined {
        return this._framework$.getValue().renderer;
    }

    get renderer$(): Observable<RendererDirective | undefined> {
        return this._framework$.select('renderer');
    }

    get ngRenderer(): Renderer2 | undefined {
        return this._framework$.getValue().ngRenderer;
    }

    get ngRenderer$(): Observable<Renderer2 | undefined> {
        return this._framework$.select('ngRenderer');
    }

    get form(): PerformularComponent | undefined {
        return this._framework$.getValue().form;
    }

    get form$(): Observable<PerformularComponent | undefined> {
        return this._framework$.select('form');
    }

    public updateAttrs<K extends keyof any>(key: K, value: any): void {
        this._framework$.updateKey('attrs', value);
    }

    public setParent(parent: any): void {
        this._framework$.updateKey('parent', parent);
    }

    public setForm(form: PerformularComponent | undefined): void {
        this._framework$.updateKey('form', form);
    }

    public setNgRenderer(renderer: Renderer2): void {
        this._framework$.updateKey('ngRenderer', renderer);
    }

    public registerFramework(elementRef: ElementRef, instance: any): void {
        this._framework$.update({
            elementRef: elementRef,
            instance: instance
        });
    }

    public setRenderer(renderer: RendererDirective): void {
        this._framework$.updateKey('renderer', renderer);
    }

    public clearRenderer(): void {
        this._framework$.updateKey('renderer', undefined);
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
            fieldDef: framework.field,
            attrs: framework.attrs,
            styles: framework.styles
        });
    }
}
