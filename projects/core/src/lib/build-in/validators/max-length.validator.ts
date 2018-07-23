import { Validator } from '../../decorator/static/validator';
import { ValidationExecuter } from '../../handler/validation/types/validation-executer';
import { AbstractFieldModel } from '../../model/abstract-field-model';
import { isEmptyValue } from '../../util/is-empty-value';
import { RunContext } from '../../util/types/run-context';
import { OnChangeRunDetector } from '../run-detection/on-change.run-detection';

export const PERFORMULAR_VALIDATOR_MAX_LENGTH: 'maxLength' = 'maxLength';

@Validator({
    name: PERFORMULAR_VALIDATOR_MAX_LENGTH,
    runDetector: OnChangeRunDetector
})
export class MaxLengthValidator implements ValidationExecuter {
    public execute(context: RunContext, params?: number): any {
        const value: any = (<AbstractFieldModel>context.field).value;
        if (isEmptyValue(value) || isEmptyValue(params)) {
            return;
        }
        if (params) {
            const length: number = value ? value.length : 0;
            return length < params
                ? {
                      __value__: value,
                      __length__: length,
                      __maxlength__: params
                  }
                : undefined;
        }
    }
}
