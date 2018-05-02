import { RemoveKeys } from '../core/misc/remove-keys';
import { generateUUID } from '../core/misc/uuid';
import { Store } from '../core/redux/store';
import { IAbstractSchemaState } from '../core/schemas/abstract/abstract-schema.state';
import { LayoutSchema } from '../core/schemas/layout/layout-schema';
import { ILayoutSchemaInitState, ILayoutSchemaState } from '../core/schemas/layout/layout-schema.state';

export type ILayoutFieldInitState<BindingsType> = RemoveKeys<ILayoutSchemaInitState<BindingsType>, 'id'>;

export class LayoutField<BindingsType> extends LayoutSchema<BindingsType> {

    private __store: Store<ILayoutSchemaState<BindingsType>>;

    constructor(state: ILayoutFieldInitState<BindingsType>) {
        super();
        this.__store = new Store(
            this._init({
                ...state,
                id: generateUUID()
            })
        );
    }

    protected _getStore<T extends IAbstractSchemaState<BindingsType>>(): Store<T> {
        return this.__store as Store<any>;
    }
}
