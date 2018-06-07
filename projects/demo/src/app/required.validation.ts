import { Injectable } from '@angular/core';

import { Effect, Field, IEffectContext, IOnValidate } from '@performular/core';

@Effect({
    name: 'required',
    type: 'validator',
    runDetection: 'default'
})
@Injectable()
export class RequiredValidator implements IOnValidate<Field> {

    constructor() { }

    public calculate(context: IEffectContext, params?: any): any {
        if (
            context.field.value === undefined ||
            context.field.value === null ||
            context.field.value === ''
        ) {
            return {
                error: true
            };
        }
    }

    public instanceRendered(field: Field, params: any): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            field.ngRenderer.setAttribute(element, 'required', 'true');
        }
    }

    public validatorRemoved(field: Field, params: any): void {
        if (field.elementRef && field.ngRenderer) {
            const element: HTMLElement = document.getElementById(field.uuid) || field.elementRef.nativeElement.firstChild;
            field.ngRenderer.removeAttribute(element, 'required');
        }
    }
}
