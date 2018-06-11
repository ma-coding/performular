import { Type } from '@angular/core';

import { Abstract } from '../abstract';
import { AbstractField } from '../abstract-field';

export interface IEffectContext {
    checked: boolean;
    checklist: Abstract[];
    field: AbstractField;
}

export interface IOnEffect<R = any, P = any> {
    calculate(context: IEffectContext, params?: P): R;
}

export type EffectType<R = any> = Type<IOnEffect<R>>;

export interface IEffectDecoration {
    name: string;
    runDetection: string;
}

export interface IEffect<E extends string = any, P = any> {
    id?: string;
    params?: P;
    name: E;
}
