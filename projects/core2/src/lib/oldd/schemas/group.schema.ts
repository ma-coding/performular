import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { IAbstractProperty } from '../properties/models/abstract-property.interface';
import { IGroupProperty } from '../properties/models/group-property.interface';
import { IPropertyOptions } from '../properties/models/property-options.interface';
import { PropertiesBuilder } from '../properties/properties-builder';
import { AbstractSchema } from './abstract.schema';
import { FieldSchema } from './field.schema';
import { IGroupSchemaState } from './models/group-schema-state.interface';

export class GroupSchema<B> extends FieldSchema<IGroupSchemaState<B>, B> {
    protected _store$: BehaviorSubject<IGroupSchemaState<B>>;

    constructor(property: IGroupProperty<any, any, any>, options: IPropertyOptions, value: any) {
        super(property, options, value);
        const children: AbstractSchema[] = this._buildChildren(property.children, value);
        const val: any = this._buildValue(children);
        this._initState = {
            ...this._initState,
            value: val,
            initValue: cloneDeep(val)
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    protected _buildChild(property: IAbstractProperty<any, any, any>, value: any): AbstractSchema<any, any> {
        return PropertiesBuilder.build(property, this._options, value);
    }

    protected _buildValue(children: AbstractSchema[]): any {
        const childFields: FieldSchema[] = this.getChildFields(children);
        return childFields.reduce((prev: any, child: FieldSchema) => {
            prev[child.id] = child.value;
            return prev;
        }, {});
    }

}
