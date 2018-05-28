import { Observable, of } from 'rxjs';

import { use } from '../mixin';
import { State } from '../state';
import { Abstract, IAbstract } from './abstract';
import { CheckList } from './effect';
import { ILayout, Layout } from './layout';

export interface IContainer<A, S extends string, P> extends IAbstract<'container', A, S> {
    children: P[];
    layout?: ILayout;
}

export interface IContainerState {
    children: Abstract[];
}

// tslint:disable-next-line:no-empty-interface
export interface Container<A = any, S extends string = any, P = any> extends Layout { }

// @dynamic
export class Container<A = any, S extends string = any, P = any> extends Abstract<A, S> {

    private _container$: State<IContainerState>;

    @use(Layout) public this: Container<A, S, P> | undefined;

    constructor(container: IContainer<A, S, any>) {
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
