import { IControlProperty } from './models/control-property.interface';
import { ILayoutProperty } from './models/layout-property.interface';
import { FormTypes, PropertyType } from './models/types';
import { PropertiesBuilder } from './properties-builder';

type Input = IControlProperty<'Input', { type: string }>;
type Select = IControlProperty<'Select', { count: number }>;
type Fieldset<P extends FormTypes> = ILayoutProperty<'Fieldset', { legend: string }, P>;

export interface Prop2 extends FormTypes {
    10: Select;
}

export interface Props extends Prop2 {
    0: Input;
    1: Fieldset<Props>;
}

const form: any = PropertiesBuilder.build({
    type: PropertyType.group,
    id: 'gg',
    field: 'Group',
    bindings: {

    },
    children: [
        {
            type: PropertyType.control,
            field: 'input',
            id: 'c',
        }
    ]
}, {
        errorStateWhen: ''
    }, {
        c: 5
    });
