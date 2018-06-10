import { ElementRef } from '@angular/core';

import { Constructor } from '../../mixin';
import { State } from '../../state';
import { Abstract, IAbstract } from '../abstract';

export type IStyle<S extends string> = Record<S | 'host', Partial<CSSStyleDeclaration>>;

export interface IFrameworkProperty<F extends string, A, S extends string> {
    field: F;
    attrs: A;
    styles?: Partial<IStyle<S>>;
}

export interface IFramework<A = any, S extends string = any> {
    field: Constructor<any>;
    fieldDef: string;
    attrs: A;
    styles?: Partial<IStyle<S>>;
    parent?: Abstract;
    elementRef?: ElementRef;
    instance?: any;
    // renderer?: RendererDirective;
    // ngRenderer?: Renderer2;
    // form?: PerformularComponent;
}

function selectField(state: IFramework): Constructor<any> {
    return state.field;
}

function selectFieldDef(state: IFramework): string {
    return state.fieldDef;
}

function selectAttrs(state: IFramework): any {
    return state.attrs;
}

function selectStyles(state: IFramework): any {
    return state.styles;
}

function selectParent(state: IFramework): Abstract | undefined {
    return state.parent;
}

export abstract class Framework<A, S extends string, ST extends IAbstract = IAbstract> {

    protected abstract _state$: State<ST>;

    protected _initFramework(property: IFrameworkProperty<any, A, S>): IFramework<A, S> {
        return {
            field: <any>undefined,
            fieldDef: property.field,
            attrs: property.attrs,
            styles: property.styles
        };
    }
}
