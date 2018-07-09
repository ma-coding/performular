import { Injectable } from '@angular/core';

import { AbstractField } from '../../models/abstract-field';
import { IEffectContext } from '../../models/effects';
import { IOnValidate, IValidatorError, Validator } from '../../models/effects/validation/validator';
import { isEmptyValue } from '../cdk/is-empty-value';
import { PERFORMULAR_RUNDETECTOR_ONCHANGE } from '../run-detectors/on-change.run-detector';

export const PERFORMULAR_VALIDATOR_MAXLENGTH: 'maxlength' = 'maxlength';

@Validator({
    name: PERFORMULAR_VALIDATOR_MAXLENGTH,
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

    public instanceRendered(field: AbstractField, params?: number): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element && params) {
                field.ngRenderer.setAttribute(element, 'maxlength', params + '');
            }
        }
    }

    public validatorRemoved(field: AbstractField, params?: number): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.removeAttribute(element, 'maxlength');
            }
        }
    }
}
