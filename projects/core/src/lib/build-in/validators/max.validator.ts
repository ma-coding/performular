import { Injectable } from '@angular/core';

import { AbstractField } from '../../models/abstract-field';
import { IEffectContext } from '../../models/effects/effect';
import { IOnValidate, IValidatorError, Validator } from '../../models/effects/validation/validator';
import { isEmptyValue } from '../cdk/is-empty-value';
import { PERFORMULAR_RUNDETECTOR_ONCHANGE } from '../run-detectors/on-change.run-detector';

export const PERFORMULAR_VALIDATOR_MAX: 'max' = 'max';

@Validator({
    name: PERFORMULAR_VALIDATOR_MAX,
    runDetection: PERFORMULAR_RUNDETECTOR_ONCHANGE
})
@Injectable()
export class MaxValidator implements IOnValidate<number> {

    constructor() { }

    public calculate(context: IEffectContext, params?: number): IValidatorError {
        const value: any = context.field.value;
        if (isEmptyValue(value) || isEmptyValue(params)) {
            return;
        }
        const val: any = parseFloat(value);
        if (params) {
            return !isNaN(val) && val > params ? {
                __value__: val,
                __max__: params
            } : undefined;
        }
    }

    public instanceRendered(field: AbstractField, params?: number): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element && params) {
                field.ngRenderer.setAttribute(element, 'max', params + '');
            }
        }
    }

    public validatorRemoved(field: AbstractField, params?: number): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.removeAttribute(element, 'max');
            }
        }
    }
}
