import { Type } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '../../../form/store';
import { createObservable } from '../../../utils/misc';
import { Effect, IEffectContext, IEffectDecoration, IEffectProperty, IOnEffect } from '../effect';

export type IVisibleReturnType = boolean | Observable<boolean>;

export type IOnVisible<P = any> = IOnEffect<boolean | Observable<boolean>, P>;

export type VisibleType<P = any> = Type<IOnVisible<P>>;

export function Visible(options: IEffectDecoration): ClassDecorator {
    return (target: Function): void => {
        Store.addEffect(options, <any>target);
    };
}

export type IVisibleProperty<E extends string = any, P = any> = IEffectProperty<E, P>;

export class VisibleHandler<P = any> extends Effect<P, IVisibleReturnType, IOnVisible<P>> {

    public result: boolean;

    constructor(validator: IVisibleProperty<any, P>) {
        super(validator);
        this.result = false;
    }

    public run(context: IEffectContext): Observable<void> {
        if (!this.runDetection.eval(context)) {
            return of(undefined);
        }
        return createObservable(
            this.meta.instance.calculate(context, this.params)
        ).pipe(
            map((res: boolean) => {
                this.result = res;
            })
        );
    }
}
