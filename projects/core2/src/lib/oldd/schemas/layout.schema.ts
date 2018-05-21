import { BehaviorSubject } from 'rxjs';

import { generateUUID } from '../helpers/uuid';
import { IAbstractProperty } from '../properties/models/abstract-property.interface';
import { ILayoutProperty } from '../properties/models/layout-property.interface';
import { IPropertyOptions } from '../properties/models/property-options.interface';
import { PropertiesBuilder } from '../properties/properties-builder';
import { AbstractSchema } from './abstract.schema';
import { ILayoutSchemaState } from './models/layout-schema-state.interface';

export class LayoutSchema<BType> extends AbstractSchema<ILayoutSchemaState<BType>, BType> {

    protected _store$: BehaviorSubject<ILayoutSchemaState<BType>>;

    constructor(property: ILayoutProperty<any, any, any>, options: IPropertyOptions, value: any) {
        super(property, options, value);
        const children: AbstractSchema[] = this._buildChildren(property.children || [], value);
        this._initState = {
            ...this._initState,
            id: property.id || generateUUID(),
            children: children,
            hidden: this._calculateHidden(children)
        };

        this._store$ = new BehaviorSubject<ILayoutSchemaState<BType>>(this._initState);
    }

    protected _buildChild(property: IAbstractProperty<any, any, any>, value: any): AbstractSchema<any, any> {
        return PropertiesBuilder.build(property, this._options, value);
    }

    private _calculateHidden(children: AbstractSchema[] = this.children): boolean {
        return children.every((element: AbstractSchema<any>) => this.hidden);
    }

}
