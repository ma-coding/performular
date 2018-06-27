import { Injectable } from '@angular/core';

import { AbstractField } from '../../models/abstract-field';
import { IEffectContext } from '../../models/effects/effect';
import { IOnValidate, IValidatorError, Validator } from '../../models/effects/validation/validator';
import { isEmptyValue } from '../cdk/is-empty-value';
import { PERFORMULAR_RUNDETECTOR_ONCHANGE } from '../run-detectors/on-change.run-detector';

export const PERFORMULAR_VALIDATOR_REQUIRED: 'required' = 'required';

@Validator({
    name: PERFORMULAR_VALIDATOR_REQUIRED,
    runDetection: PERFORMULAR_RUNDETECTOR_ONCHANGE
})
@Injectable()
export class RequiredValidator implements IOnValidate<void> {

    constructor() { }

    public calculate(context: IEffectContext, params?: void): IValidatorError {
        if (isEmptyValue(context.field.value)) {
            return {};
        }
    }

    public instanceRendered(field: AbstractField, params: void): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.setAttribute(element, 'required', 'true');
            }
        }
    }

    public validatorRemoved(field: AbstractField, params: void): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.removeAttribute(element, 'required');
            }
        }
    }
}
