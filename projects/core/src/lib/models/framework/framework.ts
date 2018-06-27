import { ElementRef, Renderer2 } from '@angular/core';

import { Observable } from 'rxjs';

import { FormComponent } from '../../form/component';
import { RendererDirective } from '../../form/renderer';
import { Store } from '../../form/store';
import { flatten } from '../../utils/misc';
import { State } from '../../utils/state';
import { Abstract, IAbstract } from '../abstract';
import { FormComponentType, IPerformularOnInit } from './decorator';

export type IStyle<S extends string> = Partial<Record<S | 'host', Partial<CSSStyleDeclaration>>>;

export interface IFrameworkProperty<F extends string = any, A = any, S extends string = 'host'> {
    field: F;
    attrs: A;
    styles?: IStyle<S>;
}

export interface IFramework<A = any, S extends string = 'host'> {
    fieldCmp: FormComponentType;
    fieldDef: string;
    attrs: A;
    styles: IStyle<S>;
    children: Abstract[];
    parent?: Abstract;
    elementRef?: ElementRef;
    instance?: IPerformularOnInit;
    renderer?: RendererDirective;
    ngRenderer?: Renderer2;
    hostForm?: FormComponent;
}

export function selectFieldCmp(state: IFramework): FormComponentType {
    return state.fieldCmp;
}

export function selectFieldDef(state: IFramework): string {
    return state.fieldDef;
}

export function selectElementRef(state: IFramework): ElementRef | undefined {
    return state.elementRef;
}

export function selectInstance(state: IFramework): IPerformularOnInit | undefined {
    return state.instance;
}

export function selectAttrs<A>(state: IFramework<A>): A {
    return state.attrs;
}

export function selectStyles<S extends string = 'host'>(state: IFramework<any, S>): IStyle<S> {
    return state.styles;
}

export function selectChildren(state: IFramework): Abstract[] {
    return state.children;
}

export function selectParent(state: IFramework): Abstract | undefined {
    return state.parent;
}

export function selectRenderer(state: IFramework): RendererDirective | undefined {
    return state.renderer;
}

export function selectNgRenderer(state: IFramework): Renderer2 | undefined {
    return state.ngRenderer;
}

export function selectHostForm(state: IFramework): FormComponent | undefined {
    return state.hostForm;
}

export abstract class Framework<A = any, S extends string = 'host', ST extends IAbstract<any, A, S> = IAbstract<any, A, S>> {

    get fieldCmp(): ReturnType<typeof selectFieldCmp> {
        return this._state$.get(selectFieldCmp);
    }

    get fieldCmp$(): Observable<ReturnType<typeof selectFieldCmp>> {
        return this._state$.get$(selectFieldCmp);
    }

    get fieldDef(): ReturnType<typeof selectFieldDef> {
        return this._state$.get(selectFieldDef);
    }

    get fieldDef$(): Observable<ReturnType<typeof selectFieldDef>> {
        return this._state$.get$(selectFieldDef);
    }

    get elementRef(): ReturnType<typeof selectElementRef> {
        return this._state$.get(selectElementRef);
    }

    get elementRef$(): Observable<ReturnType<typeof selectElementRef>> {
        return this._state$.get$(selectElementRef);
    }

    get instance(): ReturnType<typeof selectInstance> {
        return this._state$.get(selectInstance);
    }

    get instance$(): Observable<ReturnType<typeof selectInstance>> {
        return this._state$.get$(selectInstance);
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

    get children(): ReturnType<typeof selectChildren> {
        return this._state$.get(selectChildren);
    }

    get children$(): Observable<ReturnType<typeof selectChildren>> {
        return this._state$.get$(selectChildren);
    }

    get parent(): ReturnType<typeof selectParent> {
        return this._state$.get(selectParent);
    }

    get parent$(): Observable<ReturnType<typeof selectParent>> {
        return this._state$.get$(selectParent);
    }

    get renderer(): ReturnType<typeof selectRenderer> {
        return this._state$.get(selectRenderer);
    }

    get renderer$(): Observable<ReturnType<typeof selectRenderer>> {
        return this._state$.get$(selectRenderer);
    }

    get ngRenderer(): ReturnType<typeof selectNgRenderer> {
        return this._state$.get(selectNgRenderer);
    }

    get ngRenderer$(): Observable<ReturnType<typeof selectNgRenderer>> {
        return this._state$.get$(selectNgRenderer);
    }

    get hostForm(): ReturnType<typeof selectHostForm> {
        return this._state$.get(selectHostForm);
    }

    get hostForm$(): Observable<ReturnType<typeof selectHostForm>> {
        return this._state$.get$(selectHostForm);
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

    public setRenderer(renderer: RendererDirective | undefined): void {
        this._state$.updateKey('renderer', renderer);
    }

    public setNgRenderer(ngRenderer: Renderer2 | undefined): void {
        this._state$.updateKey('ngRenderer', ngRenderer);
    }

    public setHostForm(hostForm: FormComponent | undefined): void {
        this._state$.updateKey('hostForm', hostForm);
    }

    public setElementRef(elementRef: ElementRef | undefined): void {
        this._state$.updateKey('elementRef', elementRef);
    }

    public setInstance(instance: IPerformularOnInit | undefined): void {
        this._state$.updateKey('instance', instance);
    }

    protected _setParent(parent: Abstract): void {
        this._state$.updateKey('parent', parent);
    }

    protected _setParentOfChildren(): void {
        this.children.forEach((child: Abstract) => child._setParent(<Abstract>(this as any)));
    }

    protected _initFramework<T extends string>(property: IFrameworkProperty<T, A, S>): IFramework<A, S> {
        return {
            fieldCmp: Store.getFormComponent(property.field).target,
            fieldDef: property.field,
            attrs: property.attrs,
            styles: property.styles || {},
            children: []
        };
    }
}
