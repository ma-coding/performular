import { State } from '../misc';
import { IContainerSchema } from '../models/schema';
import { IContainerState } from '../models/state';
import { AbstractSchema } from './abstract';
import { LayoutSchema } from './layout';

export class ContainerSchema<F, A, S extends string> extends AbstractSchema<'container', F, A, S> {

    private _container$: State<IContainerState>;
    public layout: LayoutSchema;

    constructor(container: IContainerSchema<F, A, S, any>) {
        super(container);
        this._container$ = new State<IContainerState>({
            autoHide: !!container.autoHide,
            children: [] // TODO: Build Children
        });
        this.layout = new LayoutSchema(container.layout);
    }

    protected _forEachChild(cb: (child: AbstractSchema) => void): void {
        this._container$.getValue().children.forEach(cb);
    }
}
