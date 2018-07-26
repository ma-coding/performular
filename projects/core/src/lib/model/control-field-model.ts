import { Observable } from 'rxjs';

import { cloneDeep } from '../util/clone-deep';
import { State } from '../util/state';
import { ValueMode } from '../util/types/value-mode';
import { AbstractFieldModel } from './abstract-field-model';
import { ControlFieldModelOptions } from './types/control-field-model-options';
import { ControlFieldModelState } from './types/control-field-model-state';
import { ModelType } from '../builder/types/model-type';

export class ControlFieldModel<ATTRS = any> extends AbstractFieldModel<
    ControlFieldModelState<ATTRS>,
    ATTRS
> {
    protected _state$: State<ControlFieldModelState<ATTRS>>;

    get defaultValue(): ControlFieldModelState['defaultValue'] {
        return this._state$.select('defaultValue');
    }

    get defaultValue$(): Observable<ControlFieldModelState['defaultValue']> {
        return this._state$.select$('defaultValue');
    }

    constructor(options: ControlFieldModelOptions<ATTRS>) {
        super();
        const value: any = options.value || options.defaultValue || null;
        this._state$ = new State<ControlFieldModelState>({
            ...this._initAbstractFieldModel(options),
            initialValue: cloneDeep(value),
            value: cloneDeep(value),
            defaultValue: options.defaultValue,
            type: ModelType.CONTROL
        });
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        this._createValue(ValueMode.SET, value);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.SET);
        }
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        this._createValue(ValueMode.PATCH, value);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.PATCH);
        }
    }

    public resetValue(emitUpdate: boolean = true): void {
        this._createValue(ValueMode.RESET);
        if (emitUpdate) {
            this._updateParentValue([this], ValueMode.RESET);
        }
    }

    protected _buildValue(childFields: AbstractFieldModel<any>[]): any {}
}
