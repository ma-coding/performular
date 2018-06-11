import { Type } from '@angular/core';

import { Abstract, FieldType, IAbstract, TControl } from '../abstract';

export interface IPerformularOnInit<F extends Abstract = any> {
    performularOnInit(field: F): void;
}

export type FrameworkType<F extends Abstract = any> = Type<IPerformularOnInit<F>>;

export type BuildContextParams<T extends FieldType> = T extends TControl ? any : IAbstract;

export interface BuildContext<T extends FieldType> {
    params: BuildContextParams<T>;
}

export type BuildFunction<T extends FieldType> = (context: BuildContext<T>) => Abstract;

export interface IFormComponentDecoration<T extends FieldType> {
    name: string;
    builder?: BuildFunction<T>;
}

export type FormComponentDecorator<T extends FieldType> =
    (options: IFormComponentDecoration<T>) => ClassDecorator;

export function FormComponent<T extends FieldType>(
    options: IFormComponentDecoration<T>
): ClassDecorator {
    return (target: Function): void => {
        // TODO ADD TO STORE
    };
}

export const ControlComponent: FormComponentDecorator<TControl> = FormComponent<TControl>;
