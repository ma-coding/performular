import { Observable, of } from 'rxjs';

import { builder } from '../builder';
import { use } from '../mixin';
import { State } from '../state';
import { Abstract, IAbstract } from './abstract';
import { CheckList } from './effect';
import { ILayout, Layout } from './layout';
import { IOptions } from './options';

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

    constructor(container: IContainer<any, any, any>, options?: IOptions, value?: any) {
        super(container, options);
        this._initLayout(container.layout);
        this._container$ = new State<IContainerState>({
            children: container.children.map((def: IAbstract<any, any, any>) => {
                const child: Abstract = builder(def, options, value);
                child.setParent(this);
                return child;
            })
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
