import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { Loader } from '../loader';
import { IMetadata, Metadata } from '../metadata';
import { generateUUID } from '../misc';
import { Abstract } from './abstract';
import { Field } from './field';
import { RunDetectorHandler } from './run-detector';

export type CheckList = Abstract[];

export interface IEffectContext {
    checked: boolean;
    checklist: CheckList;
    field: Field;
}

export type EffectTypes = 'validator' | 'visible' | 'custom';

export interface IOnEffect<R = any, P = any> {
    calculate(context: IEffectContext, params?: P): R;
}

export type EffectType<R = any> = Type<IOnEffect<R>>;

export interface IEffectDecoration {
    name: string;
    type: EffectTypes;
    runDetection: string;
}

export function Effect(options: IEffectDecoration): ClassDecorator {
    return (target: Function): void => {
        Metadata.addEffect(options, <EffectType>target);
    };
}

export interface IEffect<P = any> {
    id?: string;
    params?: P;
    name: string;
}

export abstract class EffectHandler<T extends IEffect, R = any> {
    public id: string;
    public name: string;
    public params: any;
    public meta: IMetadata<IEffectDecoration, EffectType<R>>;
    public instance: IOnEffect<R>;
    public runDetector: RunDetectorHandler;

    constructor(effect: T) {
        this.id = effect.id || generateUUID();
        this.name = effect.name;
        this.params = effect.params;
        this.meta = Metadata.getEffect(effect.name);
        this.runDetector = new RunDetectorHandler(this.meta.metadata.runDetection);
        this.instance = Loader.get(this.meta.target);
    }

    public abstract run(context: IEffectContext): Observable<void>;

}
