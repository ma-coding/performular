import { Injectable } from '@angular/core';

import { Effect, IEffectContext } from '../../models/effect';
import { Field } from '../../models/field';
import { IOnValidate, IValidatorError } from '../../models/validation';
import { isEmptyValue } from '../cdk/is-empty-value';
import { PERFORMULAR_RUNDETECTOR_ONCHANGE } from '../run-detectors/on-change.run-detector';

export const PERFORMULAR_VALIDATOR_MAXLENGTH: 'maxlength' = 'maxlength';

@Effect({
    name: PERFORMULAR_VALIDATOR_MAXLENGTH,
    type: 'validator',
    runDetection: PERFORMULAR_RUNDETECTOR_ONCHANGE
})
@Injectable()
export class MaxLengthValidator implements IOnValidate<number> {

    constructor() { }

    public calculate(context: IEffectContext, params?: number): IValidatorError {
        const value: any = context.field.value;
        if (isEmptyValue(value) || isEmptyValue(params)) {
            return;
        }
        if (params) {
            const length: number = value ? value.length : 0;
            return length > params ? {
                __value__: value,
                __length__: length,
                __maxlength__: params
            } : undefined;
        }
    }

    public instanceRendered(field: Field, params?: number): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element && params) {
                field.ngRenderer.setAttribute(element, 'maxlength', params + '');
            }
        }
    }

    public validatorRemoved(field: Field, params?: number): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.removeAttribute(element, 'maxlength');
            }
        }
    }
}
