import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { IAbstractProperty } from '../properties/models/abstract-property.interface';
import { IControlProperty } from '../properties/models/control-property.interface';
import { IPropertyOptions } from '../properties/models/property-options.interface';
import { AbstractSchema } from './abstract.schema';
import { FieldSchema } from './field.schema';
import { IControlSchemaState } from './models/control-schema-state.interface';

export class ControlSchema<B> extends FieldSchema<IControlSchemaState<B>, B> {

    protected _store$: BehaviorSubject<IControlSchemaState<B>>;

    constructor(property: IControlProperty<any, any>, options: IPropertyOptions, value: any) {
        super(property, options, value);
        this._initState = {
            ...this._initState,
            focus: property.focus || false,
            value: value,
            initValue: cloneDeep(value)
        };
        this._store$ = new BehaviorSubject(this._initState);
    }

    public setFocus(focus: boolean): void {
        this._set({
            focus: focus
        });
    }

    protected _buildChild(property: IAbstractProperty<any, any, any>, value: any): AbstractSchema {
        throw new Error('This method cant be called!');
    }

    protected _buildValue(children: AbstractSchema<any, any>[]): any {
        throw new Error('This method cant be called!');
    }
}
