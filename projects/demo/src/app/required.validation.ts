import { Injectable } from '@angular/core';

import { MapType } from 'projects/core2/src/lib/misc';

import { Effect, Field, IEffectContext, IOnValidate } from '@performular/core';

@Effect({
    name: 'required',
    type: 'validator',
    runDetection: 'default'
})
@Injectable()
export class RequiredValidator implements IOnValidate<Field> {

    constructor() { }

    public calculate(context: IEffectContext, params?: any): MapType<any> | undefined {
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
            field.ngRenderer.setAttribute(field.elementRef.nativeElement.firstChild, 'required', 'true');
        }
    }
}
