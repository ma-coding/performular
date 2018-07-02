import { Observable, of } from 'rxjs';

import { ParamType } from '../form/form';
import { use } from '../utils/mixin';
import { State } from '../utils/state';
import { Abstract, IAbstract, IAbstractParams, IAbstractProperty, TContainer } from './abstract';
import { AbstractField } from './abstract-field';
import { ILayoutProperty, Layout } from './layout/layout';

export interface IContainerParams<
    F extends string = any,
    A = any,
    S extends string = any,
    > extends IAbstractParams<TContainer, F, A, S>, ILayoutProperty {
    children: ParamType[];
}

export interface IContainerProperty<
    F extends string = any,
    A = any,
    S extends string = any
    > extends IAbstractProperty<TContainer, F, A, S>, ILayoutProperty {
    children: Abstract[];
}

export interface IContainer<
    A = any,
    S extends string = any
    > extends IAbstract<TContainer, A, S>, ILayoutProperty {
    hidden: boolean;
}

export function selectHidden(state: IContainer): boolean {
    return state.hidden;
}

export interface Container<
    A = any,
    S extends string = any,
    > extends Abstract<TContainer, A, S, IContainer<A, S>>, Layout<IContainer<A, S>> { }

export class Container<
    A = any,
    S extends string = any,
    > extends Abstract<TContainer, A, S, IContainer<A, S>> {

    protected _state$: State<IContainer<A, S>>;

    get hidden(): boolean {
        return this._state$.get(selectHidden);
    }

    get hidden$(): Observable<boolean> {
        return this._state$.get$(selectHidden);
    }

    @use(Layout) public this: Container | undefined;

    constructor(property: IContainerProperty<string, A, S>) {
        super(property);
        this._init = {
            ...this._init,
            ...this._initLayout(property),
            children: property.children
        };
        this._state$ = new State<IContainer<A, S>>(<any>this._init);
        this._setParentOfChildren();
    }

    protected _run(checklist: Abstract[]): Observable<void> {
        return of(undefined);
    }

    protected _update(): void {
        const hiddenCalc: boolean = this._analyzeHidden(this.children);
        if (this.hidden !== hiddenCalc) {
            this._state$.updateKey('hidden', hiddenCalc);
        }
    }

    private _analyzeHidden(children: Abstract[]): boolean {
        return children.every((child: Abstract) => {
            if (child instanceof Container) {
                return (<Container>child).hidden;
            } else {
                return (<AbstractField>child).hidden;
            }
        });
    }
}
