import { Store } from '../../core/redux/store';
import { AbstractSchema } from '../../core/schemas/abstract/abstract-schema';
import { IAbstractSchemaState } from '../../core/schemas/abstract/abstract-schema.state';
import { FieldSchema } from '../../core/schemas/field/field-schema';
import { FieldSchemaActions } from '../../core/schemas/field/field-schema.actions';
import { FieldType, IFieldSchemaState } from '../../core/schemas/field/field-schema.state';
import { IControlFieldInitState } from './control-field.state';

export class ControlField<BindingsType> extends FieldSchema<BindingsType> {

    private __store: Store<IFieldSchemaState<BindingsType>>;

    constructor(state: IControlFieldInitState<BindingsType>) {
        super();
        this.__store = new Store(
            this._init({
                ...state,
                children: [],
                type: FieldType.Control
            })
        );
    }

    public setValue(value: any, emitUpdate: boolean = true): void {
        this._getStore().dispatch(
            new FieldSchemaActions.SetValueAction(value)
        );
        if (emitUpdate) {
            this._updateParentValue();
        }
    }

    public patchValue(value: any, emitUpdate: boolean = true): void {
        this._getStore().dispatch(
            new FieldSchemaActions.PatchValueAction(value)
        );
        if (emitUpdate) {
            this._updateParentValue();
        }
    }

    protected _buildValue(children: AbstractSchema<any>[] = this.state.children): any {
        return 'NOVAL';
    }

    protected _getStore<T extends IAbstractSchemaState<BindingsType>>(): Store<T> {
        return this.__store as Store<any>;
    }
}
