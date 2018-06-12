import { ElementRef } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '../../form/store';
import { flatten } from '../../utils/misc';
import { State } from '../../utils/state';
import { Abstract, IAbstract } from '../abstract';
import { FormComponentType } from './decorator';

export type IStyle<S extends string> = Partial<Record<S | 'host', Partial<CSSStyleDeclaration>>>;

export interface IFrameworkProperty<F extends string = any, A = any, S extends string = 'host'> {
    field: F;
    attrs: A;
    styles?: IStyle<S>;
}

export interface IFramework<A = any, S extends string = 'host'> {
    field: FormComponentType;
    fieldDef: string;
    attrs: A;
    styles: IStyle<S>;
    children: Abstract[];
    parent?: Abstract;
    elementRef?: ElementRef;
    instance?: any;
    // renderer?: RendererDirective;
    // ngRenderer?: Renderer2;
    // form?: PerformularComponent;
}

function selectField(state: IFramework): FormComponentType {
    return state.field;
}

function selectFieldDef(state: IFramework): string {
    return state.fieldDef;
}

function selectAttrs<A>(state: IFramework<A>): A {
    return state.attrs;
}

function selectStyles<S extends string = 'host'>(state: IFramework<any, S>): IStyle<S> {
    return state.styles;
}

function selectChildren(state: IFramework): Abstract[] {
    return state.children;
}

function selectParent(state: IFramework): Abstract | undefined {
    return state.parent;
}

export abstract class Framework<A = any, S extends string = 'host', ST extends IAbstract<any, A, S> = IAbstract<any, A, S>> {

    get field(): FormComponentType {
        return this._state$.get(selectField);
    }

    get field$(): Observable<FormComponentType> {
        return this._state$.get$(selectField);
    }

    get fieldDef(): string {
        return this._state$.get(selectFieldDef);
    }

    get fieldDef$(): Observable<string> {
        return this._state$.get$(selectFieldDef);
    }

    get attrs(): A {
        return this._state$.get(selectAttrs);
    }

    get attrs$(): Observable<A> {
        return this._state$.get$(selectAttrs);
    }

    get styles(): IStyle<S> {
        return this._state$.get(selectStyles);
    }

    get styles$(): Observable<IStyle<S>> {
        return this._state$.get$(selectStyles);
    }

    get children(): Abstract[] {
        return this._state$.get(selectChildren);
    }

    get children$(): Observable<Abstract[]> {
        return this._state$.get$(selectChildren);
    }

    get parent(): Abstract | undefined {
        return this._state$.get(selectParent);
    }

    get parent$(): Observable<Abstract | undefined> {
        return this._state$.get$(selectParent);
    }

    get root(): Abstract {
        let r: Abstract = <Abstract>(this as any);
        while (r.parent) {
            const p: Abstract | undefined = r.parent;
            if (p) {
                r = p;
            } else {
                return r;
            }
        }
        return r;
    }

    get all(): Abstract[] {
        return [
            <Abstract>(this as any),
            ...flatten(this.children.map((c: Abstract) => c.all))
        ];
    }

    protected abstract _state$: State<ST>;

    protected _setParent(parent: Abstract): void {
        this._state$.updateKey('parent', parent);
    }

    protected _setParentOfChildren(): void {
        this.children.forEach((child: Abstract) => child._setParent(<Abstract>(this as any)));
    }

    protected _initFramework<T extends string>(property: IFrameworkProperty<T, A, S>): IFramework<A, S> {
        return {
            field: Store.getFormComponent(property.field).target,
            fieldDef: property.field,
            attrs: property.attrs,
            styles: property.styles || {},
            children: []
        };
    }
}
