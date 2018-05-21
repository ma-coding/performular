import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { IAbstractProperty } from '../properties/models/abstract-property.interface';
import { IArrayProperty } from '../properties/models/array-property.interface';
import { IPropertyOptions } from '../properties/models/property-options.interface';
import { PropertiesBuilder } from '../properties/properties-builder';
import { AbstractSchema } from './abstract.schema';
import { FieldSchema } from './field.schema';
import { IArraySchemaState } from './models/array-schema-state.interface';

export class ArraySchema<B> extends FieldSchema<IArraySchemaState<B>, B> {
    protected _store$: BehaviorSubject<IArraySchemaState<B>>;

    constructor(property: IArrayProperty<any, any, any>, options: IPropertyOptions, value: any) {
        super(property, options, value);
        const schemas: IAbstractProperty<any, any, any>[] = value.map((v: any) => property.childSchema);
        const children: AbstractSchema[] = this._buildChildren(schemas, value);
        const val: any = this._buildValue(children);
        this._initState = {
            ...this._initState,
            childSchema: property.childSchema,
            children: this._buildChildren(schemas, value),
            value: val,
            initValue: cloneDeep(val)
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    protected _buildChild(child: IAbstractProperty<any, any, any>, value: any, index: number): AbstractSchema<any, any> {
        return PropertiesBuilder.build(child, this._options, value[index]);
    }

    protected _buildValue(children: AbstractSchema[]): any {
        const childFields: FieldSchema[] = this.getChildFields(children);
        return childFields.map((child: FieldSchema) => {
            return child.value;
        });
    }
}
