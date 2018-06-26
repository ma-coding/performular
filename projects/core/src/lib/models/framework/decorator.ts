import { Type } from '@angular/core';

import { Store } from '../../form/store';
import { Abstract, FieldType, IAbstractProperty, TContainer, TControl, TGroup, TList } from '../abstract';
import { IContainerProperty } from '../container';
import { IControlProperty } from '../control';
import { IGroupProperty } from '../group';
import { IListProperty } from '../list';

export interface IPerformularOnInit<F extends Abstract = any> {
    performularOnInit(field: F): void;
}

export type FormComponentType<F extends Abstract = any> = Type<IPerformularOnInit<F>>;

export type BuildContextParams<T extends FieldType> =
    T extends TControl ? IControlProperty :
    T extends TContainer ? IContainerProperty :
    T extends TGroup ? IGroupProperty :
    T extends TList ? IListProperty :
    IAbstractProperty;

export interface BuildContext<T extends FieldType> {
    params: BuildContextParams<T>;
}

export type BuildFunction<T extends FieldType> = (context: BuildContext<T>) => Abstract;

export interface IFormComponentDecoration<T extends FieldType> {
    name: string;
    builder: BuildFunction<T>;
}

export type ControlComponentDecorator = IFormComponentDecoration<TControl>;
export type GroupComponentDecorator = IFormComponentDecoration<TGroup>;
export type ListComponentDecorator = IFormComponentDecoration<TList>;
export type ContainerComponentDecorator = IFormComponentDecoration<TContainer>;

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
