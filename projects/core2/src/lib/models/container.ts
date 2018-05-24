import { use } from '../mixin';
import { State } from '../state';
import { Abstract, IAbstract } from './abstract';
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
export class Container<A, S extends string, P> extends Abstract<A, S> {

    private _container$: State<IContainerState>;

    @use(Layout) public this: Container<A, S, P> | undefined;

    constructor(container: IContainer<A, S, P>) {
        super(container);
        this._initLayout(container.layout);
        this._container$ = new State<IContainerState>({
            children: [] // TODO: BUILD REAL CHILDERN
        });
    }

    protected _forEachChild(cb: (child: Abstract) => void): void {
    }
}
