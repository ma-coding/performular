import { Observable, of } from 'rxjs';

import { State } from '../../utils/state';
import { AbstractField } from '../abstract-field/abstract-field';
import { Abstract } from '../abstract/abstract';
import { ControlFieldOptions } from './types/control-field-options';
import { ControlFieldState } from './types/control-field-state';

export class ControlField extends AbstractField<ControlFieldState> {
    protected _state$: State<ControlFieldState>;

    constructor(options: ControlFieldOptions) {
        super();
        this._state$ = new State(<ControlFieldState>{
            ...this._initAbstractField(options),
            ...this._initValue(options),
            children: []
        });
    }

    protected _getUpdateWhen(): Observable<Abstract[]> {
        return of([]); // Todo: add right actions
    }

    protected _buildValue(children: AbstractField[]): any {}
}
