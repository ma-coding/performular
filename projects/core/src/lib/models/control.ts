import { State } from '../state';
import { Abstract, IAbstract, TControl } from './abstract';

export interface IControl extends IAbstract<TControl> {
    focus: boolean;
}

export class Control extends Abstract<TControl, IControl> {
    protected _state$: State<IControl>;

    constructor(control: IControl) {
        super(control);
        this._init = control;
        this._state$ = new State<IControl>(control);
    }
}
