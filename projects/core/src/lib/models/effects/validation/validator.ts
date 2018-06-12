import { Type } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '../../../form/store';
import { createObservable, MapType } from '../../../utils/misc';
import { AbstractField } from '../../abstract-field';
import { Effect, IEffectContext, IEffectDecoration, IEffectProperty, IOnEffect } from '../effect';

export type IValidatorError = MapType<string> | undefined;

export type IValidatorReturnType = IValidatorError | Observable<IValidatorError>;

export interface IOnValidate<P = any> extends IOnEffect<IValidatorError | Observable<IValidatorError>, P> {
    onRendered?(field: AbstractField, params: P): void;
    onRemoved?(field: AbstractField, params: P): void;
}

export type ValidatorType<P = any> = Type<IOnValidate<P>>;

export function Validator(options: IEffectDecoration): ClassDecorator {
    return (target: Function): void {
        Store.addEffect(options, <any>target);
    };
}

export interface IValidatorProperty<E extends string = any, P = any> extends IEffectProperty<E, P> {
    errorMsg: string;
}

export class ValidatorHandler<P = any> extends Effect<P, IValidatorReturnType, IOnValidate<P>> {

    public result: IValidatorError;
    public errorMsg: string;
    public error: string | undefined;

    constructor(validator: IValidatorProperty<any, P>) {
        super(validator);
        this.result = undefined;
        this.error = undefined;
        this.errorMsg = validator.errorMsg;
    }

    public run(context: IEffectContext): Observable<void> {
        if (!this.runDetection.eval(context)) {
            return of(undefined);
        }
        return createObservable(
            this.meta.instance.calculate(context, this.params)
        ).pipe(
            map((res: IValidatorError) => {
                this.result = res;
                this.error = res ? this._buildError(res) : undefined;
            })
        );
    }

    public instanceRendered(field: AbstractField): void {
        if (this.meta.instance.onRendered) {
            this.meta.instance.onRendered(field, this.params);
        }
    }

    public onRemoveValidator(field: AbstractField): void {
        if (this.meta.instance.onRemoved) {
            this.meta.instance.onRemoved(field, this.params);
        }
    }

    private _buildError(result: MapType<any>): string {
        let errorMsg: string = this.errorMsg;
        Object.keys(result).forEach((key: string) => {
            errorMsg = errorMsg.split(key).join(result[key]);
        });
        return errorMsg;
    }
}
