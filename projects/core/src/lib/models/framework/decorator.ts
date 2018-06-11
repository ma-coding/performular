import { Type } from '@angular/core';

import { Store } from '../../form/store';
import { Abstract, FieldType, IAbstract, TContainer, TControl, TGroup, TList } from '../abstract';

export interface IPerformularOnInit<F extends Abstract = any> {
    performularOnInit(field: F): void;
}

export type FormComponentType<F extends Abstract = any> = Type<IPerformularOnInit<F>>;

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

export type ControlComponentDecorator = FormComponentDecorator<TControl>;
export type GroupComponentDecorator = FormComponentDecorator<TGroup>;
export type ListComponentDecorator = FormComponentDecorator<TList>;
export type ContainerComponentDecorator = FormComponentDecorator<TContainer>;

export function _addComponentToStore<T extends FieldType>(target: Function, options: IFormComponentDecoration<T>): void {
    Store.addFormComponent(options, <any>target);
}

export function ControlComponent(options: ControlComponentDecorator): ClassDecorator {
    return (target: Function): void => {
        _addComponentToStore<TControl>(target, options);
    };
}

export function GroupComponent(options: GroupComponentDecorator): ClassDecorator {
    return (target: Function): void => {
        _addComponentToStore<TGroup>(target, options);
    };
}

export function ListComponent(options: ListComponentDecorator): ClassDecorator {
    return (target: Function): void => {
        _addComponentToStore<TList>(target, options);
    };
}

export function ContainerComponent(options: ContainerComponentDecorator): ClassDecorator {
    return (target: Function): void => {
        _addComponentToStore<TContainer>(target, options);
    };
}
