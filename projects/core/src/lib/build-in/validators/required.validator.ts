import { Injectable } from '@angular/core';

import { Effect, IEffectContext } from '../../models/effect';
import { Field } from '../../models/field';
import { IOnValidate, IValidatorError } from '../../models/validation';
import { isEmptyValue } from '../cdk/is-empty-value';
import { PERFORMULAR_RUNDETECTOR_ONCHANGE } from '../run-detectors/on-change.run-detector';

export const PERFORMULAR_VALIDATOR_REQUIRED: 'required' = 'required';

@Effect({
    name: PERFORMULAR_VALIDATOR_REQUIRED,
    type: 'validator',
    runDetection: PERFORMULAR_RUNDETECTOR_ONCHANGE
})
@Injectable()
export class RequiredValidator implements IOnValidate<Field> {

    constructor() { }

    public calculate(context: IEffectContext, params?: any): IValidatorError {
        if (isEmptyValue(context.field.value)) {
            return {};
        }
    }

    public instanceRendered(field: Field, params: any): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.setAttribute(element, 'required', 'true');
            }
        }
    }

    public validatorRemoved(field: Field, params: any): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement | null = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            if (element) {
                field.ngRenderer.removeAttribute(element, 'required');
            }
        }
    }
}
