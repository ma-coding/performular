import { IAbstractProperty } from './models/abstract-property.interface';
import { IControlProperty } from './models/control-property.interface';
import { ILayoutProperty } from './models/layout-property.interface';

// tslint:disable-next-line
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K; }[keyof T];
type S<T> = Exclude<NonFunctionPropertyNames<T>, 'length'>;
export type Property<T> = T[S<T>];
export type FormTypes = Array<IAbstractProperty<any, any, any>>;

type Input = IControlProperty<'Input', { type: string }>;
type Select = IControlProperty<'Select', { count: number }>;
type Fieldset<P extends FormTypes> = ILayoutProperty<'Fieldset', { legend: string }, P>;

export interface Props extends FormTypes {
    0: Input;
    1: Fieldset<Props>;
    2: Select;
}

const M: Property<Props> = {
    type: 'layout',
    field: 'Fieldset',
    bindings: {
        legend: ''
    },
    children: [{
        type: 'control',
        field: 'Select',
        id: 'c',
        bindings: {
            count: 5
        }
    }]
};
