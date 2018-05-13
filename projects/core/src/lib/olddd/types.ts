import { ElementRef, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { Field } from './field';
import { ComponentHandler, ConverterHandler, EffectHandler } from './handler';

/*
 * Effects
 */

export enum TriggerStrategy {
    Self,
    Any
}

export enum VisibilityType {
    Disable,
    Hide
}

export interface IOnTrigger<ArgType = any> {
    onTrigger(field: Field, args: ArgType): boolean | Observable<boolean>;
}

export type TriggerFunction<ArgType = any> = (field: Field, args: ArgType) => boolean | Observable<boolean>;

export type TriggerType<ArgType = any> = string | TriggerFunction<ArgType> | Type<IOnTrigger<ArgType>>;

export interface IEffect<ArgType = any> {
    id?: string;
    strategy?: TriggerStrategy;
    trigger: TriggerType<ArgType>;
    args: ArgType;
}

export interface IValidationEffect<ArgType = any> extends IEffect<ArgType> {
    errorMsg: string;
}

export interface IVisibilityEffect<ArgType = any> extends IEffect<ArgType> {
    type: VisibilityType;
}
export type EffectSchema = IValidationEffect | IVisibilityEffect;

export interface ITriggerDecoration {
    id: string;
    strategy?: TriggerStrategy;
}

/*
 * Component
 */

export type ComponentSchema = Type<any> | string;

export interface IComponentDecoration {
    id: string;
}

/*
 * Converter
 */
export type ConverterSchema = Type<any> | string[];

export interface IConverterDecoration {
    id: string;
}
/*
 * Field
 */

export enum FieldType {
    Layout,
    Control,
    Group,
    Array
}

export interface IField<BType = any> {
    type: FieldType;
    component: ComponentSchema;
    bindings: BType;
    id?: string;
    children?: IField[] | IField;
    converters?: ConverterSchema[];
    effects?: EffectSchema[];
    autoHide?: boolean;
    focus?: boolean;
}

export interface IFieldOptions {
    errorState: boolean;
}

export interface IFieldState<BType = any> {
    id: string;
    uuid: string;
    type: FieldType;
    component: ComponentHandler;
    converters: ConverterHandler[];
    effects: EffectHandler[];
    options: IFieldOptions | undefined;
    value: any;
    initValue: any;
    bindings: BType;
    childSchema: IField | undefined;
    children: Field[];
    parent: Field | undefined;
    elementRef: ElementRef | undefined;
    instance: any | undefined;
    hidden: boolean;
    disabled: boolean;
    invalid: boolean;
    errorState: boolean;
    changed: boolean;
    dirty: boolean;
    autoHide: boolean;
    focus: boolean;
}
