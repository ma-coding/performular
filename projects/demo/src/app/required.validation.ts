import { MapType } from 'projects/core2/src/lib/misc';

import { Effect, Field, IEffectContext, IOnValidate } from '@performular/core';

@Effect({
    name: 'required',
    type: 'validator',
    runDetection: 'default'
})
export class RequiredValidator implements IOnValidate<Field> {
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
}
