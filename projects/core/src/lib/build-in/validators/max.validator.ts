import { Validator } from '../../decorator/static/validator';
import { ValidationExecuter } from '../../handler/validation/types/validation-executer';
import { AbstractFieldModel } from '../../model/abstract-field-model';
import { isEmptyValue } from '../../util/is-empty-value';
import { RunContext } from '../../util/types/run-context';
import { OnChangeRunDetector } from '../run-detection/on-change.run-detection';

export const PERFORMULAR_VALIDATOR_MAX: 'max' = 'max';

@Validator({
    name: PERFORMULAR_VALIDATOR_MAX,
    runDetector: OnChangeRunDetector
})
export class MaxValidator implements ValidationExecuter {
    constructor() {}

    public execute(context: RunContext, params?: number | Date): any {
        const value: any = (<AbstractFieldModel>context.field).value;
        if (isEmptyValue(value) || isEmptyValue(params)) {
            return;
        }
        const val: any = parseFloat(value);
        if (params) {
            return !isNaN(val) && val > params
                ? {
                      __value__: val,
                      __min__: params
                  }
                : undefined;
        }
    }
}
