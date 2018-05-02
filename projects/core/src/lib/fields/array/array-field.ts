import { ChildGeneratorLoader } from '../../core/loaders/generator-loader';
import { Store } from '../../core/redux/store';
import { AbstractSchema } from '../../core/schemas/abstract/abstract-schema';
import { AbstractSchemaActions } from '../../core/schemas/abstract/abstract-schema.actions';
import { IAbstractSchemaState } from '../../core/schemas/abstract/abstract-schema.state';
import { FieldSchema } from '../../core/schemas/field/field-schema';
import { FieldType, IFieldSchemaState } from '../../core/schemas/field/field-schema.state';
import { IArrayFieldInitState } from './array-field.state';

export class ArrayField<BindingsType> extends FieldSchema<BindingsType> {

    private __childGenerator: ChildGeneratorLoader<any>;
    private __store: Store<IFieldSchemaState<BindingsType>>;

    constructor(state: IArrayFieldInitState<BindingsType>) {
        super();
        this.__childGenerator = new ChildGeneratorLoader(state.children);
        const children: AbstractSchema<any>[] = state.value.map((value: any) => this.__childGenerator.callGenerator({ value: value }));
        this._resetChildParents(children);
        this.__store = new Store(
            this._init({
                ...state,
                focus: false,
                children: children,
                type: FieldType.Array,
                value: this._buildValue(children)
            })
        );
    }

    public setValue(value: any[], emitUpdate: boolean = false): void {
        this._handleChildFields(value);
        const childFields: FieldSchema<any>[] = this._getChildFields();
        value.forEach((val: any, index: number) => {
            if (childFields[index]) {
                childFields[index].setValue(val, value.length === index + 1);
            }
        });
    }

    public patchValue(value: any, emitUpdate: boolean = false): void {
        this._handleChildFields(value);
        const childFields: FieldSchema<any>[] = this._getChildFields();
        value.forEach((val: any, index: number) => {
            if (childFields[index]) {
                childFields[index].patchValue(val, value.length === index + 1);
            }
        });
    }

    public pushField(value?: any): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.PushChildAction(
                this.__childGenerator.callGenerator({
                    value: value
                })
            )
        );
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    public popField(): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.PopChildAction()
        );
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    public removeFieldAtIndex(index: number): void {
        this._getStore().dispatch(
            new AbstractSchemaActions.RemoveChildAtIndexAction(index)
        );
        this._resetChildParents();
        this._updateValue();
        this._updateParentValue();
    }

    protected _buildValue(children: AbstractSchema<any>[]): any {
        const childFields: FieldSchema<any>[] = this._getChildFields(children);
        return childFields.map((child: FieldSchema<any>) => {
            return child.value;
        });
    }

    protected _getStore<T extends IAbstractSchemaState<BindingsType>>(): Store<T> {
        return this.__store as Store<any>;
    }

    protected _handleChildFields(values: any[]): void {
        if (!values || !Array.isArray(values)) {
            this._getStore().dispatch(
                new AbstractSchemaActions.ClearChildrenAction()
            );
            return;
        }
        let childFields: FieldSchema<any>[] = this._getChildFields();
        if (values.length === childFields.length) {
            return;
        }
        while (values.length !== childFields.length) {
            if (values.length > childFields.length) {
                this._getStore().dispatch(
                    new AbstractSchemaActions.PushChildAction(
                        this.__childGenerator.callGenerator({
                            value: undefined
                        })
                    )
                );
            }
            if (values.length < childFields.length) {
                this._getStore().dispatch(
                    new AbstractSchemaActions.PopChildAction()
                );
            }
            childFields = this._getChildFields();
        }
        this._resetChildParents();
    }

    protected _resetChildParents(children: AbstractSchema<any>[] = this.children): void {
        children.forEach((child: AbstractSchema<any>) => {
            child.setParent(this);
        });
    }
}
