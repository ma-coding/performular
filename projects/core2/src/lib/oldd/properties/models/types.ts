import { IAbstractProperty } from './abstract-property.interface';

// tslint:disable
type NonFunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K; }[keyof T];
type S<T> = Exclude<NonFunctionPropertyNames<T>, 'length'>;
export type Property<T> = T[S<T>];
export type FormTypes = Array<IAbstractProperty<any, any, any>>;


export enum PropertyType {
    control = 'control',
    array = 'array',
    group = 'group',
    layout = 'layout',
}
