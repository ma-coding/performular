import { Type } from '@angular/core';

import { Observable } from 'rxjs';

import { IInstancedMetadata, Store } from '../../form/store';
import { generateUUID } from '../../utils/misc';
import { Abstract } from '../abstract';
import { AbstractField } from '../abstract-field';
import { RunDetection } from './run-detection/run-detection';

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

export interface IEffectProperty<E extends string = any, P = any> {
    id?: string;
    params: P;
    name: E;
}

export abstract class Effect<P = any, R = any, ET extends IOnEffect<any, P> = IOnEffect<any, P>> {
    public id: string;
    public name: string;
    public params: P;
    public meta: IInstancedMetadata<ET, IEffectDecoration, EffectType<R>>;
    public runDetection: RunDetection;

    constructor(effect: IEffectProperty<any, P>) {
        this.id = effect.id || generateUUID();
        this.name = effect.name;
        this.params = effect.params;
        this.meta = Store.getEffect<ET>(effect.name);
        this.runDetection = new RunDetection(this.meta.metadata.runDetection);
    }

    public abstract run(context: IEffectContext): Observable<void>;
}
