import { Observable, of } from 'rxjs';

import { use } from '../mixin';
import { FormTypes, Property } from '../performular';
import { State } from '../state';
import { Abstract, IAbstract, IAbstractParams } from './abstract';
import { CheckList } from './effect';
import { ILayout, Layout } from './layout';

export interface IContainer<F extends string = any, A = any, S extends string = any, P extends FormTypes = any>
    extends IAbstract<'container', F, A, S> {
    children: Property<P>[];
    layout?: ILayout;
}

export interface IContainerParams<F extends string = any, A = any, S extends string = any> extends IAbstractParams<'container', F, A, S> {
    children: Abstract[];
    layout?: ILayout;
}

export interface IContainerState {
    children: Abstract[];
}

// tslint:disable-next-line:no-empty-interface
export interface Container<F extends string = any, A = any, S extends string = any, P = any> extends Layout { }

// @dynamic
export class Container<F extends string = any, A = any, S extends string = any, P = any> extends Abstract<'container', F, A, S> {

    private _container$: State<IContainerState>;

    @use(Layout) public this: Container<F, A, S, P> | undefined;

    constructor(container: IContainerParams<F, A, S>) {
        super(container);
        this._initLayout(container.layout);
        this._container$ = new State<IContainerState>({
            children: container.children
        });
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
        this._container$.getValue().children.forEach(cb);
    }

    protected _run(checklist: CheckList): Observable<void> {
        return of();
    }

    protected _update(): void {
    }
}
