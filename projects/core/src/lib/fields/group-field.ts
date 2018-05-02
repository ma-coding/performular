import { RemoveKeys } from '../core/misc/remove-keys';
import { Store } from '../core/redux/store';
import { AbstractSchema } from '../core/schemas/abstract/abstract-schema';
import { IAbstractSchemaState } from '../core/schemas/abstract/abstract-schema.state';
import { FieldSchema } from '../core/schemas/field/field-schema';
import { FieldType, IFieldSchemaInitState, IFieldSchemaState } from '../core/schemas/field/field-schema.state';

export type IGroupFieldInitState<BindingsType> = RemoveKeys<IFieldSchemaInitState<BindingsType>, 'value' | 'type' | 'focus'>;

export class GroupField<BindingsType> extends FieldSchema<BindingsType> {

    private __store: Store<IFieldSchemaState<BindingsType>>;

    constructor(state: IGroupFieldInitState<BindingsType>) {
        super();
        this.__store = new Store(
            this._init({
                ...state,
                focus: false,
                type: FieldType.Group,
                value: this._buildValue(state.children)
            })
        );
    }

    public setValue(value: any, emitUpdate: boolean = false): void {
        const childFields: FieldSchema<any>[] = this._getChildFields();
        const keys: string[] = Object.keys(value);
        const keysLength: number = keys.length;
        keys.forEach((key: string, index: number) => {
            const foundChildField: FieldSchema<any> | undefined = childFields.find((child: FieldSchema<any>) => child.id === key);
            if (foundChildField) {
                foundChildField.setValue(value[key], keysLength === index + 1);
            }
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        const childFields: FieldSchema<any>[] = this._getChildFields();
        const keys: string[] = Object.keys(value);
        const keysLength: number = keys.length;
        Object.keys(value).forEach((key: string, index: number) => {
            const foundChildField: FieldSchema<any> | undefined = childFields.find((child: FieldSchema<any>) => child.id === key);
            if (foundChildField) {
                foundChildField.setValue(value[key], keysLength === index + 1);
            }
        });
    }

    protected _buildValue(children: AbstractSchema<any>[] = this.state.children): any {
        const childFields: FieldSchema<any>[] = this._getChildFields(children);
        return childFields.reduce((prev: any, child: FieldSchema<any>) => {
            prev[child.id] = child.value;
            return prev;
        }, {});
    }

    protected _getStore<T extends IAbstractSchemaState<BindingsType>>(): Store<T> {
        return this.__store as Store<any>;
    }
}
